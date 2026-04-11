# Using object-mapper to Format Your API Data and Maintain Consistency

---

Using object-mapper to Format Your API Data and Maintain Consistency

As a full stack or front end JS developer, you’re going to find yourself spending a lot of time dealing with objects returned from an API that you will need to format to an interface that your front end expects. Maybe you are using a third party API that returns JSON data in kebab_case or has dates that are in some godawful format or proper names that aren’t capitalized, or maybe your backend team has recently updated the database to use new field names or changed old values to a new format.

Now you have the choice of updating all your front end code which relies on legacy naming conventions and expects certain values or having your API maintain consistency by formatting the data before passing it off to the front end… I’ll choose working with the API over the error prone method of updating all my front end code any day.

You always have the option of rolling your own formatter function which can take in an object and return its new and improved version. This will likely involve deleting keys, reassigning properties as well as helper functions to transform the object values. Rolling your own has the benefit of giving you granular control but comes with the cost of maintaining the logic and testing the functionality.

Luckily there’s a simple library which handles this common task of transforming object values and keys: object-mapper. This package makes formatting an array of objects pretty trivial:

First let’s install the package — npm install object-mapper

Our map in the code above is an object in which the keys are the properties of the object we wish to transform. The key and transform properties tell our mapper the new name of the object’s key and how we will transform the value of the object passed in, respectively.

Now we simply pass our map to the mapper library with the object we want transformed and voila! Our new and improved object has proper name casing, properties that match the JS naming convention and a real date instead of a string.

So next time your database schema changes or you switch data providers, you may want to consider object-mapper as a means to keep your front-end happy and maintain data sanity.

Using object-mapper to Format Your API Data and Maintain Consistency

As a full stack or front end JS developer, you’re going to find yourself spending a lot of time dealing with objects returned from an API that you will need to format to an interface that your front end expects. Maybe you are using a third party API that returns JSON data in kebab_case or has dates that are in some godawful format or proper names that aren’t capitalized, or maybe your backend team has recently updated the database to use new field names or changed old values to a new format.

Now you have the choice of updating all your front end code which relies on legacy naming conventions and expects certain values or having your API maintain consistency by formatting the data before passing it off to the front end… I’ll choose working with the API over the error prone method of updating all my front end code any day.

You always have the option of rolling your own formatter function which can take in an object and return its new and improved version. This will likely involve deleting keys, reassigning properties as well as helper functions to transform the object values. Rolling your own has the benefit of giving you granular control but comes with the cost of maintaining the logic and testing the functionality.

Luckily there’s a simple library which handles this common task of transforming object values and keys: object-mapper. This package makes formatting an array of objects pretty trivial:

First let’s install the package — npm install object-mapper

Our map in the code above is an object in which the keys are the properties of the object we wish to transform. The key and transform properties tell our mapper the new name of the object’s key and how we will transform the value of the object passed in, respectively.

Now we simply pass our map to the mapper library with the object we want transformed and voila! Our new and improved object has proper name casing, properties that match the JS naming convention and a real date instead of a string.

So next time your database schema changes or you switch data providers, you may want to consider object-mapper as a means to keep your front-end happy and maintain data sanity.