// A clock you control, for tests. Already written. You don't need to change it.
//
//   const clock = createFakeClock();
//   clock.now()             the pretend time in milliseconds, starting at 0
//   await clock.sleep(ms)   waits until the pretend time has moved ms forward
//   await clock.advance(ms) moves the pretend time forward, waking every sleep
//                           that's due, in order, and letting the code that
//                           was waiting on it run before moving on
//
// The real clock has the same two methods your code uses:
//
//   const realClock = { now: () => Date.now(), sleep: (ms) => new Promise((r) => setTimeout(r, ms)) };
//
// Your code only ever calls clock.now() and clock.sleep(ms). Then tests can
// pass in this fake one and an hour of retries takes a few milliseconds.

function createFakeClock(start = 0) {
  let current = start;
  let order = 0;
  const sleepers = [];

  async function settle() {
    for (let i = 0; i < 10; i++) await new Promise((resolve) => setImmediate(resolve));
  }

  return {
    now: () => current,

    sleep(ms) {
      return new Promise((resolve) => {
        sleepers.push({ at: current + Math.max(0, ms), order: order++, resolve });
      });
    },

    async advance(ms) {
      const target = current + ms;
      await settle();
      for (;;) {
        let next = null;
        for (const s of sleepers) {
          if (s.at > target) continue;
          if (!next || s.at < next.at || (s.at === next.at && s.order < next.order)) next = s;
        }
        if (!next) break;
        sleepers.splice(sleepers.indexOf(next), 1);
        current = Math.max(current, next.at);
        next.resolve();
        await settle();
      }
      current = target;
      await settle();
    },

    sleeping: () => sleepers.length,
  };
}

module.exports = { createFakeClock };
