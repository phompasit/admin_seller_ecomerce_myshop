import socket from "../seller_pages/socket";

export async function registerPush(userId) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window))
    return null;

  if (!import.meta.env.VITE_VAPID_PUBLIC_KEY) {
    console.error("❌ VAPID public key not found!");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    // Register service worker (ครั้งเดียวพอ)
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // ไม่มี subscription เดิม → สร้างใหม่
      const serverKey = urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY
      );
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: serverKey,
      });
      console.log("✅ New subscription created");
    } else {
      console.log("🔁 Reusing existing subscription");
    }

    // ส่ง subscription ไป backend
    if (socket.connected) {
      socket.emit("register-subscription", { userId, subscription });
    }
    // else {
    //   console.warn("⚠️ Socket not connected - subscription not sent");
    // }

    return subscription;
  } catch (error) {
    console.error("❌ Error during push registration:", error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}
