'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString();
    setLastUpdated(formattedDate);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0c23] text-white px-6 py-16">
      {/* Background bubbles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-gradient bg-gradient-to-r from-purple-400 via-green-400 to-amber-400 bg-clip-text text-transparent">
          Terms of Service
        </h1>

        <p className="text-slate-300 text-lg mb-6">
          Last updated: {lastUpdated}
        </p>

        <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
          <p>Welcome to B Vision. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.</p>

          <h2 className="text-2xl font-bold text-indigo-300">1. Use of Service</h2>
          <p>You agree to use B Vision only for lawful purposes and in accordance with these Terms. You are responsible for all content you upload or process using our platform.</p>

          <h2 className="text-2xl font-bold text-indigo-300">2. Intellectual Property</h2>
          <p>All content, trademarks, logos, and intellectual property on B Vision are owned by us or our licensors. You may not reproduce or distribute any part of our service without our prior written consent.</p>

          <h2 className="text-2xl font-bold text-indigo-300">3. Account Termination</h2>
          <p>We reserve the right to suspend or terminate your access if you violate these Terms or engage in any harmful or fraudulent activities.</p>

          <h2 className="text-2xl font-bold text-indigo-300">4. Limitation of Liability</h2>
          <p>B Vision is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of our platform.</p>

          <h2 className="text-2xl font-bold text-indigo-300">5. Modifications</h2>
          <p>We may update these Terms at any time. Continued use of B Vision after changes means you accept the updated Terms.</p>

          <h2 className="text-2xl font-bold text-indigo-300">6. Contact</h2>
          <p>If you have any questions, please contact us at: <a href="mailto:ayaz9616835404@gmail.com" className="text-green-400 hover:underline">ayaz9616835404@gmail.com</a></p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-indigo-400 hover:underline text-lg">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
