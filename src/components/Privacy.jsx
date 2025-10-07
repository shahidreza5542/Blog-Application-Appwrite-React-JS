import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white mt-16 leading-relaxed">
      <h1 className="text-4xl font-pbold mb-6 text-btn"><span className="text-white">Privacy</span> Policy</h1>
      <p className="mb-6 font-psmbold text-white">
        Welcome to <strong className='text-btn'>DevHive</strong>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website (https://devhive.qzz.io/).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Personal information you provide directly, like name and email.</li>
        <li>Non-personal information automatically collected, such as browser type, IP address, and usage patterns.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-6">
        <li>To provide and improve our services and website functionality.</li>
        <li>To communicate updates, newsletters, and important notifications.</li>
        <li>To analyze usage trends and enhance user experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cookies & Tracking</h2>
      <ul className="list-disc list-inside mb-6">
        <li>We may use cookies and similar technologies to track site activity.</li>
        <li>Cookies help us personalize content and analyze traffic.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing & Third Parties</h2>
      <ul className="list-disc list-inside mb-6">
        <li>We do not sell or rent your personal information.</li>
        <li>We may share data with trusted third-party services for analytics, hosting, or security purposes.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Security</h2>
      <ul className="list-disc list-inside mb-6">
        <li>We implement reasonable security measures to protect your information.</li>
        <li>No method of transmission over the internet is 100% secure; use the site at your own risk.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
      <ul className="list-disc list-inside mb-6">
        <li>You may request access to, correction, or deletion of your personal information.</li>
        <li>You can unsubscribe from marketing communications at any time.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Privacy Policy</h2>
      <ul className="list-disc list-inside mb-6">
        <li>DevHive may update this Privacy Policy periodically.</li>
        <li>Continued use of the website constitutes acceptance of any changes.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
      <ul className="list-disc list-inside mb-6">
        <li>If you have any questions about this Privacy Policy, contact <strong>Shahid</strong> via email or the contact page on the website.</li>
      </ul>

      <p className="mt-6"><strong>Last Updated:</strong> October 7, 2025</p>
      <p className="mt-2 italic">By using DevHive, you acknowledge that you have read and agreed to this Privacy Policy.</p>
    </div>
  );
};

export default Privacy;
