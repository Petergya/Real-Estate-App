import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';
import { usePayment } from '../contexts/PaymentContext';
import { db, functions } from '../lib/firebase';
import {
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Plus,
  BarChart3,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  FileText,
  Filter,
  Edit,
  Bell,
  Activity
} from 'lucide-react';
import PropertyForm from '../components/PropertyForm';
import type { Property } from '../contexts/PropertyContext';
import { useNotification, Notification } from '../contexts/NotificationContext';

type ManagedUserRole = 'buyer' | 'agent' | 'landlord' | 'admin';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  status: 'active' | 'invited' | 'suspended';
}

interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  status: string;
  date: string;
  message: string;
}

const AdminDashboard: React.FC = () => {
  const { user, activityLogs, logout } = useAuth();
  const { properties, deleteProperty, getProperty } = useProperty();
  const { getAllTransactions } = usePayment();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<ManagedUserRole>('buyer');
  
  // Notification form state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<Notification['type']>('system');
  const [notifRole, setNotifRole] = useState<'all' | 'admin' | 'user'>('all');
  const [notifStatus, setNotifStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  const navigate = useNavigate();
  const allTransactions = getAllTransactions();

  const userSessions = React.useMemo(() => {
    const sessions = new Map<string, { name: string; email: string; role: string; lastLogin: string | null; lastLogout: string | null }>();
    
    managedUsers.forEach(u => {
      sessions.set(u.email, { name: u.name, email: u.email, role: u.role, lastLogin: null, lastLogout: null });
    });

    // Activity logs are prepended (newest first). First time we see an event type, it's the latest one!
    activityLogs.forEach(log => {
      if (!sessions.has(log.userEmail)) {
        sessions.set(log.userEmail, {
          name: log.userName,
          email: log.userEmail,
          role: log.userRole,
          lastLogin: null,
          lastLogout: null
        });
      }
      
      const s = sessions.get(log.userEmail)!;
      if (!s.lastLogin && (log.action === 'login' || log.action === 'register')) {
        s.lastLogin = log.timestamp;
      }
      if (!s.lastLogout && log.action === 'logout') {
        s.lastLogout = log.timestamp;
      }
    });

    return Array.from(sessions.values());
  }, [activityLogs, managedUsers]);

  useEffect(() => {
    if (!functions || user?.role !== 'admin') return;
    const listUsers = httpsCallable<undefined, { users: ManagedUser[] }>(functions, 'listManagedUsers');
    void listUsers().then(({ data }) => setManagedUsers(data.users)).catch((error: unknown) => {
      console.error('Unable to load managed users', error);
      toast.error('User list could not be loaded.');
    });
  }, [user]);

  useEffect(() => {
    if (!db || user?.role !== 'admin') return;
    return onSnapshot(collection(db, 'contactMessages'), (snapshot) => {
      setSupportTickets(snapshot.docs.map((ticket) => {
        const data = ticket.data();
        return {
          id: ticket.id,
          subject: data.subject || '(no subject)',
          user: data.email || 'Unknown',
          status: data.status || 'new',
          date: data.createdAt || '',
          message: data.message || '',
        };
      }).sort((left, right) => right.date.localeCompare(left.date)));
    }, (error) => {
      console.error('Unable to load support messages', error);
      toast.error('Support messages could not be loaded.');
    });
  }, [user]);

  const stats = {
    totalUsers: managedUsers.length,
    totalProperties: properties.length,
    totalTransactions: allTransactions.length,
    totalRevenueNgn: allTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount.ngn : 0), 0),
    pendingApprovals: properties.filter(p => p.availabilityStatus === 'available').length,
    activeListings: properties.filter(p => p.status === 'for-sale' || p.status === 'for-rent').length,
    houses: properties.filter(p => p.type === 'house').length,
    apartments: properties.filter(p => p.type === 'apartment').length,
    land: properties.filter(p => p.type === 'land').length,
    commercial: properties.filter(p => p.type === 'commercial').length,
  };

  const filteredProperties = propertyFilter === 'all'
    ? properties
    : properties.filter(p => p.type === propertyFilter);

  const filteredTransactions = transactionFilter === 'all'
    ? allTransactions
    : allTransactions.filter(t => t.status === transactionFilter);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'support', label: 'Support', icon: MessageSquare },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'notifications', label: 'Broadcast', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete') {
      try {
        await deleteProperty(propertyId);
      } catch (error) {
        console.error('Unable to delete property', error);
        toast.error('Property could not be deleted.');
      }
    }
  };

  const updateUserRole = async (userId: string, role: ManagedUserRole) => {
    if (!functions) return;
    try {
      const updateRole = httpsCallable(functions, 'setManagedUserRole');
      await updateRole({ userId, role });
      setManagedUsers((previous) => previous.map((managedUser) => managedUser.id === userId ? { ...managedUser, role } : managedUser));
    } catch (error) {
      console.error('Unable to change user role', error);
      toast.error(error instanceof Error ? error.message : 'User role could not be changed.');
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      if (!functions) return;
      try {
        const removeUser = httpsCallable(functions, 'deleteManagedUser');
        await removeUser({ userId });
        setManagedUsers((previous) => previous.filter((managedUser) => managedUser.id !== userId));
      } catch (error) {
        console.error('Unable to delete user', error);
        toast.error(error instanceof Error ? error.message : 'User account could not be deleted.');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-400 mb-6">You don&apos;t have permission to access this page. Sign in with an admin account.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/admin/login"
              className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-secondary font-medium text-center"
            >
              Admin Sign In
            </Link>
            <Link
              to="/admin/register"
              className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 font-medium text-center"
            >
              Create Admin Account
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Regular user?{' '}
            <Link to="/login" className="text-gold hover:text-gold">User Login</Link>
          </p>
        </div>
      </div>
    );
  }

  const toggleUserStatus = async (userId: string) => {
    const target = managedUsers.find((managedUser) => managedUser.id === userId);
    if (!target || !functions) return;
    const suspended = target.status !== 'suspended';
    try {
      const updateStatus = httpsCallable(functions, 'setManagedUserStatus');
      await updateStatus({ userId, suspended });
      setManagedUsers((previous) => previous.map((managedUser) => managedUser.id === userId
        ? { ...managedUser, status: suspended ? 'suspended' : 'active' }
        : managedUser));
    } catch (error) {
      console.error('Unable to change user status', error);
      toast.error(error instanceof Error ? error.message : 'User status could not be changed.');
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !functions) return;
    try {
      const inviteUser = httpsCallable<
        { name: string; email: string; role: string },
        { id: string }
      >(functions, 'inviteManagedUser');
      const result = await inviteUser({
        name: inviteName.trim() || inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setManagedUsers((previous) => [...previous, {
        id: result.data.id,
        name: inviteName.trim() || inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: inviteRole,
        status: 'active',
      }]);
      setInviteEmail('');
      setInviteName('');
      toast.success('Invitation sent by email.');
    } catch (error) {
      console.error('Unable to invite user', error);
      toast.error(error instanceof Error ? error.message : 'Invitation could not be sent.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;
    
    try {
      await addNotification({
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        targetRole: notifRole
      });
      setNotifStatus('success');
      setNotifTitle('');
      setNotifMessage('');
      setTimeout(() => setNotifStatus('idle'), 3000);
    } catch {
      setNotifStatus('error');
      setTimeout(() => setNotifStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar - Admin-specific dark layout */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-gold" />
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Habixa Properties</p>
        </div>

        <div className="px-4 py-3">
          <button
            onClick={() => { setEditingProperty(null); setActiveTab('add-property'); }}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-navy hover:bg-secondary text-white rounded-lg text-sm font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-navy text-white'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center px-4 py-2 mb-3">
            <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-slate-400 hover:text-white text-sm"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-400 hover:text-red-300 text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.label || 'Admin Dashboard'}
            </h1>
            <p className="text-slate-400 mt-1">
              {activeTab === 'overview' && 'Platform overview and key metrics'}
              {activeTab === 'add-property' && (editingProperty ? 'Edit property details' : 'Add a new property listing')}
              {activeTab === 'properties' && 'Manage all property listings'}
              {activeTab === 'users' && 'User accounts and roles'}
              {activeTab === 'activity' && 'Real-time user logins, signups, and logouts'}
              {activeTab === 'transactions' && 'Payment and transaction history'}
              {activeTab === 'reports' && 'Analytics and reports'}
              {activeTab === 'support' && 'Support tickets and feedback'}
              {activeTab === 'settings' && 'Platform configuration'}
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <Users className="h-8 w-8 text-gold mb-3" />
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <Home className="h-8 w-8 text-emerald-400 mb-3" />
                  <p className="text-slate-400 text-sm">Properties</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalProperties}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <DollarSign className="h-8 w-8 text-amber-400 mb-3" />
                  <p className="text-slate-400 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ₦{stats.totalRevenueNgn.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <CheckCircle className="h-8 w-8 text-lime-400 mb-3" />
                  <p className="text-slate-400 text-sm">Active Listings</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.activeListings}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Property by type */}
<div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Properties by Type</h3>
                      <button
                        onClick={() => { setEditingProperty(null); setActiveTab('add-property'); }}
                        className="text-sm text-gold hover:text-gold flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Property
                      </button>
                    </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Houses', count: stats.houses, color: 'bg-gold/100' },
                      { label: 'Apartments', count: stats.apartments, color: 'bg-emerald-500' },
                      { label: 'Land', count: stats.land, color: 'bg-amber-500' },
                      { label: 'Commercial', count: stats.commercial, color: 'bg-lime-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-white font-medium">{item.count}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${stats.totalProperties ? (item.count / stats.totalProperties) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent activity & system health */}
                <div className="space-y-6">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', text: 'New property approved', time: '2 min ago' },
                        { icon: Users, color: 'text-gold', bg: 'bg-gold/100/20', text: 'New user registered', time: '15 min ago' },
                        { icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/20', text: 'Payment processed', time: '1 hr ago' },
                      ].map((a) => {
                        const Icon = a.icon;
                        return (
                          <div key={a.text} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                            <div className={`p-2 rounded-lg ${a.bg}`}><Icon className={`h-4 w-4 ${a.color}`} /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">{a.text}</p>
                              <p className="text-xs text-slate-400">{a.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setEditingProperty(null); setActiveTab('add-property'); }}
                        className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-gold/20 border border-slate-600 hover:border-gold/50 text-left transition-colors"
                      >
                        <Plus className="h-5 w-5 text-gold mr-2" />
                        <span className="text-sm text-white">Add Property</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('properties')}
                        className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600 border border-slate-600 text-left transition-colors"
                      >
                        <Home className="h-5 w-5 text-slate-400 mr-2" />
                        <span className="text-sm text-white">Manage Properties</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('users')}
                        className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600 border border-slate-600 text-left transition-colors"
                      >
                        <Users className="h-5 w-5 text-slate-400 mr-2" />
                        <span className="text-sm text-white">Manage Users</span>
                      </button>
                      <Link
                        to="/properties/map"
                        className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600 border border-slate-600 text-left transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5 text-slate-400 mr-2" />
                        <span className="text-sm text-white">View Map</span>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Server', status: 'Online', ok: true },
                        { label: 'Database', status: 'Connected', ok: true },
                        { label: 'Payment Gateway', status: 'Active', ok: true },
                        { label: 'Email Service', status: 'Degraded', ok: false },
                      ].map((s) => (
                        <div key={s.label} className="flex justify-between items-center">
                          <span className="text-slate-300">{s.label}</span>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${s.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className={`text-sm font-medium ${s.ok ? 'text-emerald-400' : 'text-amber-400'}`}>{s.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Property Tab */}
          {activeTab === 'add-property' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {editingProperty ? 'Edit Property' : 'Add New Property'}
                  </h3>
                  {editingProperty && (
                    <button
                      onClick={() => { setEditingProperty(null); setActiveTab('properties'); }}
                      className="text-sm text-slate-400 hover:text-white"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-lg p-6 max-h-[70vh] overflow-y-auto">
                  <PropertyForm
                    editProperty={editingProperty || undefined}
                    onClose={() => { setEditingProperty(null); setActiveTab('properties'); }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-slate-400" />
                  <select
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="house">Houses</option>
                    <option value="apartment">Apartments</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingProperty(null); setActiveTab('add-property'); }}
                    className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-lg hover:bg-secondary text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm font-medium">
                    Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredProperties.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg mr-3" />
                            <div>
                              <p className="text-sm font-medium text-white">{p.title}</p>
                              <p className="text-xs text-slate-400">{p.location.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300 capitalize">{p.type}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{p.owner.name}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          ${p.price.usd.toLocaleString()}
                          <span className="text-xs text-slate-400 font-normal block mt-1">₦{p.price.ngn.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'for-sale' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-light'}`}>
                            {p.status === 'for-sale' ? 'Sale' : 'Rent'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Link to={`/property/${p.id}`} className="p-2 text-slate-400 hover:text-white rounded" title="View"><Eye className="h-4 w-4" /></Link>
                            <button
                              onClick={() => { setEditingProperty(getProperty(p.id) || p); setActiveTab('add-property'); }}
                              className="p-2 text-gold hover:text-gold rounded"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-emerald-400 hover:text-emerald-300 rounded" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                            <button className="p-2 text-amber-400 hover:text-amber-300 rounded" title="Reject"><XCircle className="h-4 w-4" /></button>
                            <button onClick={() => handlePropertyAction(p.id, 'delete')} className="p-2 text-red-400 hover:text-red-300 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h4 className="font-medium text-white mb-3">Invite User</h4>
                <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Name (optional)"
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-gold"
                  />
                  <select
                    value={inviteRole}
                    onChange={(event) => setInviteRole(event.target.value as ManagedUserRole)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="agent">Agent</option>
                    <option value="landlord">Landlord</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-secondary">
                    Send Invite
                  </button>
                </form>
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {managedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-white">{u.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={e => updateUserRole(u.id, e.target.value as ManagedUserRole)}
                            className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                          >
                            <option value="buyer">Buyer</option>
                            <option value="agent">Agent</option>
                            <option value="landlord">Landlord</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                            u.status === 'invited' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            {u.role !== 'admin' && (
                              <button onClick={() => updateUserRole(u.id, 'admin')} className="text-xs text-gold hover:text-gold">Make Admin</button>
                            )}
                            <button onClick={() => toggleUserStatus(u.id)} className="text-xs text-amber-400 hover:text-amber-300">
                              {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </button>
                            <button onClick={() => deleteUser(u.id)} className="text-xs text-red-400 hover:text-red-300">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <select
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm">Export</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((t) => {
                        const prop = properties.find(p => p.id === t.propertyId);
                        return (
                          <tr key={t.id} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4 text-sm font-mono text-slate-300">#{t.id.slice(-8)}</td>
                            <td className="px-6 py-4 text-sm text-white">{prop?.title || 'Unknown'}</td>
                            <td className="px-6 py-4 text-sm font-medium text-white">
                              ₦{t.amount.ngn.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                t.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                              }`}>{t.status}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No transactions yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-gold" />
                  Revenue Report
                </h3>
                <div className="h-64 flex items-center justify-center rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="text-center text-slate-400">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Revenue chart would display here</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gold" />
                  User Growth
                </h3>
                <div className="h-64 flex items-center justify-center rounded-lg bg-slate-700/50 border border-slate-600">
                  <div className="text-center text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>User growth chart would display here</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Generate Report</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-secondary">Monthly Report</button>
                  <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600">Quarterly Report</button>
                  <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600">Yearly Report</button>
                </div>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {supportTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {t.subject}
                        <span className="block max-w-md truncate text-xs font-normal text-slate-400">{t.message}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{t.user}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          t.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-gold/100/20 text-gold'
                        }`}>{t.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{t.date ? new Date(t.date).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* User Sessions / Activity Logs Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-gold/100/20 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Total App Users</h3>
                    <p className="text-2xl font-bold text-gold mt-1">{userSessions.length} Tracked Accounts</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-gold" />
                    User Access Records
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Last Login Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Last Logout Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {userSessions.length > 0 ? (
                        userSessions.map((session) => (
                          <tr key={session.email} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4 text-sm font-medium text-white">{session.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-400">{session.email}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs rounded border border-slate-600 bg-slate-700 text-slate-300 capitalize">
                                {session.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-emerald-400 font-medium">
                              {session.lastLogin ? new Date(session.lastLogin).toLocaleString() : <span className="text-slate-500">Never</span>}
                            </td>
                            <td className="px-6 py-4 text-sm text-amber-400 font-medium">
                              {session.lastLogout ? new Date(session.lastLogout).toLocaleString() : <span className="text-slate-500">Never</span>}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No user sessions recorded yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Broadcast Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Broadcast Notification</h3>
                  <p className="text-sm text-slate-400 mt-1">Send a notification to specific user roles across the platform.</p>
                </div>
                <Bell className="h-10 w-10 text-gold opacity-20" />
              </div>

              {notifStatus === 'success' && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center text-emerald-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">Notification broadcasted successfully!</p>
                </div>
              )}

              {notifStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400">
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">Failed to send notification. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleSendNotification} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={notifRole}
                    onChange={(e) => setNotifRole(e.target.value as typeof notifRole)}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-gold"
                  >
                    <option value="all">All Users (Admins & Regular)</option>
                    <option value="admin">Administrators Only</option>
                    <option value="user">Regular Users Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Notification Type</label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as Notification['type'])}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-gold"
                  >
                    <option value="system">System Update / Alert</option>
                    <option value="message">Message / Announcement</option>
                    <option value="payment">Payment / Financial</option>
                    <option value="property">Property / Listing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="E.g., Scheduled Maintenance Downtime"
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Message Detail</label>
                  <textarea
                    required
                    rows={4}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Enter the detailed body of the notification here..."
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-gold resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-3 bg-navy text-white rounded-lg hover:bg-secondary font-medium transition-colors"
                  >
                    Broadcast Notification
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h4 className="font-medium text-white mb-4">Payment Configuration</h4>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Service Fee %</label>
                    <input type="number" defaultValue="3" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Agent Commission %</label>
                    <input type="number" defaultValue="10" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h4 className="font-medium text-white mb-4">Exchange Rate</h4>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">USD to NGN</label>
                  <input type="number" defaultValue="1600" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
              </div>
              <button className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-secondary">
                Save Settings
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
