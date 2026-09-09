import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Home,
  Search,
  Map,
  Info,
  FileText,
  Shield,
  ChevronRight,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thanks for subscribing! We\'ll keep you updated on new listings.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Building2 className="h-9 w-9 text-gold" />
              <span className="text-xl font-bold text-white">Habixa Properties</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted partner in finding the perfect property. Browse houses, apartments, lands, and commercial spaces across Nigeria.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-gold flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-gold flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-gold flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gold" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"><Home className="h-3.5 w-3.5" />Home</Link></li>
              <li><Link to="/properties" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"><Search className="h-3.5 w-3.5" />Browse Properties</Link></li>
              <li><Link to="/properties/map" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"><Map className="h-3.5 w-3.5" />Map View</Link></li>
              <li><Link to="/about" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"><Info className="h-3.5 w-3.5" />About Us</Link></li>
              <li><Link to="/contact" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"><Mail className="h-3.5 w-3.5" />Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gold" />
              Property Types
            </h3>
            <ul className="space-y-2.5">
              <li><Link to="/properties/type/house" className="text-gray-400 hover:text-white transition-colors text-sm">Houses</Link></li>
              <li><Link to="/properties/type/apartment" className="text-gray-400 hover:text-white transition-colors text-sm">Apartments</Link></li>
              <li><Link to="/properties/type/land" className="text-gray-400 hover:text-white transition-colors text-sm">Land</Link></li>
              <li><Link to="/properties/type/commercial" className="text-gray-400 hover:text-white transition-colors text-sm">Commercial</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gold" />
              Contact Us
            </h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm">Jos, Nigeria. Mon–Fri, 9AM–6PM WAT</span>
              </li>
              <li>
                <a href="tel:+2341234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                  +234 123 456 7890
                </a>
              </li>
              <li>
                <a href="mailto:support@habixaproperties.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                  support@habixaproperties.com
                </a>
              </li>
            </ul>
            <div>
              <h3 className="text-white font-semibold mb-2 text-sm">Newsletter</h3>
              <p className="text-gray-400 text-xs mb-3">Get new listings and updates delivered to your inbox.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
                <button type="submit" className="px-4 py-2 rounded-lg bg-gold text-navy hover:bg-gold/90 transition-colors flex items-center gap-1" aria-label="Subscribe">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield className="h-4 w-4" />
              <span>© {new Date().getFullYear()} Habixa Properties. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors"><FileText className="h-3.5 w-3.5" />Privacy Policy</Link>
              <Link to="/terms" className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors"><Shield className="h-3.5 w-3.5" />Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
