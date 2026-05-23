import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Today's Weather. Understand your rights and responsibilities when using our free weather forecast app.",
};

const LAST_UPDATED = "23 May 2025";
const CONTACT_EMAIL = "jinbin@ioti.io";
const SITE_NAME = "Today's Weather";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md shadow-sky-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Terms of Service</h1>
              <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Please read these Terms of Service carefully before using <strong>{SITE_NAME}</strong>. By accessing or
            using our Site, you agree to be bound by these terms. If you do not agree, please do not use the Site.
          </p>
        </div>

        <div className="space-y-4">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing and using {SITE_NAME} (the &ldquo;Site&rdquo;), you accept and agree to be bound by
              these Terms of Service and our{" "}
              <Link href="/privacy-policy" className="text-sky-600 hover:underline">Privacy Policy</Link>.
              We reserve the right to update these terms at any time. Continued use of the Site after changes
              constitutes acceptance of the new terms.
            </p>
          </Section>

          <Section title="2. Use of the Service">
            <p>You may use {SITE_NAME} for personal, non-commercial purposes only. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>Use the Site in any way that violates applicable laws or regulations.</li>
              <li>Attempt to gain unauthorised access to our systems or data.</li>
              <li>Use automated tools (bots, scrapers) to access the Site excessively or extract data.</li>
              <li>Transmit any harmful, offensive, or disruptive content.</li>
              <li>Interfere with the proper working of the Site or its infrastructure.</li>
            </ul>
          </Section>

          <Section title="3. Accuracy of Weather Data">
            <p>
              Weather data displayed on {SITE_NAME} is sourced from third-party providers (OpenWeatherMap and
              Open-Meteo). While we strive to display accurate and up-to-date information, we make no warranties
              regarding the accuracy, completeness, or timeliness of weather data.
            </p>
            <p className="mt-3">
              <strong>Weather information is provided for informational purposes only.</strong> Do not use this
              Site as the sole basis for decisions involving safety, travel, or health. Always verify critical
              weather information with official meteorological services in your region.
            </p>
          </Section>

          <Section title="4. Advertising">
            <p>
              {SITE_NAME} displays advertisements provided by Google AdSense and potentially other advertising
              networks. We are not responsible for the content of third-party advertisements. Clicking on
              advertisements may take you to third-party websites, and we are not liable for their content or
              practices.
            </p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              All content on this Site — including the interface design, code, branding, and written content — is
              the property of {SITE_NAME} and is protected by applicable intellectual property laws. You may not
              reproduce, distribute, or create derivative works without our express written permission.
            </p>
            <p className="mt-3">
              Weather data is sourced from OpenWeatherMap and Open-Meteo under their respective terms of service.
              City and landmark images are provided by Unsplash under the Unsplash License.
            </p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, {SITE_NAME} shall not be liable for any direct, indirect,
              incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>Your use of or inability to use the Site.</li>
              <li>Any errors or inaccuracies in weather data.</li>
              <li>Decisions made based on information from the Site.</li>
              <li>Interruptions or unavailability of the service.</li>
            </ul>
          </Section>

          <Section title="7. Third-Party Links &amp; Services">
            <p>
              The Site may contain links to third-party websites or use third-party APIs and services. We are not
              responsible for the content, privacy practices, or availability of those external sites. Links do not
              imply endorsement.
            </p>
          </Section>

          <Section title="8. Termination">
            <p>
              We reserve the right to terminate or suspend access to the Site at our sole discretion, without
              notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third
              parties.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the laws of Malaysia, without regard to
              conflict of law principles. Any disputes arising from these Terms shall be subject to the exclusive
              jurisdiction of the courts of Malaysia.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>For any questions regarding these Terms, please contact us:</p>
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

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/" className="text-sky-600 hover:underline">← Back to Weather</Link>
          <span className="text-gray-300">·</span>
          <Link href="/about" className="text-sky-600 hover:underline">About</Link>
          <span className="text-gray-300">·</span>
          <Link href="/privacy-policy" className="text-sky-600 hover:underline">Privacy Policy</Link>
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
