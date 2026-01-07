import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hiverr – Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: December 19, 2025</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">a. Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Name, email address, company details</li>
              <li>Account credentials</li>
              <li>Billing and payment information</li>
              <li>Content, prompts, files, and inputs you submit</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">b. Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>IP address and device identifiers</li>
              <li>Browser type and usage data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide, operate, and improve Hiverr</li>
              <li>Power AI features and workflows</li>
              <li>Process payments and subscriptions</li>
              <li>Communicate product updates and support</li>
              <li>Maintain security and comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. AI & Data Usage</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Data may be processed by AI systems to deliver features</li>
              <li>We do not sell personal data</li>
              <li>Customer data is not used to train public AI models without explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-2">We may share data with:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Trusted service providers (hosting, payments, analytics)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners strictly to operate the Service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              All third parties are bound by confidentiality and data-protection obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-2">We use cookies to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Authenticate users</li>
              <li>Analyze usage</li>
              <li>Improve platform performance</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain personal data only for as long as necessary to provide the Service or meet legal and regulatory requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights (Canada – PIPEDA)</h2>
            <p className="text-gray-700 leading-relaxed mb-2">You may have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Request corrections or deletion</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              Requests can be sent to <a href="mailto:privacy@usehiverr.com" className="text-purple-600 hover:underline">privacy@usehiverr.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We use industry-standard administrative, technical, and organizational safeguards. However, no system is completely secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be processed outside Canada. We take reasonable steps to ensure appropriate protections are in place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Hiverr is not intended for individuals under 18. We do not knowingly collect personal data from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. Continued use of Hiverr indicates acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact</h2>
            <p className="text-gray-700 leading-relaxed">For privacy-related questions or requests:</p>
            <ul className="list-none text-gray-700 mt-2 space-y-1">
              <li>Website: <a href="https://usehiverr.com" className="text-purple-600 hover:underline">https://usehiverr.com</a></li>
              <li>Privacy: <a href="mailto:privacy@usehiverr.com" className="text-purple-600 hover:underline">privacy@usehiverr.com</a></li>
              <li>Support: <a href="mailto:support@usehiverr.com" className="text-purple-600 hover:underline">support@usehiverr.com</a></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
