import React from 'react';
import { Shield } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Terms of Service | Fever Game Today"
        description="Terms of Service and usage guidelines for Fever Game Today."
      />
      
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center">
          <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white tracking-tight">Terms of Service</h1>
          <p className="text-gray-400 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="p-8 prose prose-orange max-w-none text-gray-700">
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Fever Game Today (the "Website"), you accept and agree to be bound by the terms and provision of this agreement. 
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">2. Description of Service</h2>
          <p>
            Fever Game Today provides sports statistics, news, and embedded video highlights related to the Indiana Fever and WNBA. The content provided on this Website is for informational and entertainment purposes only.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">3. Disclaimer of Affiliation</h2>
          <p>
            This Website is an independent fan site and is <strong>not officially affiliated with, associated with, authorized, endorsed by, or in any way officially connected with the WNBA, the Indiana Fever, or any of their subsidiaries or affiliates.</strong> All related names, marks, emblems, and images are registered trademarks of their respective owners.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">4. Content and Copyright</h2>
          <p>
            The stats, scores, and articles provided on this Website are curated from public domains. Video highlights are embedded via third-party providers (like YouTube) using their official embed players. We do not host or upload these videos. If you are a copyright owner and wish to remove an embed, please contact the original hosting platform.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">5. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Fever Game Today for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">6. Advertising (Google AdSense)</h2>
          <p>
            This Website may use third-party advertising companies, including Google AdSense, to serve ads when you visit our Website. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Your continued use of the Website after any such changes constitutes your acceptance of the new Terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
