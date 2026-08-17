import { PushOptIn } from "@/components/account/PushOptIn";

// inside the JSX:
<PushOptIn vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!} />;
export default function PreferencesPage() {
  return (
    <div>
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Preferences
      </h1>
      <p className="font-ui text-sm text-obsidian-grey mt-6">
        Newsletter and notification preferences will live here.
      </p>
    </div>
  );
}
