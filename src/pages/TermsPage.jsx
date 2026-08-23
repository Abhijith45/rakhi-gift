import React, { useState, useEffect } from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';

export const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('section-1');

  const tableOfContents = [
    { id: 'section-1', title: 'Our Service' },
    { id: 'section-2', title: 'Eligibility' },
    { id: 'section-3', title: 'User Responsibilities' },
    { id: 'section-4', title: 'Rights and Permissions' },
    { id: 'section-5', title: 'Third-Party Content' },
    { id: 'section-6', title: 'Gift URLs and Privacy' },
    { id: 'section-7', title: 'Photos and Image Processing' },
    { id: 'section-8', title: 'Plans and Pricing' },
    { id: 'section-9', title: 'Payment' },
    { id: 'section-10', title: 'Payment Errors and Charges' },
    { id: 'section-11', title: 'Refunds' },
    { id: 'section-12', title: 'Gift Availability' },
    { id: 'section-13', title: 'Prohibited Use' },
    { id: 'section-14', title: 'Intellectual Property' },
    { id: 'section-15', title: 'Third-Party Services' },
    { id: 'section-16', title: 'Service Modifications' },
    { id: 'section-17', title: 'Account Restrictions' },
    { id: 'section-18', title: 'Disclaimer' },
    { id: 'section-19', title: 'Limitation of Liability' },
    { id: 'section-20', title: 'Indemnity' },
    { id: 'section-21', title: 'Governing Law' },
    { id: 'section-22', title: 'Changes to These Terms' },
    { id: 'section-23', title: 'Contact' }
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
      title="Terms & Conditions"
      tag="Legal Agreement"
      subtitle="The terms and guidelines that apply when you create, purchase, or access Personalized Rakhi memory gifts."
      lastUpdated="22 August 2026"
      seoTitle="Terms & Conditions | Rakhi Gift"
      seoDescription="Terms and Conditions governing the use of Personalized Rakhi Gift service."
      tableOfContents={tableOfContents}
      activeSection={activeSection}
    >
      <div className="legal-document-body">
        {/* Preamble */}
        <div className="legal-section-block">
          <p className="legal-p">
            These Terms & Conditions ("Terms") govern your use of <strong>Rakhi Gift</strong> and the Personalized Rakhi Gift service operated by <strong>TheDigitalAsset</strong> ("we", "us", "our").
          </p>
          <p className="legal-p">
            By accessing or using the Service, you agree to these Terms.
          </p>
          <p className="legal-p">
            If you do not agree with these Terms, please do not use the Service.
          </p>
        </div>

        {/* 1. Our Service */}
        <section id="section-1" className="legal-section-block">
          <h2 className="legal-h2">1. Our Service</h2>
          <p className="legal-p">
            We provide a digital gifting service that allows customers to create personalized Raksha Bandhan memory pages using photographs, messages, captions, timelines, and other content supplied by the customer.
          </p>
          <p className="legal-p">The Service includes:</p>
          <ul className="legal-list">
            <li className="legal-list-item">gift creation</li>
            <li className="legal-list-item">image processing and storage</li>
            <li className="legal-list-item">personalized page generation</li>
            <li className="legal-list-item">payment processing</li>
            <li className="legal-list-item">unique gift URL generation</li>
            <li className="legal-list-item">QR code generation</li>
            <li className="legal-list-item">sharing functionality</li>
          </ul>
          <p className="legal-p">
            Features and limits may vary according to the plan selected.
          </p>
        </section>

        {/* 2. Eligibility */}
        <section id="section-2" className="legal-section-block">
          <h2 className="legal-h2">2. Eligibility</h2>
          <p className="legal-p">
            You must have the legal capacity required to enter into an agreement under applicable law to use the paid Service.
          </p>
          <p className="legal-p">
            If you use the Service on behalf of another person or organization, you represent that you have authority to do so.
          </p>
        </section>

        {/* 3. User Responsibilities */}
        <section id="section-3" className="legal-section-block">
          <h2 className="legal-h2">3. User Responsibilities</h2>
          <p className="legal-p">You are responsible for:</p>
          <ul className="legal-list">
            <li className="legal-list-item">information you submit</li>
            <li className="legal-list-item">photos you upload</li>
            <li className="legal-list-item">captions and messages you provide</li>
            <li className="legal-list-item">the accuracy of the information you enter</li>
            <li className="legal-list-item">keeping any shared gift URL appropriately controlled</li>
            <li className="legal-list-item">complying with applicable laws</li>
          </ul>
          <p className="legal-p">
            You must not use the Service to create content that is unlawful, abusive, threatening, defamatory, fraudulent, infringing, sexually exploitative, or otherwise prohibited by applicable law.
          </p>
        </section>

        {/* 4. Rights and Permissions for Uploaded Content */}
        <section id="section-4" className="legal-section-block">
          <h2 className="legal-h2">4. Rights and Permissions for Uploaded Content</h2>
          <p className="legal-p">
            You retain ownership of the photos and content you upload.
          </p>
          <p className="legal-p">
            However, by uploading content, you grant us a limited, non-exclusive permission to process, store, reproduce, transmit, and display that content only as necessary to provide the Service.
          </p>
          <p className="legal-p">You represent that:</p>
          <ul className="legal-list">
            <li className="legal-list-item">you own the content or have the required rights to use it</li>
            <li className="legal-list-item">you have permission to upload and display images of other people where required</li>
            <li className="legal-list-item">your content does not violate another person's privacy, publicity, copyright, trademark, or other rights</li>
          </ul>
          <p className="legal-p">
            You must not upload material that you do not have permission to use.
          </p>
        </section>

        {/* 5. Third-Party Content */}
        <section id="section-5" className="legal-section-block">
          <h2 className="legal-h2">5. Third-Party Content</h2>
          <p className="legal-p">
            We are not responsible for determining whether content uploaded by a customer is legally owned by that customer.
          </p>
          <p className="legal-p">
            If we receive a legitimate complaint or legal request concerning content, we may restrict, disable, or remove the relevant gift or content while the matter is reviewed.
          </p>
        </section>

        {/* 6. Gift URLs and Privacy */}
        <section id="section-6" className="legal-section-block">
          <h2 className="legal-h2">6. Gift URLs and Privacy</h2>
          <p className="legal-p">
            Each completed gift may receive a unique URL.
          </p>
          <p className="legal-p">
            A person who obtains the URL may be able to access the gift.
          </p>
          <p className="legal-p">
            You are responsible for deciding who you share the URL and QR code with.
          </p>
          <p className="legal-p">
            You should not include confidential credentials, financial information, government identifiers, medical information, passwords, or other highly sensitive information in a gift.
          </p>
          <p className="legal-p">
            We may use measures such as noindex directives to discourage search engines from indexing gift pages, but these measures do not guarantee complete secrecy.
          </p>
        </section>

        {/* 7. Photos and Image Processing */}
        <section id="section-7" className="legal-section-block">
          <h2 className="legal-h2">7. Photos and Image Processing</h2>
          <p className="legal-p">
            Images may be resized, cropped, compressed, optimized, converted, or otherwise processed to ensure proper performance and presentation.
          </p>
          <p className="legal-p">
            Uploaded images may be transmitted to third-party infrastructure providers used to operate the Service.
          </p>
          <p className="legal-p">
            Our Privacy Policy explains this processing in more detail.
          </p>
        </section>

        {/* 8. Plans and Pricing */}
        <section id="section-8" className="legal-section-block">
          <h2 className="legal-h2">8. Plans and Pricing</h2>
          <p className="legal-p">
            The available plans and prices are displayed on the Website and may change from time to time.
          </p>
          <p className="legal-p">
            The price applicable to your purchase is the price shown at the time the payment order is created.
          </p>
          <p className="legal-p">
            We reserve the right to correct obvious pricing or technical errors.
          </p>
          <p className="legal-p">
            Promotional pricing may be subject to additional terms.
          </p>
        </section>

        {/* 9. Payment */}
        <section id="section-9" className="legal-section-block">
          <h2 className="legal-h2">9. Payment</h2>
          <p className="legal-p">
            Payments are processed through Razorpay or another payment provider made available through the Service.
          </p>
          <p className="legal-p">
            Payment must be successfully confirmed before a gift is activated and its public URL, QR code, and sharing features are enabled.
          </p>
          <p className="legal-p">
            We may use server-side payment verification and payment-provider webhooks to confirm payment status.
          </p>
        </section>

        {/* 10. Payment Errors and Duplicate Charges */}
        <section id="section-10" className="legal-section-block">
          <h2 className="legal-h2">10. Payment Errors and Duplicate Charges</h2>
          <p className="legal-p">
            If you believe you have been charged incorrectly or more than once, contact us with your order/payment reference.
          </p>
          <p className="legal-p">
            We will investigate the transaction and, where appropriate, coordinate with our payment provider to resolve the issue.
          </p>
        </section>

        {/* 11. Refunds */}
        <section id="section-11" className="legal-section-block">
          <h2 className="legal-h2">11. Refunds</h2>
          <p className="legal-p">
            Because the Service is a digital product, refund eligibility depends on the circumstances of the purchase, whether the Service has been delivered, and applicable law.
          </p>
          <p className="legal-p">Examples that may qualify for review include:</p>
          <ul className="legal-list">
            <li className="legal-list-item">duplicate payment</li>
            <li className="legal-list-item">technical failure preventing delivery</li>
            <li className="legal-list-item">payment captured without creation of the purchased gift</li>
          </ul>
          <p className="legal-p">
            Contact <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a> with your order information.
          </p>
          <p className="legal-p">
            Nothing in these Terms limits rights that cannot legally be excluded.
          </p>
        </section>

        {/* 12. Gift Availability */}
        <section id="section-12" className="legal-section-block">
          <h2 className="legal-h2">12. Gift Availability</h2>
          <p className="legal-p">
            We aim to keep active gifts available and accessible.
          </p>
          <p className="legal-p">However, temporary interruption may occur because of:</p>
          <ul className="legal-list">
            <li className="legal-list-item">infrastructure outages</li>
            <li className="legal-list-item">maintenance</li>
            <li className="legal-list-item">network problems</li>
            <li className="legal-list-item">security incidents</li>
            <li className="legal-list-item">payment or third-party provider failures</li>
            <li className="legal-list-item">events outside our reasonable control</li>
          </ul>
          <p className="legal-p">
            We may temporarily suspend a gift where necessary for security, legal, technical, or policy reasons.
          </p>
        </section>

        {/* 13. Prohibited Use */}
        <section id="section-13" className="legal-section-block">
          <h2 className="legal-h2">13. Prohibited Use</h2>
          <p className="legal-p">You must not:</p>
          <ul className="legal-list">
            <li className="legal-list-item">attempt to access another user's private or administrative data</li>
            <li className="legal-list-item">bypass payment requirements</li>
            <li className="legal-list-item">manipulate pricing or payment requests</li>
            <li className="legal-list-item">attempt to activate unpaid gifts</li>
            <li className="legal-list-item">attack or overload the Service</li>
            <li className="legal-list-item">upload malicious files</li>
            <li className="legal-list-item">attempt unauthorized access</li>
            <li className="legal-list-item">scrape or misuse the Service</li>
            <li className="legal-list-item">use the Service for unlawful activities</li>
            <li className="legal-list-item">impersonate another person</li>
            <li className="legal-list-item">infringe intellectual-property or privacy rights</li>
          </ul>
        </section>

        {/* 14. Intellectual Property */}
        <section id="section-14" className="legal-section-block">
          <h2 className="legal-h2">14. Intellectual Property</h2>
          <p className="legal-p">
            The Website's software, branding, interface, graphics, original illustrations, documentation, and other materials created by us remain our property or are used under appropriate licenses.
          </p>
          <p className="legal-p">
            You may not reproduce, modify, distribute, reverse engineer, resell, or commercially exploit our proprietary materials except where permitted by law or with our written permission.
          </p>
          <p className="legal-p">
            Your uploaded content remains yours.
          </p>
        </section>

        {/* 15. Third-Party Services */}
        <section id="section-15" className="legal-section-block">
          <h2 className="legal-h2">15. Third-Party Services</h2>
          <p className="legal-p">The Service may depend on third-party services such as:</p>
          <ul className="legal-list">
            <li className="legal-list-item">Razorpay for payments</li>
            <li className="legal-list-item">Cloudinary for image storage and processing</li>
            <li className="legal-list-item">cloud hosting providers</li>
            <li className="legal-list-item">database infrastructure providers</li>
            <li className="legal-list-item">analytics or communication services</li>
          </ul>
          <p className="legal-p">
            Third-party services may have their own terms and privacy policies.
          </p>
          <p className="legal-p">
            Their availability and functionality may affect the Service.
          </p>
        </section>

        {/* 16. Service Modifications */}
        <section id="section-16" className="legal-section-block">
          <h2 className="legal-h2">16. Service Modifications</h2>
          <p className="legal-p">
            We may add, remove, modify, or discontinue features from time to time.
          </p>
          <p className="legal-p">
            We may change plan limits, pricing, or functionality for future purchases.
          </p>
          <p className="legal-p">
            Changes will not alter an already-confirmed purchase except where required for security, legal compliance, or circumstances outside our reasonable control.
          </p>
        </section>

        {/* 17. Account and Access Restrictions */}
        <section id="section-17" className="legal-section-block">
          <h2 className="legal-h2">17. Account and Access Restrictions</h2>
          <p className="legal-p">We may suspend or restrict access where reasonably necessary because of:</p>
          <ul className="legal-list">
            <li className="legal-list-item">suspected fraud</li>
            <li className="legal-list-item">abuse</li>
            <li className="legal-list-item">unlawful content</li>
            <li className="legal-list-item">security risks</li>
            <li className="legal-list-item">violation of these Terms</li>
            <li className="legal-list-item">legal requirements</li>
          </ul>
          <p className="legal-p">
            Where reasonably possible, we may provide notice and an opportunity to resolve the issue.
          </p>
        </section>

        {/* 18. Disclaimer */}
        <section id="section-18" className="legal-section-block">
          <h2 className="legal-h2">18. Disclaimer</h2>
          <p className="legal-p">
            The Service is provided on an "as available" basis.
          </p>
          <p className="legal-p">
            We aim to provide a reliable and high-quality gifting experience, but we do not guarantee that the Service will always be uninterrupted, error-free, or available in every circumstance.
          </p>
        </section>

        {/* 19. Limitation of Liability */}
        <section id="section-19" className="legal-section-block">
          <h2 className="legal-h2">19. Limitation of Liability</h2>
          <p className="legal-p">
            To the maximum extent permitted by applicable law, we will not be liable for indirect, incidental, consequential, special, or unforeseeable losses arising from your use of the Service.
          </p>
          <p className="legal-p">
            Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited.
          </p>
        </section>

        {/* 20. Indemnity */}
        <section id="section-20" className="legal-section-block">
          <h2 className="legal-h2">20. Indemnity</h2>
          <p className="legal-p">
            To the extent permitted by law, you agree to indemnify and hold us harmless from claims, losses, liabilities, and expenses arising from:
          </p>
          <ul className="legal-list">
            <li className="legal-list-item">your misuse of the Service</li>
            <li className="legal-list-item">your violation of these Terms</li>
            <li className="legal-list-item">content you upload</li>
            <li className="legal-list-item">your violation of another person's rights</li>
            <li className="legal-list-item">your unlawful use of the Service</li>
          </ul>
        </section>

        {/* 21. Governing Law */}
        <section id="section-21" className="legal-section-block">
          <h2 className="legal-h2">21. Governing Law</h2>
          <p className="legal-p">
            These Terms shall be governed by the laws of India, subject to applicable consumer-protection and other mandatory laws.
          </p>
          <p className="legal-p">
            Jurisdiction/dispute-resolution provisions should be finalized based on the registered entity's actual location and legal advice before publication.
          </p>
        </section>

        {/* 22. Changes to These Terms */}
        <section id="section-22" className="legal-section-block">
          <h2 className="legal-h2">22. Changes to These Terms</h2>
          <p className="legal-p">
            We may update these Terms from time to time.
          </p>
          <p className="legal-p">
            The latest version will be published on the Website together with the updated date.
          </p>
          <p className="legal-p">
            Continued use of the Service after an update may constitute acceptance where permitted by applicable law.
          </p>
        </section>

        {/* 23. Contact */}
        <section id="section-23" className="legal-section-block">
          <h2 className="legal-h2">23. Contact</h2>
          <p className="legal-p">
            <strong>Business Name:</strong> TheDigitalAsset
          </p>
          <p className="legal-p">
            <strong>Website:</strong> <a href="https://www.thedigitalasset.in" target="_blank" rel="noopener noreferrer" className="legal-link">www.thedigitalasset.in</a>
          </p>
          <p className="legal-p">
            <strong>Support:</strong> <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
          <p className="legal-p">
            <strong>Privacy:</strong> <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
          <p className="legal-p">
            <strong>Business Address:</strong> Lucknow, UP, India
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default TermsPage;
