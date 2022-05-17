const messages = [
  {
    fromUserId: 2,
    toUserId: 1,
    listingId: 1,
    content: "Is this still available? from ______JOHN",
    id: 1,
    dateTime: 1546044521951
  },
  {
    fromUserId: 2,
    toUserId: 1,
    listingId: 1,
    content: "This is another one message from ____JOHN.",
    id: 2,
    dateTime: 1536044531956
  },
  {
    fromUserId: 2,
    toUserId: 1,
    listingId: 1,
    content: "This message from ____JOHN.",
    id: 3,
    dateTime: 1386042521956
  },
  {
    fromUserId: 1,
    toUserId: 2,
    listingId: 1,
    content: "This is another Message from -----MOSH",
    id: 4,
    dateTime: 1486044521956
  },
  {
    fromUserId: 3,
    toUserId: 1,
    listingId: 1,
    content: "YOU ARE WELCOME!! This is a Message from ++++++BORIS",
    id: 5,
    dateTime: 1386044521959
  },
  {
    fromUserId: 1,
    toUserId: 3,
    listingId: 1,
    content: "HALOOOOO is a Message from ------MOSH",
    id: 6,
    dateTime: 1486044521959
  }
];

const getMessagesForUser = id =>
  messages.filter(message => message.toUserId === id || message.fromUserId === id);

const add = message => {
  message.id = messages.length + 1;
  message.dateTime = Date.now();
  messages.push(message);
};

module.exports = { add, getMessagesForUser };
