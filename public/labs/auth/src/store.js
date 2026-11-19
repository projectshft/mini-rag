// All the data, kept in memory. Restarting the server starts from the seed again.
//
// customers  the companies that use the app. Each one is a tenant: its users
//            and orders belong to it and to nobody else.
// users      people who log in. Each belongs to one customer and has one role:
//            "admin", "staff" or "viewer".
// orders     belong to one customer.

function createStore() {
  let nextId = 1;
  const newId = () => String(nextId++);

  const store = {
    customers: [],
    users: [],
    orders: [],

    addCustomer({ name }) {
      const customer = { id: newId(), name };
      store.customers.push(customer);
      return customer;
    },

    // Saves a user record exactly as given. Whatever you pass in is what gets
    // stored, so decide carefully what goes in it.
    addUser(fields) {
      const user = { id: newId(), ...fields };
      store.users.push(user);
      return user;
    },

    addOrder({ customerId, item, quantity, status = "new" }) {
      const order = { id: newId(), customerId, item, quantity, status };
      store.orders.push(order);
      return order;
    },

    findUserById(id) {
      return store.users.find((u) => u.id === id) || null;
    },

    findUserByEmail(email) {
      const wanted = String(email).toLowerCase();
      return store.users.find((u) => String(u.email).toLowerCase() === wanted) || null;
    },

    findOrder(id) {
      return store.orders.find((o) => o.id === id) || null;
    },
  };

  return store;
}

module.exports = { createStore };
