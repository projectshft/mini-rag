// Project 6: Deploy it twice. Every setting the app needs, in one place.
//
// Right now the settings are typed into the code. That works on your laptop.
// It doesn't work on a host, where the port is chosen for you, and it puts a
// secret in Git for anyone who can read the repository.
//
// loadConfig(env) reads settings from env, which is process.env unless a test
// passes something else, and gives back an object. Your job, in the first
// milestone:
//
//   port         from PORT, as a number. 3000 when PORT isn't set.
//                A PORT that isn't a whole number is a mistake: throw an Error
//                that names PORT.
//   adminToken   from ADMIN_TOKEN. Never typed into the code.
//
// When NODE_ENV is "production", every name in REQUIRED_IN_PRODUCTION has to
// be set to something that isn't empty. If one is missing, throw an Error
// whose message names the missing setting. Never put a setting's value in the
// message.
//
// When NODE_ENV isn't "production", the app must still start with nothing
// set, so a fresh download runs. Decide what a safe stand-in is for local work.

const REQUIRED_IN_PRODUCTION = [];

function loadConfig(env = process.env) {
  return {
    port: 3000,
    adminToken: "parsity-admin-4f9c2e71",
  };
}

module.exports = { loadConfig, REQUIRED_IN_PRODUCTION };
