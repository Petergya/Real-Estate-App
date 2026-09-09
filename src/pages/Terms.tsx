import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Terms: React.FC = () => (
  <div className="min-h-screen bg-light">
    <section className="bg-navy text-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          <FileText className="h-9 w-9" />
          Terms of Service
        </h1>
        <p className="text-white/80 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </section>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 prose prose-slate max-w-none">
        <p className="text-gray-600">By using Habixa Properties, you agree to these terms of service. Please read them carefully.</p>
        <h2 className="text-xl font-semibold text-ink mt-8">Use of Service</h2>
        <p className="text-gray-600">You agree to use our platform only for lawful purposes. Property listings are provided for informational purposes; we recommend verifying all details before making decisions.</p>
        <h2 className="text-xl font-semibold text-ink mt-6">Property Listings</h2>
        <p className="text-gray-600">Listings are submitted by third parties. Habixa Properties does not guarantee the accuracy of listings and is not responsible for transactions between users and property owners.</p>
        <h2 className="text-xl font-semibold text-ink mt-6">Contact</h2>
        <p className="text-gray-600">For questions about these terms, contact us at <a href="mailto:support@habixaproperties.com" className="text-gold hover:underline">support@habixaproperties.com</a>.</p>
      </div>
    </div>
  </div>
);

export default Terms;
