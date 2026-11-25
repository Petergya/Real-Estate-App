import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminRegister: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
    <div className="max-w-md text-center">
      <Shield className="h-14 w-14 text-gold mx-auto mb-5" />
      <h1 className="text-2xl font-bold text-white mb-3">Admin access is restricted</h1>
      <p className="text-slate-300 mb-6">
        Admin accounts must be created and authorized by a Firebase project administrator.
      </p>
      <Link to="/admin/login" className="inline-flex rounded-md bg-gold px-5 py-3 font-medium text-navy hover:bg-gold-hover">
        Go to Admin Sign In
      </Link>
    </div>
  </div>
);

export default AdminRegister;
