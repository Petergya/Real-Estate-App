import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Shield, Camera, Save, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, deleteAccount, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'buyer'
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as any
      });
      toast.success('Your profile has been updated successfully.');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount(user.id);
        toast.success('Your account has been deleted successfully.');
        navigate('/login');
      } catch (error) {
        toast.error('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gold/15 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-ink mb-2">{user.name}</h3>
              <p className="text-gray-600 mb-4 capitalize">{user.role}</p>
              
              <div className="flex items-center justify-center mb-4">
                <Shield className={`h-5 w-5 mr-2 ${
                  user.isVerified ? 'text-green-500' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  user.isVerified ? 'text-gold' : 'text-gray-500'
                }`}>
                  {user.isVerified ? 'Verified Account' : 'Unverified Account'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>KYC Status:</span>
                    <span className={`font-medium capitalize ${
                      user.kycStatus === 'approved' ? 'text-gold' :
                      user.kycStatus === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {user.kycStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-ink">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-primary hover:text-accent transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center bg-primary text-white px-3 py-1 rounded-md hover:bg-secondary transition-colors text-sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="buyer">Buyer/Tenant</option>
                      <option value="agent">Real Estate Agent</option>
                      <option value="landlord">Property Owner/Landlord</option>
                    </select>
                  </div>
                </div>

                {/* Security Section */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-ink mb-4">Security</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-ink mb-4">Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                        <p className="text-sm text-gray-500">Receive email updates about your properties and transactions</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                        <p className="text-sm text-gray-500">Receive SMS alerts for important updates</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Marketing Communications</label>
                        <p className="text-sm text-gray-500">Receive promotional offers and market insights</p>
                      </div>
                      <input
                        type="checkbox"
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-red-600 mb-4">Danger Zone</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-red-800">Delete Account</h5>
                        <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                      </div>
                      <button 
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;