self.addEventListener("push", function (event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  const title = data.title || "📣 มีการแจ้งเตือนใหม่";
  const options = {
    body: data.body || "คุณมีการแจ้งเตือนใหม่จากระบบ",
    icon: "/logo192.png",
    data: {
      url: data.url || "http://localhost:5174/", // <-- เพิ่ม url ที่ต้องการให้เปิดเมื่อคลิก
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen =
    event.notification && event.notification.data && event.notification.data.url
      ? event.notification.data.url
      : "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
