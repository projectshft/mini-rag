// The shop's data, and the tools the model may call to read it.
//
// A tool has three parts:
//   description  what it does, in words. The model reads this to decide when
//                to call it.
//   parameters   a JSON schema for its arguments. The model reads this too.
//   run          the function your code calls. The model never sees it.

const orders = {
  "1042": { status: "shipped", carrier: "UPS", eta: "2026-11-21" },
  "1043": { status: "processing" },
  "1044": { status: "delivered", deliveredOn: "2026-11-15" },
};

const stock = {
  "MUG-BLUE": 12,
  "MUG-RED": 0,
  "TEE-M": 3,
};

const tools = {
  lookup_order: {
    description: "Look up one order by its id and get its status. Use this whenever someone asks about a specific order.",
    parameters: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "The order id, digits only, like 1042" },
      },
      required: ["orderId"],
      additionalProperties: false,
    },
    run({ orderId }) {
      const order = orders[String(orderId)];
      if (!order) return { error: `No order with id ${orderId}` };
      return { orderId: String(orderId), ...order };
    },
  },

  // Your tool: check_stock
  //
  // Tells the model how many of one item are in stock.
  // - description: say what it does and when to use it
  // - parameters: one required string argument called sku
  // - run({ sku }) gives back { sku, available } where sku is the code in
  //   capitals and available is the number in stock. Item codes are stored in
  //   capitals, and models often send them in lowercase, so "mug-blue" has to
  //   work. An item that isn't in `stock` gives back an object with an
  //   `error` message. Careful: some items have 0 in stock, and that is a
  //   real answer.
};

module.exports = { tools, orders, stock };
