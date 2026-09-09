import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Target, Users, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  const values = [
    { icon: Target, title: 'Our Mission', description: 'To make finding the perfect property simple and transparent for everyone across Nigeria.' },
    { icon: Users, title: 'Our Team', description: 'Experienced professionals dedicated to helping you find your dream home or investment.' },
    { icon: Award, title: 'Our Commitment', description: 'Integrity, transparency, and exceptional service in every transaction we facilitate.' }
  ];

  return (
    <div className="min-h-screen bg-light">
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Building2 className="h-16 w-16 mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Habixa Properties</h1>
            <p className="text-xl text-white/80 max-w-2xl">Your trusted partner in finding premium properties across Nigeria</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-ink mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Habixa Properties was founded with a simple goal: to connect people with their ideal properties.
                Whether you&apos;re looking for a cozy apartment, a family home, land to build on, or a commercial space, we make the search easier.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We serve buyers, renters, landlords, and agents across Nigeria with a modern platform for property discovery.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-ink mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                {['Verified property listings', 'Easy scheduling for viewings', 'Transparent pricing', 'Map view', 'Secure payments'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gold font-bold mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-ink mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <Icon className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-ink mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/contact" className="inline-block bg-navy text-white px-8 py-3 rounded-md hover:bg-secondary transition-colors mr-4">
            Contact Us
          </Link>
          <Link to="/properties" className="inline-block border-2 border-gold text-gold px-8 py-3 rounded-md hover:bg-gold/10 transition-colors">
            Browse Properties
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
