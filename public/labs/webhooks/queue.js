// Milestone 1. A job queue with workers. Your agent writes the code. You plan
// it first and review every line.
//
// new JobQueue({ concurrency, work })
//   concurrency  the most jobs running at once
//   work(job)    an async function that does one job. It may throw.
//
// add(job)     puts a job at the back of the line. If a worker is free, the
//              job starts. Jobs start in the order they were added.
// onIdle()     a promise that resolves once nothing is waiting and nothing
//              is running. If that's already true, it resolves straight away.
// stats()      { waiting, running, succeeded, failed }
//
// A job that throws counts as failed. It must never stop the other jobs,
// leave a worker stuck, or crash the program.
// add must stay fast when a hundred thousand jobs are waiting.

class JobQueue {
  constructor({ concurrency = 1, work }) {}

  add(job) {}

  onIdle() {}

  stats() {}
}

module.exports = { JobQueue };
