import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for Today's Weather. Learn how we handle your data, use cookies, and work with Google AdSense.",
};

const LAST_UPDATED = "23 May 2025";
const CONTACT_EMAIL = "jinbin@ioti.io";
const SITE_NAME = "Today's Weather";
const SITE_URL = "https://www.weather-jinbin.site";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md shadow-sky-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
              <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            This Privacy Policy describes how <strong>{SITE_NAME}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
            &ldquo;us&rdquo;) collects, uses, and shares information when you visit{" "}
            <span className="text-sky-600">{SITE_URL}</span> (the &ldquo;Site&rdquo;). By using the Site, you agree
            to the practices described in this policy.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-4">

          <Section title="1. Information We Collect">
            <p>We collect the following categories of information:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>
                <strong>Search queries:</strong> The city and country names you enter to look up weather. These are
                stored in our database to power your Search History feature.
              </li>
              <li>
                <strong>Usage data:</strong> Standard web server logs including your IP address, browser type,
                referring page, and pages visited. This data is used for security, performance monitoring, and
                analytics.
              </li>
              <li>
                <strong>Cookies &amp; tracking:</strong> We and our advertising partners use cookies and similar
                technologies as described in the Cookies section below.
              </li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> collect your name, email address, or payment information unless you
              voluntarily contact us.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>To provide and improve the weather search service.</li>
              <li>To display and personalise advertisements via Google AdSense.</li>
              <li>To analyse site traffic and usage patterns using aggregated, anonymised data.</li>
              <li>To detect and prevent fraud, abuse, or security incidents.</li>
            </ul>
          </Section>

          <Section title="3. Cookies">
            <p>
              Our Site uses cookies — small text files stored on your device. Cookies help us remember your
              preferences and allow our advertising partners to serve relevant ads.
            </p>
            <p className="mt-3 font-semibold text-gray-800">Types of cookies we use:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>
                <strong>Necessary cookies:</strong> Required for the Site to function correctly. No personal data
                is stored.
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us understand how visitors use our Site so we can improve it.
              </li>
              <li>
                <strong>Advertising cookies:</strong> Set by Google AdSense to serve personalised advertisements
                based on your browsing activity across sites.
              </li>
            </ul>
            <p className="mt-3">
              You can manage or disable cookies through your browser settings. Disabling advertising cookies will
              not remove ads but may make them less relevant to you.
            </p>
          </Section>

          <Section title="4. Google AdSense &amp; Third-Party Advertising">
            <p>
              We use <strong>Google AdSense</strong> to display advertisements on our Site. Google, as a
              third-party vendor, uses cookies (including the DoubleClick cookie) to serve ads based on your prior
              visits to our Site or other sites on the internet.
            </p>
            <p className="mt-3">
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your
              visit to our Site and/or other sites on the Internet. You may opt out of personalised advertising by
              visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
                className="text-sky-600 hover:underline">
                Google Ad Settings
              </a>
              {" "}or by visiting{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer"
                className="text-sky-600 hover:underline">
                www.aboutads.info
              </a>.
            </p>
            <p className="mt-3">
              For more information on how Google uses data from sites that use their services, please visit:{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer"
                className="text-sky-600 hover:underline">
                How Google uses data
              </a>.
            </p>
          </Section>

          <Section title="5. Data Sharing">
            <p>We do not sell, rent, or trade your personal information to third parties. We may share data:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>With service providers who assist us in operating the Site (e.g., cloud hosting, analytics).</li>
              <li>With advertising partners (Google AdSense) as described above.</li>
              <li>When required by law or to protect our rights and safety.</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <p>
              Search history records are stored in our database indefinitely until you manually delete them using
              the delete button in the app, or upon request to us. Server logs are retained for up to 90 days.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              Our Site is not directed at children under the age of 13. We do not knowingly collect personal
              information from children under 13. If you believe we have inadvertently collected such information,
              please contact us immediately.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Object to or restrict certain processing of your data.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-600 hover:underline">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top
              of this page reflects the most recent changes. Continued use of the Site after any changes constitutes
              your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-3 p-4 bg-sky-50 border border-sky-100 rounded-xl text-sm">
              <p className="font-semibold text-gray-800">{SITE_NAME}</p>
              <p className="text-gray-600 mt-1">
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-600 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </Section>

        </div>

        {/* Back links */}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/" className="text-sky-600 hover:underline">← Back to Weather</Link>
          <span className="text-gray-300">·</span>
          <Link href="/about" className="text-sky-600 hover:underline">About</Link>
          <span className="text-gray-300">·</span>
          <Link href="/terms" className="text-sky-600 hover:underline">Terms of Service</Link>
        </div>

      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8">
      <h2 className="text-base font-bold text-gray-800 mb-3">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
