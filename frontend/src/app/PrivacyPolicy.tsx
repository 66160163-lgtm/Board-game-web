import { ArrowLeft } from "lucide-react";
import { Button } from "./components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Button variant="ghost" size="sm" asChild className="gap-1.5">
            <a href="/"><ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก</a>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: April 7, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              Doodle Board Game ("we", "us", or "our") operates the website{" "}
              <strong>doodleboardgame.space</strong> (the "Service"). This Privacy Policy explains
              how we collect, use, and protect your personal information when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p>When you sign in using <strong>Google OAuth</strong>, we receive the following information from your Google account:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Email address</strong> — used to identify your account and send booking confirmations.</li>
              <li><strong>Display name</strong> — used to personalize your experience on the Service.</li>
              <li><strong>Profile picture URL</strong> — may be displayed within the Service for your convenience.</li>
            </ul>
            <p className="mt-2">
              We do <strong>not</strong> access your Google contacts, Google Drive, Gmail content,
              or any other Google services beyond the basic profile information listed above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect solely for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Authentication</strong> — to verify your identity and allow you to sign in.</li>
              <li><strong>Table bookings</strong> — to associate bookings with your account.</li>
              <li><strong>Communication</strong> — to send booking confirmations or important service updates.</li>
              <li><strong>Administration</strong> — to manage and improve the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Storage &amp; Security</h2>
            <p>
              Your data is stored securely using <strong>Supabase</strong>, which provides
              enterprise-grade security including encryption at rest and in transit. We implement
              Row Level Security (RLS) policies to ensure users can only access their own data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Data Sharing</h2>
            <p>
              We do <strong>not</strong> sell, trade, or rent your personal information to third
              parties. We do not share your data with any external services except as required for
              the operation of the Service (e.g., Supabase for data storage, Google for
              authentication).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Data Retention &amp; Deletion</h2>
            <p>
              We retain your personal information only for as long as necessary to provide the
              Service. You may request deletion of your account and associated data at any time by
              contacting us at the email address below. Upon request, we will delete your data
              within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Withdraw consent for data processing at any time by signing out and contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Third-Party Services</h2>
            <p>Our Service uses the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Google OAuth 2.0</strong> — for user authentication. Google's privacy policy can be found at{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                  https://policies.google.com/privacy
                </a>.
              </li>
              <li><strong>Supabase</strong> — for backend data storage and authentication management.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with an updated "Last updated" date. We encourage you to review this page
              periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or your data, please contact us:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Phone: 080 574 9007</li>
              <li>Facebook: <a href="https://www.facebook.com/share/1GjwGJiGP8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="underline">Doodle Board Game</a></li>
              <li>Address: 6/52 ถ.บางแสนสาย4ใต้ ต.แสนสุข อ.เมือง จ.ชลบุรี 20130</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            © 2026 Doodle Board Game. สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>
    </div>
  );
}
