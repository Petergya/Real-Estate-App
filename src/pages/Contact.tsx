import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotification } from '../contexts/NotificationContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const { addNotification } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    addNotification({
      type: 'message',
      title: `Message from ${formData.name}`,
      message: formData.message,
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-light">
      <section className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-white/80">Have questions? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-gold mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink">Email</h3>
                  <a href="mailto:support@habixaproperties.com" className="text-gray-600 hover:text-gold">support@habixaproperties.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-gold mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink">Phone</h3>
                  <a href="tel:+2341234567890" className="text-gray-600 hover:text-gold">+234 123 456 7890</a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-gold mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink">Office</h3>
                  <p className="text-gray-600">Jos, Nigeria. Mon–Fri, 9AM–6PM WAT</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-ink mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <button type="submit" className="flex items-center bg-navy text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
