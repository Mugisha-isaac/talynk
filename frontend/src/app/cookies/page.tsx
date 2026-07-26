import { LegalPage, LegalSection } from '@/components/legal/LegalPage';

export const metadata = {
  title: 'Cookie Policy | Talynk',
  description: 'How Talynk uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="26 July 2026">
      <p className="text-slate-400">
        This Cookie Policy explains how Talynk uses cookies and similar technologies when you
        use the platform.
      </p>

      <LegalSection number="1" title="What Are Cookies">
        <p>
          Cookies are small text files stored on your device that help a website function and
          remember information about your visit.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Cookies We Use">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="text-white font-medium">Essential cookies</span> &mdash; required to
            keep you signed in and to maintain the security of your session. Without these, core
            features like logging in would not work.
          </li>
          <li>
            <span className="text-white font-medium">Preference cookies</span> &mdash; remember
            settings such as your display preferences, so you do not have to reconfigure them on
            every visit.
          </li>
        </ul>
        <p>
          Talynk does not currently use third-party advertising or cross-site tracking cookies.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Managing Cookies">
        <p>
          Most browsers let you control or delete cookies through their settings. Blocking
          essential cookies may prevent parts of the platform, such as signing in, from working
          correctly.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Changes to This Policy">
        <p>Users will be notified of material changes to this policy before the changes take effect.</p>
      </LegalSection>

      <LegalSection number="5" title="Contact">
        <p>
          If you have questions about this Cookie Policy, please contact us through your account
          settings or the contact details provided on the platform.
        </p>
      </LegalSection>
    </LegalPage>
  );
}