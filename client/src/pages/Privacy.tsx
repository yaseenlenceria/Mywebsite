import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl" data-testid="text-page-title">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>Introduction</h2>
              <p>
                This Privacy Policy describes how we collect, use, and handle your personal information when you use our freelance services and website.
              </p>

              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>
                When you contact us or use our services, we may collect:
              </p>
              <ul>
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Project details and requirements</li>
                <li>Payment information</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>
                We may automatically collect certain information when you visit our website:
              </p>
              <ul>
                <li>Browser type and version</li>
                <li>IP address</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>
                We use the collected information for:
              </p>
              <ul>
                <li>Providing and improving our services</li>
                <li>Communicating with you about projects</li>
                <li>Processing payments</li>
                <li>Sending project updates and newsletters (with your consent)</li>
                <li>Analyzing website usage and performance</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                We may use third-party services for:
              </p>
              <ul>
                <li>Payment processing</li>
                <li>Email communications</li>
                <li>Analytics and website optimization</li>
                <li>Cloud storage and hosting</li>
              </ul>
              <p>
                These services have their own privacy policies and we encourage you to review them.
              </p>

              <h2>Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2>Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience. You can control cookies through your browser settings.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at contact@freelancer.com
              </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
