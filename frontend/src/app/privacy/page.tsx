import { LegalPage, LegalSection } from '@/components/legal/LegalPage';

export const metadata = {
  title: 'Privacy Policy | Talynk',
  description: 'How Talynk collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="26 July 2026">
      <p className="text-slate-400">
        This Privacy Policy explains what information Talynk collects, how it is used, and the
        rights you have over your data. It applies to all users of the platform, including
        creators, audience members, and participants in the research pilot.
      </p>

      <LegalSection number="1" title="Data We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Account information such as your name, email address, and username.</li>
          <li>Uploaded content and its associated metadata.</li>
          <li>
            Demographic information such as gender and location, which is collected separately
            and only with your explicit consent. This is used solely for fairness auditing of
            the recommendation system.
          </li>
          <li>Interaction data such as views, follows, and other engagement on the platform.</li>
        </ul>
        <p>
          During the research pilot, each participant is assigned a Unique ID before any data
          collection begins, and no name or contact detail is stored alongside interaction data.
        </p>
      </LegalSection>

      <LegalSection number="2" title="How We Use Your Data">
        <p>Data is used to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Operate and maintain the platform.</li>
          <li>Assess the quality of uploaded content.</li>
          <li>Generate personalized recommendations.</li>
          <li>Enforce fairness constraints across creator subgroups.</li>
          <li>Evaluate the platform during the research pilot.</li>
        </ul>
        <p>Demographic data is never used to individually target or exclude a specific user.</p>
      </LegalSection>

      <LegalSection number="3" title="Data Storage and Third Parties">
        <p>
          Structured data is stored in PostgreSQL, and media files are stored using Cloudinary.
          Content quality and recommendation scoring are performed by a separate machine
          learning service using pre-trained models, including MERT, NIMA, CLIP, and LightGCN,
          which were originally trained on third-party public datasets before being fine-tuned
          on locally collected Rwandan content.
        </p>
        <p>
          During the pilot, only the researcher and their supervisor have access to identifiable
          participant data. Pilot research data is retained for three months after graduation and
          then securely destroyed, in line with the university&apos;s ethics requirements.
        </p>
        <p>
          General platform account data outside the research pilot is retained for as long as
          the account remains active, and is deleted on request.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Your Rights">
        <p>
          Consistent with Rwanda&apos;s Law No. 058/2021 Relating to the Protection of Personal
          Data and Privacy, you may request access to, correction of, or deletion of your
          personal data at any time through your account settings, or by contacting the
          platform directly.
        </p>
        <p>
          Pilot participants may withdraw from the study, with their data removed, at any point
          before the communicated analysis cut-off date.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Data Security">
        <p>
          Access to identifying participant data is restricted to the researcher and supervisor.
          Demographic data used for fairness auditing is stored separately from identifying
          profile information, and standard security practices, including encryption and access
          control, apply to all third-party services used.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Algorithmic Transparency">
        <p>
          Creators can view a plain-language explanation of how their visibility score is
          calculated through the transparency panel on their dashboard, and may request human
          review of a score they believe is inaccurate.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Third-Party Licenses and Attribution">
        <p>
          Talynk uses pre-trained models and public datasets, including MERT, NIMA, CLIP,
          LightGCN, FMA, and AADB, under their respective open licenses, with attribution
          documented in the project&apos;s technical documentation.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Changes to This Policy">
        <p>Users will be notified of material changes to this policy before the changes take effect.</p>
      </LegalSection>

      <LegalSection number="9" title="Contact">
        <p>
          If you have questions about this Privacy Policy or want to exercise your data rights,
          please contact us through your account settings or the contact details provided on the
          platform.
        </p>
      </LegalSection>
    </LegalPage>
  );
}