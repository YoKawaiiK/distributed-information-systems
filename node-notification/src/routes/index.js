const { Router } = require("express");
const router = Router();

const webpush = require("../webpush");
let subscribers = [];

function containsObject(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].keys.auth === obj.keys.auth) {
      return true;
    }
  }
  return false;
}

router.post("/subscription", async (req, res) => {
  if (!containsObject(req.body, subscribers)) {
    subscribers.push(req.body);
  }

  return res.status(200).json({
    message: "subscription successfully!",
  });
});

router.post("/new-message", async (req, res) => {
  const { message, title, image } = req.body;
  const payload = JSON.stringify({
    title,
    message,
    image,
    data: {
      url: "https://127.0.0.1:3001/",
    },

    actions: [{ action: "url", title: "url" }],
  });
  try {
    for (const subscriber of subscribers) {
      await webpush
        .sendNotification(subscriber, payload)

        .then((_) => {
          console.log("send");
        })
        .catch((_) => {
          console.log("reciever was deleted");
        });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
