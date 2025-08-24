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

  const registration = await navigator.serviceWorker.register("/sw.js");
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    console.log("🔁 Already subscribed:", existingSubscription);
    return existingSubscription;
  }

  const serverKey = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: serverKey,
  });

  if (!socket.connected) {
    console.warn("⚠️ Socket not connected yet");
    return subscription;
  }

  socket.emit("register-subscription", { userId, subscription });
  console.log("✅ New subscription:", subscription, userId);
  return subscription;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}
