import React from 'react';
import { Shield, Eye, Cookie, Lock, Mail, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Shield className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300">
              Your privacy is important to us
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Eye className="h-6 w-6 text-amber-500 mr-3" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Fever Game Today ("we," "our," or "us"). This website is designed to provide WNBA game information, 
              scores, and highlights. <strong>We do not collect any personal information from our users.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed">
              This privacy policy explains our data practices for <strong>fever-game.run</strong>. 
              Since we don't collect personal information, your privacy is fully protected.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Cookie className="h-6 w-6 text-amber-500 mr-3" />
              Information We Do NOT Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Personal Data Collection</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>We do not collect, store, or process any personal information.</strong> This includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>No email addresses or contact information</li>
                  <li>No user accounts or registration data</li>
                  <li>No tracking cookies or analytics</li>
                  <li>No IP addresses or location data</li>
                  <li>No browsing history or user behavior tracking</li>
                  <li>No device information or technical data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Third-Party Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our website displays images from Pexels and other external sources. These are publicly available 
                  images and do not involve any data collection from our side.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Lock className="h-6 w-6 text-amber-500 mr-3" />
              How Our Website Works
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Since we don't collect any personal information, our website simply:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Displays WNBA game information and scores</li>
              <li>Shows basketball highlights and videos</li>
              <li>Provides Caitlin Clark and Indiana Fever updates</li>
              <li>Operates entirely client-side without data collection</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Services</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Analytics or Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>We do not use any analytics services, tracking tools, or third-party data collection services.</strong> 
                Your browsing is completely private and anonymous.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">External Content</h3>
              <p className="text-gray-700 leading-relaxed">
                Our website displays images from Pexels and other external sources. When you view these images, 
                you're accessing them directly from their servers, not through any data collection on our part.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Cookies or Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>We do not use any cookies, tracking pixels, or similar technologies.</strong> 
              Our website functions entirely without storing any information on your device or tracking your activity.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              Since we don't collect any personal information, there's no personal data to secure. 
              Our website is hosted securely and operates without any data storage or processing requirements.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Since we don't collect any personal information, you have complete privacy by default:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>No personal data is collected, so there's nothing to access or delete</li>
              <li>No tracking means complete browsing privacy</li>
              <li>No cookies means no stored information on your device</li>
              <li>No analytics means no behavior monitoring</li>
              <li>Complete anonymity while using our website</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website is safe for users of all ages since we don't collect any personal information from anyone, 
              including children. Parents can be confident that no data is being collected when their children visit our site.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-6 w-6 text-amber-500 mr-3" />
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time, but our commitment to not collecting personal 
              information will remain unchanged. Any updates will be posted on this page with a new "Last updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Mail className="h-6 w-6 text-amber-500 mr-3" />
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Website:</strong> fever-game.run<br />
                <strong>Note:</strong> Since we don't collect any data, there are typically no privacy concerns to address.
              </p>
            </div>
          </section>

          {/* Effective Date */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;