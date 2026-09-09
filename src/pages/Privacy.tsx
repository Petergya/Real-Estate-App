import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacy: React.FC = () => (
  <div className="min-h-screen bg-light">
    <section className="bg-navy text-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          <Shield className="h-9 w-9" />
          Privacy Policy
        </h1>
        <p className="text-white/80 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </section>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 prose prose-slate max-w-none">
        <p className="text-gray-600">Habixa Properties respects your privacy. This policy describes how we collect, use, and protect your personal information when you use our platform.</p>
        <h2 className="text-xl font-semibold text-ink mt-8">Information We Collect</h2>
        <p className="text-gray-600">We collect information you provide when registering, searching for properties, or contacting us—including name, email, phone number, and preferences.</p>
        <h2 className="text-xl font-semibold text-ink mt-6">How We Use Your Information</h2>
        <p className="text-gray-600">We use your information to personalize your experience, process transactions, send relevant property listings, and improve our services.</p>
        <h2 className="text-xl font-semibold text-ink mt-6">Contact</h2>
        <p className="text-gray-600">For privacy-related questions, contact us at <a href="mailto:support@habixaproperties.com" className="text-gold hover:underline">support@habixaproperties.com</a>.</p>
      </div>
    </div>
  </div>
);

export default Privacy;
