// A tiny cache, like a small Redis. Your agent writes the code. You plan it
// first and review every line.
//
// new Cache({ maxEntries, now })
//   maxEntries  the most entries it holds at once
//   now()       gives the time in milliseconds, like Date.now. It's passed in
//               so tests can move time forward without waiting. Never call
//               Date.now directly inside the cache.
//
// Every method except getOrLoad must take the same time however many entries
// the cache holds, with two exceptions noted below. That rules out searching
// an array to find a key or to find the oldest entry.
//
// Build the "least recently used" order yourself, with a doubly linked list
// and a Map from key to list node. The lesson explains both.

class Cache {
  constructor({ maxEntries = 1000, now = Date.now } = {}) {}

  // get(key)
  //   Gives back the value, or undefined when the key isn't there or has
  //   expired. Counts as a use. Counts a hit or a miss.
  get(key) {}

  // set(key, value, ttlMs)
  //   Stores value under key. Counts as a use.
  //   ttlMs is optional. With it, the entry expires ttlMs after now: an entry
  //   set at time 1000 with ttlMs 500 is still there at 1499 and gone at 1500.
  //   Without it, the entry never expires. Setting a key again replaces the
  //   value and the expiry.
  //   If the cache already holds maxEntries entries and key is new, first
  //   remove the least recently used entry. That's an eviction.
  set(key, value, ttlMs) {}

  // has(key)
  //   true when the key is there and hasn't expired. Not a use, and not a hit
  //   or a miss.
  has(key) {}

  // delete(key)
  //   Removes the key. Gives back true if it was there, false if not.
  delete(key) {}

  // size()
  //   How many entries are there and not expired. This one may walk the
  //   entries.
  size() {}

  // keys()
  //   The keys that haven't expired, most recently used first. This one may
  //   walk the entries too.
  keys() {}

  // stats()
  //   { hits, misses, evictions }
  stats() {}

  // getOrLoad(key, loader, ttlMs)
  //   Gives back a promise of the value. If the key is there, that's a hit.
  //   If not, it's a miss: call loader(key), which gives back a promise, store
  //   the result with ttlMs, and give it back.
  //   If several callers ask for the same missing key while it's loading,
  //   call loader only once and give all of them the same result.
  //   If loader fails, every caller waiting on it gets the error, nothing is
  //   stored, and the next call tries loader again.
  getOrLoad(key, loader, ttlMs) {}
}

module.exports = { Cache };
