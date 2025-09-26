import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Helmet>
        <title>{t('privacy.title')}</title>
        <meta name="description" content={t('privacy.sections.intro.content')} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-500 mr-4" />
            <h1 className="text-4xl md:text-6xl font-black text-gray-800">
              {t('privacy.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {t('privacy.lastUpdated')}: September 26, 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('privacy.sections.intro.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.intro.content')}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('privacy.sections.collection.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.collection.content')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Information you provide when contacting us</li>
              <li>Usage data and analytics (anonymized)</li>
              <li>Device and browser information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('privacy.sections.usage.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.usage.content')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide and maintain our website</li>
              <li>Improve user experience and functionality</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send updates and notifications (with your consent)</li>
              <li>Analyze usage patterns to enhance our services</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('privacy.sections.protection.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('privacy.sections.protection.content')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
              <li>Data retention policies</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Third-Party Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our website may use third-party services such as:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>YouTube API for video content</li>
              <li>Google Analytics for usage statistics</li>
              <li>Content delivery networks (CDNs)</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          {/* Contact Us */}
          <section className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t('privacy.sections.contact.title')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.sections.contact.content')} Please reach out to us if you have any questions about this privacy policy or our data practices.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;