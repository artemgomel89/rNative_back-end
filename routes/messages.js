const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Expo } = require("expo-server-sdk");

const usersStore = require("../store/users");
const messagesStore = require("../store/messages");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

const schema = {
  userId: Joi.number().required(),
  message: Joi.string().required(),
};

router.get("/", auth, (req, res) => {
  const messages = messagesStore.getMessagesForUser(req.user.userId);

  const mapUser = (userId) => {
    const user = usersStore.getUserById(userId);
    return { id: user.id, name: user.name };
  };

  const resources = messages.sort((a,b) => b.dateTime - a.dateTime).map((message) => ({
    id: message.id,
    fromUser: mapUser(message.fromUserId),
    toUser: mapUser(message.toUserId),
    listingId: message.listingId,
    dateTime: message.dateTime,
    content: message.content,
  }))

  res.send(resources);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { userId, message } = req.body;
  console.log(userId,message)

  const targetUser = usersStore.getUserById(parseInt(userId));
  if (!targetUser) return res.status(400).send({ error: "Invalid userId." });

  messagesStore.add({
    fromUserId: req.user.userId,
    toUserId: userId,
    content: message,
  });

  console.log({
    fromUserId: req.user.userId,
    toUserId: userId,
    content: message,
  })

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(expoPushToken, message);

  res.status(201).send();
});
router.post('/')

module.exports = router;
