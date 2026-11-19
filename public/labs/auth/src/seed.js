// Two customers, a few users each, a few orders each. Used by server.js so you
// have something to try with curl. Every seeded password is "correct horse 1".

async function seed(app) {
  const { store } = app;
  const bright = store.addCustomer({ name: "BrightGear" });
  const fern = store.addCustomer({ name: "Fernleaf Books" });

  const password = "correct horse 1";
  await app.createUser({ customerId: bright.id, email: "ada@brightgear.example", password, role: "admin" });
  await app.createUser({ customerId: bright.id, email: "sam@brightgear.example", password, role: "staff" });
  await app.createUser({ customerId: bright.id, email: "vic@brightgear.example", password, role: "viewer" });
  await app.createUser({ customerId: fern.id, email: "fay@fernleaf.example", password, role: "admin" });
  await app.createUser({ customerId: fern.id, email: "tom@fernleaf.example", password, role: "staff" });

  store.addOrder({ customerId: bright.id, item: "Trail lantern", quantity: 3 });
  store.addOrder({ customerId: bright.id, item: "Camp stove", quantity: 1, status: "packed" });
  store.addOrder({ customerId: fern.id, item: "Gift card", quantity: 10 });

  return { bright, fern };
}

module.exports = { seed };
