# Make Release Day Less Stressful

---

Make Release Day Less Stressful

Using a script to verify the changes in your release branches

It’s release day at Vincent’s company! In just a few minutes all the new code for their different applications will be released into the wild. His team is feeling confident about a particular feature and hoping things go smoothly. After the site goes live Vince immediately receives a Pager Duty alert. Ruh roh.

It appears an API is returning 500s when processing customer credit cards. A quick investigation into the issue reveals the root cause: a simple property name mismatch. The API is expecting an object with a property named creditCard while the front end is passing the now deprecated credit_card property.

Wait! This was part of a small change that should have been deployed, he remembers. Vince digs through the commit history for the release branch and realizes that change was never added though their JIRA board has it marked as DONE. A simple mistake but he wonders how this could have been avoided. Especially when he’s on Pager Duty rotation.

On Clorox’s Direct to Consumer Engineering Team we release on a weekly schedule and use release prefixed branches which we promote to production after some thorough testing in a production-like environment. This additional step likely would have saved Vince’s team from that embarrassing alert. Once these release branches have been deemed as safe and working in production, we will merge them to their respective master branches.

As an additional sanity check we run a small script that confirms that what we expect to be in our release branches is in fact there. We don’t want to be in a situation like Vincent.

The script above checks our current release branch against master for each project and give us an output of the stories that are not yet found in master. For the script to work we check for the existence of a particular commit message pattern — in our case the name of the ticket that was worked on (e.g. STORY-1234 ), though your company may have other unique identifiers to determine this.

While this script is written to work with BitBucket it can easily be used for Git with a few tweaks and following the same logic.

Of course no automated check such as this is a replacement for developers remembering to merge their tickets but it does offer a nice simple way (with no dependencies might I add 😉) to add another layer of confidence when you plan on releasing.

Make Release Day Less Stressful

Using a script to verify the changes in your release branches

It’s release day at Vincent’s company! In just a few minutes all the new code for their different applications will be released into the wild. His team is feeling confident about a particular feature and hoping things go smoothly. After the site goes live Vince immediately receives a Pager Duty alert. Ruh roh.

It appears an API is returning 500s when processing customer credit cards. A quick investigation into the issue reveals the root cause: a simple property name mismatch. The API is expecting an object with a property named creditCard while the front end is passing the now deprecated credit_card property.

Wait! This was part of a small change that should have been deployed, he remembers. Vince digs through the commit history for the release branch and realizes that change was never added though their JIRA board has it marked as DONE. A simple mistake but he wonders how this could have been avoided. Especially when he’s on Pager Duty rotation.

On Clorox’s Direct to Consumer Engineering Team we release on a weekly schedule and use release prefixed branches which we promote to production after some thorough testing in a production-like environment. This additional step likely would have saved Vince’s team from that embarrassing alert. Once these release branches have been deemed as safe and working in production, we will merge them to their respective master branches.

As an additional sanity check we run a small script that confirms that what we expect to be in our release branches is in fact there. We don’t want to be in a situation like Vincent.

The script above checks our current release branch against master for each project and give us an output of the stories that are not yet found in master. For the script to work we check for the existence of a particular commit message pattern — in our case the name of the ticket that was worked on (e.g. STORY-1234 ), though your company may have other unique identifiers to determine this.

While this script is written to work with BitBucket it can easily be used for Git with a few tweaks and following the same logic.

Of course no automated check such as this is a replacement for developers remembering to merge their tickets but it does offer a nice simple way (with no dependencies might I add 😉) to add another layer of confidence when you plan on releasing.