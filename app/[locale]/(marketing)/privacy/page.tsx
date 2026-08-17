export default function PrivacyPage() {
  return (
    <main className="max-w-content mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">Privacy Policy</h1>
      <p className="font-ui text-sm text-obsidian-grey mt-2">Last updated: August 2026</p>

      <div className="font-body-en text-[length:var(--text-body)] mt-8 flex flex-col gap-6">
        <section>
          <h2 className="font-headline-en text-[length:var(--text-headline-md)] mb-2">What we collect</h2>
          <p>When you create an account, we collect your email address and, optionally, your name. If you sign in with Google, we receive your name, email, and profile image from Google. We store the articles you save, the topics you follow, and any comments you post.</p>
        </section>
        <section>
          <h2 className="font-headline-en text-[length:var(--text-headline-md)] mb-2">How we use it</h2>
          <p>We use your email to send you account-related messages (sign-in links) and, if you subscribe, newsletter content you've opted into. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="font-headline-en text-[length:var(--text-headline-md)] mb-2">Your rights</h2>
          <p>You can delete your account at any time from your Account page, which permanently removes your saved articles, followed topics, comments, and session data. Comments you've posted are removed along with your account.</p>
        </section>
        <section>
          <h2 className="font-headline-en text-[length:var(--text-headline-md)] mb-2">Third-party services</h2>
          <p>We use Resend for email delivery, Vercel Blob for image storage, Google for optional sign-in, and Google Gemini to assist our editorial team - none of these services receive your reading history or personal account data beyond what's necessary for their function.</p>
        </section>
        <section>
          <h2 className="font-headline-en text-[length:var(--text-headline-md)] mb-2">Contact</h2>
          <p>Questions about this policy can be directed to the contact email listed in our site settings.</p>
        </section>
      </div>
    </main>
  );
}
