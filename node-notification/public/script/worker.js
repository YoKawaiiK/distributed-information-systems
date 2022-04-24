// Push event
self.addEventListener("push", (event) => {
  event.waitUntil(onPush(event));
});

async function onPush(event) {
  const data = event.data.json();
  // config for notification from server response
  let notificationConfig = {
    body: data.message,
    icon: "/assets/icon.png",
    image: data.image || "/assets/image.png",
    data: data.data,
    actions: [...data.actions],
  };
  await self.registration.showNotification(data.title, notificationConfig);
}

// When user clicked at notification
self.onnotificationclick = function (event) {
  event.notification.close();
  let url = null;
  // Select action - url to go to page by payload url

  switch (event.action) {
    case "anotherAction":
      break;

    default:
      url = event.notification.data.url;
      break;
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
};
