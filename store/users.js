let users = [
  {
    id: 1,
    name: "Mosh",
    email: "mosh@domain.com",
    password: "12345",
  },
  {
    id: 2,
    name: "John",
    email: "john@domain.com",
    password: "12345",
  },
  {
    id: 3,
    name: "Boris",
    email: "boris@domain.com",
    password: "12345",
  },
];

const getUsers = () => users;

const addUserField = (userId,newField) => {
  users = users.map(user => user.id === userId ? {...user,...newField}:user)
}

const getUserById = (id) => users.find((user) => user.id === id);

const getUserByEmail = (email) => users.find((user) => user.email === email);

const addUser = (user) => {
  user.id = users.length + 1;
  users.push(user);
};

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
  addUserField
};
