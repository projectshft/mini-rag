# Publishing a Library Using PlopJS to Scaffold Components

---

Publishing a Library Using PlopJS to Scaffold Components

Charles, a ReactJS developer, sits down and wipes the breakfast burrito crumbs from his scraggly beard.

“Ahh, time to create another component!” he exclaims, while cracking his fingers and then resting them ever so gently on his mechanical keyboard.

The codebase he’s adding to has a number of other components, similar to the one he’s about to create. He copies all the folders and files under SomeGenericComponent and renames them, then goes through the SomeGenericComponent.test.js file and updates the name of the component and removes all the current test statements.

“I’ll get to these later” he chuckles.

He follows a similar process for the rest of the files, changing names, removing logic and extraneous imports until he has a blank slate. This manual process, one he’s done dozens of times, is fraught with small errors. A spelling mistake here makes an import unresolvable. An additional file that should’ve been deleted is pushed to source code. A test description is incorrect.

This error-prone method that Charlie uses led our team to explore how to programatically scaffold new components and enforce established patterns and file structure without precarious copying and pasting. We ultimately decided to leverage plop.js — a library for generating code. Through a plopFile we were able to expose generators to scaffold components based on the input from a user.

We have a pretty useful generator here that will scaffold a component with a generic test and even includes some pieces of the global state from our redux store.

Plop.js has some excellent documentation for how to set up generators and template files using handlebars but one thing missing from their documentation is how to expose your generators through a standalone library!

Our generator worked great when it was included in the project where we were using it but in order to leverage this tool across our different projects we needed to package this code in a library that could be installed anywhere. Node-plop is likely more suited for this kind of task but using it would require a lot more effort and tooling which we wanted to avoid if necessary.

We published our generator library but when we linked it to a front end consumer we saw that it was not working as expected — plop looks for templates in certain directories to use based on your generator, but they were all incorrect?! Instead of adding the generated code to our consumer it was looking for paths that did not exist.

Our solution was to use the relative paths in order to find the templates that shipped with our library and to use the current working directory to know where to install the code generated from the templates:

In our consuming front ends we installed plop as a dependency and included a plopFile.js at the root of the project where we simply required our library:

Using plop is simple and can really reduce the amount of hours your team spends re-writing the same code while also enforcing standards and patterns across repos. Solving the issue of how to package and publish a library where all our templates live was the biggest hurdle we needed to clear in order to get the maximum benefit from this tool. Hopefully a Google search led you here and saved you from re-inventing the wheel. Happy coding!

Publishing a Library Using PlopJS to Scaffold Components

Charles, a ReactJS developer, sits down and wipes the breakfast burrito crumbs from his scraggly beard.

“Ahh, time to create another component!” he exclaims, while cracking his fingers and then resting them ever so gently on his mechanical keyboard.

The codebase he’s adding to has a number of other components, similar to the one he’s about to create. He copies all the folders and files under SomeGenericComponent and renames them, then goes through the SomeGenericComponent.test.js file and updates the name of the component and removes all the current test statements.

“I’ll get to these later” he chuckles.

He follows a similar process for the rest of the files, changing names, removing logic and extraneous imports until he has a blank slate. This manual process, one he’s done dozens of times, is fraught with small errors. A spelling mistake here makes an import unresolvable. An additional file that should’ve been deleted is pushed to source code. A test description is incorrect.

This error-prone method that Charlie uses led our team to explore how to programatically scaffold new components and enforce established patterns and file structure without precarious copying and pasting. We ultimately decided to leverage plop.js — a library for generating code. Through a plopFile we were able to expose generators to scaffold components based on the input from a user.

We have a pretty useful generator here that will scaffold a component with a generic test and even includes some pieces of the global state from our redux store.

Plop.js has some excellent documentation for how to set up generators and template files using handlebars but one thing missing from their documentation is how to expose your generators through a standalone library!

Our generator worked great when it was included in the project where we were using it but in order to leverage this tool across our different projects we needed to package this code in a library that could be installed anywhere. Node-plop is likely more suited for this kind of task but using it would require a lot more effort and tooling which we wanted to avoid if necessary.

We published our generator library but when we linked it to a front end consumer we saw that it was not working as expected — plop looks for templates in certain directories to use based on your generator, but they were all incorrect?! Instead of adding the generated code to our consumer it was looking for paths that did not exist.

Our solution was to use the relative paths in order to find the templates that shipped with our library and to use the current working directory to know where to install the code generated from the templates:

In our consuming front ends we installed plop as a dependency and included a plopFile.js at the root of the project where we simply required our library:

Using plop is simple and can really reduce the amount of hours your team spends re-writing the same code while also enforcing standards and patterns across repos. Solving the issue of how to package and publish a library where all our templates live was the biggest hurdle we needed to clear in order to get the maximum benefit from this tool. Hopefully a Google search led you here and saved you from re-inventing the wheel. Happy coding!