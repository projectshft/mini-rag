# Duplicate Copy of React Errors When Using NPM Link

---

CODEX

Duplicate Copy of React Errors When Using NPM Link

Our team has been hard at work developing shared component and shared state libraries for our growing number of e-commerce sites. To centralize this shared logic we’ve published these libraries as npm packages. This was only half the game we soon found out.

In order for our team to use these packages in development we relied on npm-linking the local repos to our consuming front-end. npm link allows you to create a symlink from a package in your node modules to a local directory on your machine. You can read more about it here. This is a better alternative to constantly publishing a package, installing it to check out your changes and crossing your fingers… though we went down this route for longer than I’d like to admit 😅

Our UI library in particular was difficult to npm link. This package relies on React, as do the front ends that install it, leading to an error you’re probably intimately familiar with if you are reading this

Our library correctly excludes peer dependencies such as React and works fine in production but when we inspected the node_modules when npm-linking our package, we saw React was still there!

Now, there are more than a few suggestions on the interwebs about what you can do to prevent this error. We tried about all of them I believe.

Here’s what worked for us:

In the consuming front-end, update your webpack config to resolve paths from react and react-dom to node_modules/react , and node_modules/react-dom , respectively. This way our app will resolve any paths to those packages to the top level of our node_modules directory instead of looking into the dependencies.

We had actually not run npm run eject in our front-end React app so we had no access to the webpack config. Luckily, tools like customize-cra expose webpack and you can modify the config object.

Whew! Here is our config

Error gone! Now our developers can safely work with our libraries to test out changes before publishing new versions ✅.

CODEX

Duplicate Copy of React Errors When Using NPM Link

Our team has been hard at work developing shared component and shared state libraries for our growing number of e-commerce sites. To centralize this shared logic we’ve published these libraries as npm packages. This was only half the game we soon found out.

In order for our team to use these packages in development we relied on npm-linking the local repos to our consuming front-end. npm link allows you to create a symlink from a package in your node modules to a local directory on your machine. You can read more about it here. This is a better alternative to constantly publishing a package, installing it to check out your changes and crossing your fingers… though we went down this route for longer than I’d like to admit 😅

Our UI library in particular was difficult to npm link. This package relies on React, as do the front ends that install it, leading to an error you’re probably intimately familiar with if you are reading this

Our library correctly excludes peer dependencies such as React and works fine in production but when we inspected the node_modules when npm-linking our package, we saw React was still there!

Now, there are more than a few suggestions on the interwebs about what you can do to prevent this error. We tried about all of them I believe.

Here’s what worked for us:

In the consuming front-end, update your webpack config to resolve paths from react and react-dom to node_modules/react , and node_modules/react-dom , respectively. This way our app will resolve any paths to those packages to the top level of our node_modules directory instead of looking into the dependencies.

We had actually not run npm run eject in our front-end React app so we had no access to the webpack config. Luckily, tools like customize-cra expose webpack and you can modify the config object.

Whew! Here is our config

Error gone! Now our developers can safely work with our libraries to test out changes before publishing new versions ✅.