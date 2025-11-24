import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function Terms() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl" data-testid="text-page-title">
                Terms of Service
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
              <h2>Agreement to Terms</h2>
              <p>
                By accessing and using our freelance services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
              </p>

              <h2>Services</h2>
              <p>
                We provide professional freelance services including but not limited to:
              </p>
              <ul>
                <li>Web development and design</li>
                <li>Shopify store development</li>
                <li>SEO optimization</li>
                <li>AI integration services</li>
                <li>Technical consulting</li>
              </ul>

              <h2>Project Agreements</h2>
              <h3>Scope of Work</h3>
              <p>
                Each project will have a defined scope of work agreed upon by both parties before commencement. Any changes to the scope may affect timeline and pricing.
              </p>

              <h3>Timeline</h3>
              <p>
                Project timelines are estimates and may be subject to change based on project complexity, client feedback cycles, and unforeseen circumstances.
              </p>

              <h3>Revisions</h3>
              <p>
                A reasonable number of revisions are included in each project. Additional revisions beyond the agreed scope may incur additional fees.
              </p>

              <h2>Payment Terms</h2>
              <h3>Pricing</h3>
              <p>
                Project pricing will be agreed upon before work begins. Prices are subject to change for future projects.
              </p>

              <h3>Payment Schedule</h3>
              <p>
                Payment terms vary by project and may include:
              </p>
              <ul>
                <li>Upfront deposit (typically 30-50%)</li>
                <li>Milestone payments</li>
                <li>Final payment upon completion</li>
              </ul>

              <h3>Late Payments</h3>
              <p>
                Late payments may result in project delays or suspension until payment is received.
              </p>

              <h2>Intellectual Property</h2>
              <h3>Ownership</h3>
              <p>
                Upon full payment, clients receive ownership of the final deliverables created specifically for their project. We retain the right to display completed work in our portfolio.
              </p>

              <h3>Third-Party Assets</h3>
              <p>
                If third-party assets (fonts, images, plugins) are used in the project, the client is responsible for obtaining necessary licenses.
              </p>

              <h2>Confidentiality</h2>
              <p>
                We will keep all client information and project details confidential unless otherwise agreed upon or required by law.
              </p>

              <h2>Warranties and Disclaimers</h2>
              <p>
                We provide services with professional care and skill. However, we cannot guarantee specific results or rankings (especially for SEO services).
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                Our liability is limited to the amount paid for the specific project. We are not liable for indirect, incidental, or consequential damages.
              </p>

              <h2>Termination</h2>
              <p>
                Either party may terminate a project with written notice. Clients remain responsible for payment for work completed up to the termination date.
              </p>

              <h2>Indemnification</h2>
              <p>
                Clients agree to indemnify and hold us harmless from any claims arising from the client's use of our services or breach of these terms.
              </p>

              <h2>Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>

              <h2>Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction.
              </p>

              <h2>Contact</h2>
              <p>
                For questions about these Terms of Service, please contact us at contact@freelancer.com
              </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
