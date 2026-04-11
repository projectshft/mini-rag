# NPM Library Versioning Strategy for Hot Fixes

---

NPM Library Versioning Strategy for Hot Fixes

Ahh, your NPM package is finally live. You’ve published your library to the NPM registry for your tens of adoring fans (or maybe just you) to consume. You’ve been careful to exclude extraneous dependencies from the build and fiddled with webpack for hours to create a truly optimized build. But what about versioning?

Typically a minor version upgrade, from v1.1.0 to 1.2.0 introduces a non-breaking change like a small feature. A major upgrade, from v1.2.0 to v2.0.0, is usually reserved for breaking changes or non backwards-compatible changes. That leaves bugs, which can be resolved with patch upgrades.

This all sounds simple and straightforward enough, except when it isn’t. Developers often work asynchronously so there is a high chance that a library used as a dependency in another app will be a version or 2 behind the most recent version of the library currently being developed. This can lead to very confusing versioning obstacles when issues arise in production and need a hot-fix.

Let’s look at this scenario: Your company’s Burrito Finder App is using v1.2.0 of the Tinfoil library. Bob has recently wrapped up a ticket and published a new version of Tinfoil, which is now at 1.3.0. Bob’s changes aren’t breaking but they haven’t been fully tested by QA. Sarah is on-call and her phone just buzzed alerting here that a small bug in Tinfoil is not allowing users to click on the Burrito Icon! Rats!

Sarah looks at Tinfoil and sees the library is currently v.1.3.0 but the production version is at v1.2.0. Bob alerts her that the changes in v1.3.0 are not quite ready for a production release. Luckily Sarah and her team have reserved patch updates for this very reason.

Sarah simply checks out the library at the version currently in production git checkout tags/v1.2.0 and makes a fix. Now she only needs to publish a patch version v1.2.1. This fix can now be safely deployed to production without bringing unvetted changes from the most current version.

TLDR — use patch versions for hot-fixes. In the chart above, we check out our library at problematic version, apply a fix and release a patch. The patch then gets merged to our most current version of the library and a minor release is published, though 1.3.0 could potentially be re-published with the fix as well.

Opinions about versioning and git strategies are like elbows; everyone has a couple… or something like that. This strategy is one of a few I’ve seen and used that’s saved a team from complicated fixes to production issues.

NPM Library Versioning Strategy for Hot Fixes

Ahh, your NPM package is finally live. You’ve published your library to the NPM registry for your tens of adoring fans (or maybe just you) to consume. You’ve been careful to exclude extraneous dependencies from the build and fiddled with webpack for hours to create a truly optimized build. But what about versioning?

Typically a minor version upgrade, from v1.1.0 to 1.2.0 introduces a non-breaking change like a small feature. A major upgrade, from v1.2.0 to v2.0.0, is usually reserved for breaking changes or non backwards-compatible changes. That leaves bugs, which can be resolved with patch upgrades.

This all sounds simple and straightforward enough, except when it isn’t. Developers often work asynchronously so there is a high chance that a library used as a dependency in another app will be a version or 2 behind the most recent version of the library currently being developed. This can lead to very confusing versioning obstacles when issues arise in production and need a hot-fix.

Let’s look at this scenario: Your company’s Burrito Finder App is using v1.2.0 of the Tinfoil library. Bob has recently wrapped up a ticket and published a new version of Tinfoil, which is now at 1.3.0. Bob’s changes aren’t breaking but they haven’t been fully tested by QA. Sarah is on-call and her phone just buzzed alerting here that a small bug in Tinfoil is not allowing users to click on the Burrito Icon! Rats!

Sarah looks at Tinfoil and sees the library is currently v.1.3.0 but the production version is at v1.2.0. Bob alerts her that the changes in v1.3.0 are not quite ready for a production release. Luckily Sarah and her team have reserved patch updates for this very reason.

Sarah simply checks out the library at the version currently in production git checkout tags/v1.2.0 and makes a fix. Now she only needs to publish a patch version v1.2.1. This fix can now be safely deployed to production without bringing unvetted changes from the most current version.

TLDR — use patch versions for hot-fixes. In the chart above, we check out our library at problematic version, apply a fix and release a patch. The patch then gets merged to our most current version of the library and a minor release is published, though 1.3.0 could potentially be re-published with the fix as well.

Opinions about versioning and git strategies are like elbows; everyone has a couple… or something like that. This strategy is one of a few I’ve seen and used that’s saved a team from complicated fixes to production issues.