import React, { useState, useEffect } from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';

export const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('section-1');

  const tableOfContents = [
    { id: 'section-1', title: 'Information We Collect' },
    { id: 'section-2', title: 'How We Use Your Information' },
    { id: 'section-3', title: 'Your Uploaded Photos and Content' },
    { id: 'section-4', title: 'Public Gift Pages' },
    { id: 'section-5', title: 'Image and Cloud Storage Providers' },
    { id: 'section-6', title: 'Payment Provider' },
    { id: 'section-7', title: 'Other Service Providers' },
    { id: 'section-8', title: 'Data Retention' },
    { id: 'section-9', title: 'Your Privacy Rights' },
    { id: 'section-10', title: 'Security' },
    { id: 'section-11', title: "Children's Data" },
    { id: 'section-12', title: 'International Processing' },
    { id: 'section-13', title: 'Cookies and Analytics' },
    { id: 'section-14', title: 'Data Sharing' },
    { id: 'section-15', title: 'Changes to This Policy' },
    { id: 'section-16', title: 'Contact Us' }
  ];

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = tableOfContents.length - 1; i >= 0; i--) {
        const el = document.getElementById(tableOfContents[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LegalPageLayout
      title="Privacy Policy"
      tag="Privacy & Compliance"
      subtitle="How we collect, use, store, disclose, and protect your information when creating and sharing personalized Rakhi gifts."
      lastUpdated="22 August 2026"
      seoTitle="Privacy Policy | Rakhi Gift"
      seoDescription="Privacy policy explaining data protection, image processing, storage, and rights for Personalized Rakhi Gift."
      tableOfContents={tableOfContents}
      activeSection={activeSection}
    >
      <div className="legal-document-body">
        {/* Preamble */}
        <div className="legal-section-block">
          <p className="legal-p">
            <strong>TheDigitalAsset</strong> ("we", "us", "our") operates <strong>Rakhi Gift</strong> ("Website", "Service", or "Platform").
          </p>
          <p className="legal-p">
            This Privacy Policy explains how we collect, use, store, disclose, and protect information when you use our Service to create and share personalized digital Rakhi gifts.
          </p>
          <p className="legal-p">
            By using the Service, you acknowledge this Privacy Policy and the applicable notices presented to you during the creation and payment process.
          </p>
          <p className="legal-p">
            We aim to handle personal data in accordance with applicable privacy and data-protection laws, including the Digital Personal Data Protection Act, 2023 and applicable rules as in force.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <section id="section-1" className="legal-section-block">
          <h2 className="legal-h2">1. Information We Collect</h2>
          <p className="legal-p">
            Depending on how you use the Service, we may collect:
          </p>

          <h3 className="legal-h3">Information you provide</h3>
          <ul className="legal-list">
            <li className="legal-list-item">Sender name</li>
            <li className="legal-list-item">Recipient name</li>
            <li className="legal-list-item">Nickname or relationship information</li>
            <li className="legal-list-item">Email address, where provided</li>
            <li className="legal-list-item">Phone number, where provided</li>
            <li className="legal-list-item">Personalized messages</li>
            <li className="legal-list-item">Memories, captions, timeline entries, and other content you provide</li>
            <li className="legal-list-item">Photos and images uploaded to create the gift</li>
            <li className="legal-list-item">Theme and customization preferences</li>
            <li className="legal-list-item">Support communications</li>
          </ul>

          <h3 className="legal-h3">Transaction information</h3>
          <p className="legal-p">
            When you make a payment, we may receive information such as:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">payment/order identifier</li>
            <li className="legal-list-item">selected plan</li>
            <li className="legal-list-item">amount</li>
            <li className="legal-list-item">currency</li>
            <li className="legal-list-item">payment status</li>
            <li className="legal-list-item">transaction timestamps</li>
            <li className="legal-list-item">payment provider reference IDs</li>
          </ul>
          <p className="legal-p">
            Payment credentials and payment processing are handled through our payment service provider, Razorpay, according to its applicable policies.
          </p>

          <h3 className="legal-h3">Technical information</h3>
          <p className="legal-p">
            We may automatically collect limited technical information such as:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">IP address</li>
            <li className="legal-list-item">browser and device information</li>
            <li className="legal-list-item">operating system</li>
            <li className="legal-list-item">pages visited</li>
            <li className="legal-list-item">approximate usage information</li>
            <li className="legal-list-item">referral/source information</li>
            <li className="legal-list-item">timestamps</li>
            <li className="legal-list-item">error and diagnostic information</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section id="section-2" className="legal-section-block">
          <h2 className="legal-h2">2. How We Use Your Information</h2>
          <p className="legal-p">
            We use information for purposes including:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">creating and delivering your personalized gift</li>
            <li className="legal-list-item">processing and confirming payments</li>
            <li className="legal-list-item">storing and delivering uploaded images</li>
            <li className="legal-list-item">generating gift URLs and QR codes</li>
            <li className="legal-list-item">providing customer support</li>
            <li className="legal-list-item">maintaining and securing the Service</li>
            <li className="legal-list-item">preventing fraud and abuse</li>
            <li className="legal-list-item">diagnosing technical problems</li>
            <li className="legal-list-item">measuring product usage and performance</li>
            <li className="legal-list-item">maintaining business and transaction records</li>
            <li className="legal-list-item">complying with legal and regulatory obligations</li>
            <li className="legal-list-item">enforcing our Terms & Conditions</li>
          </ul>
          <p className="legal-p">
            We will not use your uploaded photos for unrelated advertising or public promotional purposes unless we have the appropriate permission or legal basis to do so.
          </p>
        </section>

        {/* 3. Your Uploaded Photos and Content */}
        <section id="section-3" className="legal-section-block">
          <h2 className="legal-h2">3. Your Uploaded Photos and Content</h2>
          <p className="legal-p">
            Photos, messages, captions, and other content you upload are used to create and deliver your personalized gift.
          </p>
          <p className="legal-p">
            You retain your rights in the content you upload.
          </p>
          <p className="legal-p">
            By uploading content, you grant us the limited permission necessary to store, process, reproduce, transmit, display, and deliver that content solely for operating and providing the Service.
          </p>
          <p className="legal-p">
            You are responsible for ensuring that you have the necessary rights, permissions, and authority to upload and publish such content.
          </p>
          <p className="legal-p">
            You must not upload unlawful, infringing, abusive, threatening, defamatory, sexually explicit, or otherwise prohibited content.
          </p>
        </section>

        {/* 4. Public Gift Pages */}
        <section id="section-4" className="legal-section-block">
          <h2 className="legal-h2">4. Public Gift Pages</h2>
          <p className="legal-p">
            After successful payment, your gift may be made accessible through a unique public URL.
          </p>
          <p className="legal-p">
            The gift URL may be shared with your recipient and other people who receive the link.
          </p>
          <p className="legal-p">
            We may configure gift pages to discourage search-engine indexing, but this does not guarantee that a URL cannot be discovered, copied, forwarded, cached, or accessed by a person who obtains it.
          </p>
          <p className="legal-p">
            Therefore, do not include highly sensitive or confidential information in your gift.
          </p>
        </section>

        {/* 5. Image and Cloud Storage Providers */}
        <section id="section-5" className="legal-section-block">
          <h2 className="legal-h2">5. Image and Cloud Storage Providers</h2>
          <p className="legal-p">
            We use third-party infrastructure providers to store, process, optimize, and deliver uploaded images and related assets.
          </p>
          <p className="legal-p">
            For example, we may use Cloudinary for image storage, transformation, optimization, and delivery.
          </p>
          <p className="legal-p">
            Your uploaded photos may therefore be processed by such providers on our behalf as necessary to provide the Service.
          </p>
        </section>

        {/* 6. Payment Provider */}
        <section id="section-6" className="legal-section-block">
          <h2 className="legal-h2">6. Payment Provider</h2>
          <p className="legal-p">
            We use Razorpay to process payments.
          </p>
          <p className="legal-p">
            Razorpay may collect and process personal, transaction, device, and payment-related information according to its own privacy notices and applicable law.
          </p>
          <p className="legal-p">
            We do not ask you to provide complete card or UPI credentials directly to us.
          </p>
        </section>

        {/* 7. Other Service Providers */}
        <section id="section-7" className="legal-section-block">
          <h2 className="legal-h2">7. Other Service Providers</h2>
          <p className="legal-p">
            We may use service providers for:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">hosting</li>
            <li className="legal-list-item">database infrastructure</li>
            <li className="legal-list-item">image storage and processing</li>
            <li className="legal-list-item">payment processing</li>
            <li className="legal-list-item">analytics</li>
            <li className="legal-list-item">security</li>
            <li className="legal-list-item">email or transactional communications</li>
            <li className="legal-list-item">error monitoring</li>
            <li className="legal-list-item">customer support</li>
          </ul>
          <p className="legal-p">
            We expect service providers handling personal data on our behalf to process information only for authorized purposes and in accordance with applicable contractual and legal requirements.
          </p>
        </section>

        {/* 8. Data Retention */}
        <section id="section-8" className="legal-section-block">
          <h2 className="legal-h2">8. Data Retention</h2>
          <p className="legal-p">
            We retain information only for as long as reasonably necessary for:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">providing the Service</li>
            <li className="legal-list-item">maintaining your gift</li>
            <li className="legal-list-item">customer support</li>
            <li className="legal-list-item">fraud prevention</li>
            <li className="legal-list-item">accounting and payment records</li>
            <li className="legal-list-item">resolving disputes</li>
            <li className="legal-list-item">complying with legal obligations</li>
            <li className="legal-list-item">enforcing agreements</li>
          </ul>
          <p className="legal-p">
            Gift content may be deleted after the applicable retention period or earlier where a valid deletion request is accepted, subject to information we are legally or reasonably required to retain.
          </p>
          <p className="legal-p">
            We may retain limited transaction records even after deleting gift content where required for accounting, tax, fraud-prevention, dispute-resolution, or legal purposes.
          </p>
        </section>

        {/* 9. Your Privacy Rights */}
        <section id="section-9" className="legal-section-block">
          <h2 className="legal-h2">9. Your Privacy Rights</h2>
          <p className="legal-p">
            Subject to applicable law, you may have rights relating to your personal data, including rights to:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">access information about processing</li>
            <li className="legal-list-item">request correction</li>
            <li className="legal-list-item">request deletion</li>
            <li className="legal-list-item">withdraw consent where consent is the applicable legal basis</li>
            <li className="legal-list-item">raise a grievance</li>
            <li className="legal-list-item">request information about how your data is handled</li>
          </ul>
          <p className="legal-p">
            Requests can be made by contacting: <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
          <p className="legal-p">
            We may need to verify your identity or ownership of a gift before fulfilling a request.
          </p>
          <p className="legal-p">
            Applicable rights and procedures may vary depending on the law that applies to the particular processing activity. The DPDP Act, 2023 provides for consent requirements and rights relating to withdrawal and personal-data handling.
          </p>
        </section>

        {/* 10. Security */}
        <section id="section-10" className="legal-section-block">
          <h2 className="legal-h2">10. Security</h2>
          <p className="legal-p">
            We use reasonable technical and organizational safeguards intended to protect personal data against unauthorized access, loss, misuse, alteration, or disclosure.
          </p>
          <p className="legal-p">
            Examples may include:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">HTTPS/TLS</li>
            <li className="legal-list-item">access controls</li>
            <li className="legal-list-item">secure environment variables</li>
            <li className="legal-list-item">server-side validation</li>
            <li className="legal-list-item">payment signature/webhook verification</li>
            <li className="legal-list-item">restricted administrative access</li>
            <li className="legal-list-item">database access controls</li>
            <li className="legal-list-item">logging and monitoring</li>
          </ul>
          <p className="legal-p">
            No internet-based service can guarantee absolute security.
          </p>
          <p className="legal-p">
            If we become aware of a data security incident requiring notification under applicable law, we will take appropriate response and notification measures.
          </p>
        </section>

        {/* 11. Children's Data */}
        <section id="section-11" className="legal-section-block">
          <h2 className="legal-h2">11. Children's Data</h2>
          <p className="legal-p">
            The Service is not intentionally designed for children to independently purchase or create gifts.
          </p>
          <p className="legal-p">
            If you upload images or personal information relating to a child, you represent that you have the necessary authority and consent to do so.
          </p>
          <p className="legal-p">
            If you believe that personal information relating to a child has been submitted without appropriate authorization, contact us at: <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
        </section>

        {/* 12. International Processing */}
        <section id="section-12" className="legal-section-block">
          <h2 className="legal-h2">12. International Processing</h2>
          <p className="legal-p">
            Our third-party infrastructure providers may process or store information in locations outside your state or country where permitted by applicable law.
          </p>
          <p className="legal-p">
            Where required, we will take appropriate contractual, technical, or legal measures for such processing.
          </p>
        </section>

        {/* 13. Cookies and Analytics */}
        <section id="section-13" className="legal-section-block">
          <h2 className="legal-h2">13. Cookies and Analytics</h2>
          <p className="legal-p">
            We may use cookies and similar technologies for:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">essential functionality</li>
            <li className="legal-list-item">security</li>
            <li className="legal-list-item">analytics</li>
            <li className="legal-list-item">performance measurement</li>
            <li className="legal-list-item">remembering preferences</li>
          </ul>
          <p className="legal-p">
            Where required by applicable law, we will obtain the appropriate consent before using non-essential technologies.
          </p>
        </section>

        {/* 14. Data Sharing */}
        <section id="section-14" className="legal-section-block">
          <h2 className="legal-h2">14. Data Sharing</h2>
          <p className="legal-p">
            We do not sell your personal data.
          </p>
          <p className="legal-p">
            We may disclose information when necessary to:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">provide the Service</li>
            <li className="legal-list-item">process payments</li>
            <li className="legal-list-item">operate cloud and infrastructure services</li>
            <li className="legal-list-item">respond to support requests</li>
            <li className="legal-list-item">prevent fraud or abuse</li>
            <li className="legal-list-item">comply with legal obligations</li>
            <li className="legal-list-item">respond to valid legal process</li>
            <li className="legal-list-item">protect rights, safety, or property</li>
          </ul>
        </section>

        {/* 15. Changes to This Policy */}
        <section id="section-15" className="legal-section-block">
          <h2 className="legal-h2">15. Changes to This Policy</h2>
          <p className="legal-p">
            We may update this Privacy Policy from time to time.
          </p>
          <p className="legal-p">
            The "Last Updated" date will indicate when the latest version became effective.
          </p>
          <p className="legal-p">
            Where required, significant changes will be communicated through appropriate means.
          </p>
        </section>

        {/* 16. Contact Us */}
        <section id="section-16" className="legal-section-block">
          <h2 className="legal-h2">16. Contact Us</h2>
          <p className="legal-p">
            <strong>Data/Privacy Contact:</strong> Privacy Officer, TheDigitalAsset
          </p>
          <p className="legal-p">
            <strong>Email:</strong> <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
          <p className="legal-p">
            <strong>Support:</strong> <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
          <p className="legal-p">
            <strong>Business Address:</strong> Lucknow, UP, India
          </p>
          <p className="legal-p">
            If you have a privacy grievance, please contact us using the above details.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
