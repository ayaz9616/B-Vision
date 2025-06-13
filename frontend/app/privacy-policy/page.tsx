'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const formattedDate = new Date().toLocaleDateString();
        setLastUpdated(formattedDate);
    }, []);
  return (
    <div className="relative min-h-screen w-full bg-[#0a0c23] text-white px-6 py-16">
      
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto">

        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-gradient bg-gradient-to-r from-purple-400 via-green-400 to-amber-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <p className="text-slate-300 text-lg mb-6">
          Last updated: {lastUpdated}
        </p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">1. Introduction</h2>
            <p>
              Welcome to <span className="font-bold text-indigo-400">B Vision</span>. Your privacy is important to us.
              This Privacy Policy explains how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">2. Information We Collect</h2>
            <ul className="list-disc list-inside">
              <li>Uploaded files for analysis</li>
              <li>Email address (if applicable)</li>
              <li>Technical data (IP address, browser type, device info)</li>
              <li>Usage data for improving services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside">
              <li>To analyze uploaded files and generate insights</li>
              <li>To improve our platform and services</li>
              <li>For customer support and communication</li>
              <li>To maintain security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">4. Data Security</h2>
            <p>
              We implement strict security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">5. Third-Party Services</h2>
            <p>
              We do not sell or share your data with third parties, except trusted services we use for hosting, analytics, or processing — always under strict agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">6. Your Rights</h2>
            <p>
              You have the right to request access, correction, or deletion of your personal data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">8. Contact Us</h2>
            <p>
              If you have any questions, please contact us at: 
              <span className="text-green-400 ml-1">ayaz9616835404@gmail.com</span>
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-indigo-400 hover:underline text-lg">← Back to Home</Link>
        </div>

      </div>
    </div>
  );
}
