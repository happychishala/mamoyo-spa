import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { contactInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How MaMoyo Wellness & Beauty uses cookies on this website.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="July 2026"
      intro="This page explains the small number of cookies our website uses and how you can control them."
    >
      <LegalSection heading="What cookies are">
        <p>
          Cookies are small text files a website stores on your device. They help the site work and remember
          your choices. We keep our use of cookies to a minimum.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies we use">
        <p>We only use cookies that are strictly necessary for the site to function:</p>
        <ul>
          <li>
            <strong>Staff session</strong> (<code>mamoyo_admin_session</code>) — set only when a team member
            signs in to the back-office staff portal, to keep them logged in securely. Guests browsing the
            public site are never given this cookie.
          </li>
          <li>
            <strong>Cookie choice</strong> (<code>mamoyo-cookie-consent</code>) — remembers that you have seen
            and responded to our cookie notice, so we don&rsquo;t show it again.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> currently use advertising cookies or third-party analytics or tracking
          cookies. If that ever changes, we will update this policy and ask for your consent first.
        </p>
      </LegalSection>

      <LegalSection heading="Managing cookies">
        <p>
          Because the cookies above are essential to signing in and to remembering your notice choice, the site
          relies on them to work. You can still clear or block cookies at any time through your browser
          settings — see your browser&rsquo;s help pages for how. Note that blocking cookies may stop the staff
          portal from working.
        </p>
      </LegalSection>

      <LegalSection heading="Changes & contact">
        <p>
          We may update this policy as the site evolves. For any questions, email{" "}
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
