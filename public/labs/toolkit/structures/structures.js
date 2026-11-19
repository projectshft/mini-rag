// By-hand toolkit. You write this project yourself. No agent.
//
// Three classes. The comments say what each method does. How you store the
// data inside is your decision.

// Last in, first out. Like a pile of plates.
class Stack {
  // push(item)   put an item on top
  // pop()        take the top item off and give it back. undefined when empty
  // peek()       give the top item without taking it off. undefined when empty
  // size()       how many items
  // isEmpty()    true when there are none
}

// First in, first out. Like a line at a shop.
class Queue {
  // enqueue(item)  join the back of the line
  // dequeue()      take the item at the front and give it back. undefined when empty
  // peek()         give the front item without taking it. undefined when empty
  // size()         how many items
  // isEmpty()      true when there are none
  //
  // dequeue has to stay fast when the queue is very long.
}

// Look a value up by a key. Keys are always strings.
// The rule: don't use the built-in Map, and don't use a plain object as the
// lookup table. Build it from arrays.
class HashMap {
  // set(key, value)  store a value under a key. Setting the same key again replaces it
  // get(key)         give the value, or undefined when the key isn't there
  // has(key)         true when the key is there
  // delete(key)      remove the key. Give true if it was there, false if not
  // size()           how many keys
}

module.exports = { Stack, Queue, HashMap };
