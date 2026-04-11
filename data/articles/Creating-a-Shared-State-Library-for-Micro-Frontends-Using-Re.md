# Creating a Shared State Library for Micro-Frontends Using Redux

---

Creating a Shared State Library for Micro-Frontends Using Redux

Our dev team recently became responsible for building micro front-ends using React for e-commerce sites. After building our second site, we noticed there was a lot of duplication among our redux actions and how they handle common backend interactions. For example, a user adding an item to a cart or logging in is the exact same across applications.

Inevitably, we discovered a bug affecting an action with carts and ended up applying a fix to reducers on both sites… while it’s trivial to copy and paste a fix across two sites, we could only imagine having this problem span dozens. What about refactors? This was not sustainable. There are a lot of articles and opinions about creating shared component libraries but what about shared state management libraries?

We knew we needed to create an NPM package that our current and future sites could leverage but there was the question of how to reconcile app-specific logic we want redux to handle. For example, what if site A needs a reducer to handle some specific logic that is scoped only to that site? One approach is to use 2 stores in a React app. This method quickly proved error-prone and would potentially place a lot of cognitive load on developers.

The problem with using 2 stores is the additional boilerplate code you need to use for useDispatch or useSelector to work. In the example below, we are passing context to our redux hooks to identify which store to access. Having two stores means two sets of dispatch useSelector etc…

I could already feel the confusion brewing with this approach. What we wanted was simple; the flexibility to use external reducers and actions without having multiple stores 🤔.

The answer, which seems obvious now, is to use reducer composition via combineReducers allowing us to compose our reducers from myriad different sources if we choose.

Creating an NPM package that simply exposed reducers and actions that we had already written (twice) was a simple copy paste job. The interesting bit of work was in our bundling and publishing to get our library to work and allow easy importing on the consuming front-ends.

In our webpack config we alias the entry points to make it easier for developers to use the specific reducer they need, rather than having to write/some/long/path/to/a/reducer.

Our externals include packages which our front end already has so they won’t be included twice and will reduce bundle size. You can see in the consuming filefrontEndStore.js we simply import the reducers we want and combine them with any local reducers. Voila. Now we don’t need to worry about supporting multiple stores!

But what about publishing? Well I’m glad you asked. Publishing to NPM is simply a command but we want to keep a history of tags in our git repo as well in case we need to check out the library at a certain tag, perhaps to create a hotfix for a particular version or compare versions. Here are the commands to make versioning and git tags easy as pie:

Now all a developer needs to do is run npm version minor to update the package.json version, add tags and create a production build. npm publish will make the library available for your adoring fans!

While this solution seems to fit our needs and specific scenario, there are definitely a lot of strong opinions regarding micro front-end architecture and we are still on a learning journey. Hopefully this will make your own attempts at creating a shared redux library a bit easier.

Enjoyed this article? If so, get more similar content by subscribing to Decoded, our YouTube channel!

Creating a Shared State Library for Micro-Frontends Using Redux

Our dev team recently became responsible for building micro front-ends using React for e-commerce sites. After building our second site, we noticed there was a lot of duplication among our redux actions and how they handle common backend interactions. For example, a user adding an item to a cart or logging in is the exact same across applications.

Inevitably, we discovered a bug affecting an action with carts and ended up applying a fix to reducers on both sites… while it’s trivial to copy and paste a fix across two sites, we could only imagine having this problem span dozens. What about refactors? This was not sustainable. There are a lot of articles and opinions about creating shared component libraries but what about shared state management libraries?

We knew we needed to create an NPM package that our current and future sites could leverage but there was the question of how to reconcile app-specific logic we want redux to handle. For example, what if site A needs a reducer to handle some specific logic that is scoped only to that site? One approach is to use 2 stores in a React app. This method quickly proved error-prone and would potentially place a lot of cognitive load on developers.

The problem with using 2 stores is the additional boilerplate code you need to use for useDispatch or useSelector to work. In the example below, we are passing context to our redux hooks to identify which store to access. Having two stores means two sets of dispatch useSelector etc…

I could already feel the confusion brewing with this approach. What we wanted was simple; the flexibility to use external reducers and actions without having multiple stores 🤔.

The answer, which seems obvious now, is to use reducer composition via combineReducers allowing us to compose our reducers from myriad different sources if we choose.

Creating an NPM package that simply exposed reducers and actions that we had already written (twice) was a simple copy paste job. The interesting bit of work was in our bundling and publishing to get our library to work and allow easy importing on the consuming front-ends.

In our webpack config we alias the entry points to make it easier for developers to use the specific reducer they need, rather than having to write/some/long/path/to/a/reducer.

Our externals include packages which our front end already has so they won’t be included twice and will reduce bundle size. You can see in the consuming filefrontEndStore.js we simply import the reducers we want and combine them with any local reducers. Voila. Now we don’t need to worry about supporting multiple stores!

But what about publishing? Well I’m glad you asked. Publishing to NPM is simply a command but we want to keep a history of tags in our git repo as well in case we need to check out the library at a certain tag, perhaps to create a hotfix for a particular version or compare versions. Here are the commands to make versioning and git tags easy as pie:

Now all a developer needs to do is run npm version minor to update the package.json version, add tags and create a production build. npm publish will make the library available for your adoring fans!

While this solution seems to fit our needs and specific scenario, there are definitely a lot of strong opinions regarding micro front-end architecture and we are still on a learning journey. Hopefully this will make your own attempts at creating a shared redux library a bit easier.

Enjoyed this article? If so, get more similar content by subscribing to Decoded, our YouTube channel!