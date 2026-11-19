// Helpers for linked lists. You don't need to change this file.
//
// A node is an object with a value and a next. next is the node after it,
// or null at the end of the chain.
//
//   const c = new ListNode(3);          // { value: 3, next: null }
//   const b = new ListNode(2, c);       // { value: 2, next: c }
//   const a = new ListNode(1, b);       // a is the head: 1 -> 2 -> 3
//
// Your functions get plain objects with value and next. Our tests may build
// nodes without this class, so only rely on those two properties.
class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

// fromArray([1, 2, 3]) builds 1 -> 2 -> 3 and gives back the head.
// fromArray([]) gives null, the empty list.
function fromArray(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) {
    head = new ListNode(values[i], head);
  }
  return head;
}

// toArray(head) walks the chain and gives back its values as an array.
// Only use it on a chain that ends. On a loop it would never finish.
function toArray(head) {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.value);
    node = node.next;
  }
  return values;
}

// withLoop([1, 2, 3, 4], 1) builds 1 -> 2 -> 3 -> 4 and then points the
// last node back at the node in position 1 (the 2), so the chain never ends.
function withLoop(values, loopTo) {
  const head = fromArray(values);
  let last = head;
  while (last.next !== null) last = last.next;
  let target = head;
  for (let i = 0; i < loopTo; i++) target = target.next;
  last.next = target;
  return head;
}

module.exports = { ListNode, fromArray, toArray, withLoop };
