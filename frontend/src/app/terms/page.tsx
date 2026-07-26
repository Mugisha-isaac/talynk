import { LegalPage, LegalSection } from '@/components/legal/LegalPage';

export const metadata = {
  title: 'Terms of Service | Talynk',
  description: 'The terms that govern your use of the Talynk platform.',
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="26 July 2026">
      <p className="text-slate-400">
        These Terms of Service govern your access to and use of Talynk. By creating an account,
        you agree to these terms.
      </p>

      <LegalSection number="1" title="Acceptance and Eligibility">
        <p>
          Talynk is available to users aged 18 and above. By creating an account, you confirm
          that you meet this requirement and agree to this License Agreement and our{' '}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection number="2" title="Content Ownership and License">
        <p>
          Creators retain ownership of all content they upload. By uploading, a creator grants
          Talynk a limited, non-exclusive license to host, display, and process that content for
          the purpose of quality assessment, recommendation, and showcase within the platform.
          This license ends when the content is deleted from the platform.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Fairness-Constrained Recommendations">
        <p>
          Talynk uses a recommendation and content quality assessment system designed to promote
          fair visibility across creator subgroups. This system may use demographic information,
          collected only with explicit consent, to audit and enforce fairness. Demographic data
          is never used to individually target or exclude a specific user.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Algorithmic Transparency">
        <p>
          Creators can view a plain-language explanation of how their visibility score is
          calculated through the transparency panel on their dashboard, and may request human
          review of a score they believe is inaccurate.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Research Pilot Participation">
        <p>
          During the research pilot phase, participation involves surveys, interviews, and
          platform usage data collection under ethical clearance from the ALU Senate&apos;s
          Research Ethics Committee. Participants provide informed consent before joining, and
          may withdraw, with their data removed, at any point before the communicated analysis
          cut-off date. See our{' '}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
            Privacy Policy
          </a>{' '}
          for details on how pilot data is handled.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Acceptable Use">
        <p>
          You agree not to upload content you do not have the right to share, misuse the
          platform to harass or harm others, or attempt to interfere with the fairness or
          integrity of the recommendation and quality assessment systems.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Account Termination">
        <p>
          You may delete your account at any time. Talynk may suspend or terminate accounts that
          violate these Terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Changes to These Terms">
        <p>Users will be notified of material changes to these Terms before the changes take effect.</p>
      </LegalSection>

      <LegalSection number="9" title="Contact">
        <p>
          If you have questions about these Terms, please contact us through your account
          settings or the contact details provided on the platform.
        </p>
      </LegalSection>
    </LegalPage>
  );
}