# Strangling Your Legacy Codebase: A Safe Way To Perform Migrations

---

Strangling Your Legacy Codebase: A Safe Way To Perform Migrations

You may not be familiar with the strangler pattern even if used it in the past. Working on a software team, you’ve likely been faced with a massive refactor or migration to a new platform/codebase/service architecture. Let’s say for example that your company wants to port all their widgets currently written in Jquery to ReactJS. These widgets are exported via a library and imported into a web app. You have some choices in how to approach this.

All or Nothing!

Your team begins re-writing widgets to use ReactJS. There are dozens! Some more complicated than others. You estimate it will take 6 months to fully migrate your legacy code to the new framework. About 9 months later (because no one can estimate a project this large) your team is finally ready to flip the switch!

Uh oh.

A PagerDuty alert pops up on your phone. Followed by another. And another. 😳

The decision to switch all of your widgets over at once has backfired spectacularly. Previous functionality is not working as expected. Certain features are missing patches that were merged to the legacy code base. It’s a mess. You cry over your half-eaten burrito in shame.

You fool. There was a better way.

The Strangler Pattern

Strangler Pattern is a way of migrating a legacy system incrementally by replacing existing functionalities with new applications and services in a phased approach

Most articles about the strangler pattern consider at migrating backend services but the same principle can easily be applied to front-end related migrations like the one mentioned above.

Rather than porting over all widgets at once, a safer strategy would be to have 2 separate libraries for the widgets: one for the legacy widgets and another for the ReactJS components. Once a widget was ported to use React, it would replace its legacy sibling. The legacy and new widgets would live in tandem, with the new widgets slowly becoming the dominant species in the code ecosystem.

An additional safety net might include using feature flags to toggle between the old and new widgets. Feature flags are decision points in code that determine whether or not invoke certain logic/UI display and are often controlled via a 3rd party app like split.io. If an unexpected feature cropped up in the new widget 😉, a simple flip of the feature flag would display the old, reliable widget.

Its Not Always About Writing Code

As software engineers, a large portion of our job involves writing code, but sometimes what we really need are patterns for common issues that are code-related but don’t necessarily involve writing code. Migrations are such a common issue that software teams encounter that it’s worth exploring different strategies to perform them and saving potentially months of headache by having a clear path forward.

Strangling Your Legacy Codebase: A Safe Way To Perform Migrations

You may not be familiar with the strangler pattern even if used it in the past. Working on a software team, you’ve likely been faced with a massive refactor or migration to a new platform/codebase/service architecture. Let’s say for example that your company wants to port all their widgets currently written in Jquery to ReactJS. These widgets are exported via a library and imported into a web app. You have some choices in how to approach this.

All or Nothing!

Your team begins re-writing widgets to use ReactJS. There are dozens! Some more complicated than others. You estimate it will take 6 months to fully migrate your legacy code to the new framework. About 9 months later (because no one can estimate a project this large) your team is finally ready to flip the switch!

Uh oh.

A PagerDuty alert pops up on your phone. Followed by another. And another. 😳

The decision to switch all of your widgets over at once has backfired spectacularly. Previous functionality is not working as expected. Certain features are missing patches that were merged to the legacy code base. It’s a mess. You cry over your half-eaten burrito in shame.

You fool. There was a better way.

The Strangler Pattern

Strangler Pattern is a way of migrating a legacy system incrementally by replacing existing functionalities with new applications and services in a phased approach

Most articles about the strangler pattern consider at migrating backend services but the same principle can easily be applied to front-end related migrations like the one mentioned above.

Rather than porting over all widgets at once, a safer strategy would be to have 2 separate libraries for the widgets: one for the legacy widgets and another for the ReactJS components. Once a widget was ported to use React, it would replace its legacy sibling. The legacy and new widgets would live in tandem, with the new widgets slowly becoming the dominant species in the code ecosystem.

An additional safety net might include using feature flags to toggle between the old and new widgets. Feature flags are decision points in code that determine whether or not invoke certain logic/UI display and are often controlled via a 3rd party app like split.io. If an unexpected feature cropped up in the new widget 😉, a simple flip of the feature flag would display the old, reliable widget.

Its Not Always About Writing Code

As software engineers, a large portion of our job involves writing code, but sometimes what we really need are patterns for common issues that are code-related but don’t necessarily involve writing code. Migrations are such a common issue that software teams encounter that it’s worth exploring different strategies to perform them and saving potentially months of headache by having a clear path forward.