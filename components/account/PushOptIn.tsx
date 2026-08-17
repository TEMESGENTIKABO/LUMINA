"use client";

import { useState } from "react";

export function PushOptIn({ vapidPublicKey }: { vapidPublicKey: string }) {
  const [status, setStatus] = useState<"idle" | "subscribed" | "denied" | "unsupported">("idle");

  async function subscribe() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("denied");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });

    setStatus("subscribed");
  }

  if (status === "subscribed") {
    return <p className="font-ui text-sm text-obsidian-grey">Push notifications enabled.</p>;
  }

  return (
    <div>
      <button onClick={subscribe} className="font-ui text-sm border border-obsidian-grey/20 px-4 py-2 hover:border-aksum-black">
        Enable breaking news notifications
      </button>
      {status === "denied" && <p className="font-ui text-xs text-manuscript-red mt-2">Notification permission was denied.</p>}
      {status === "unsupported" && <p className="font-ui text-xs text-obsidian-grey mt-2">Push notifications aren't supported in this browser.</p>}
    </div>
  );
}

