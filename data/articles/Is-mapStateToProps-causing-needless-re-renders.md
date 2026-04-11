# Is mapStateToProps causing needless re-renders?

---

Is mapStateToProps causing needless re-renders?

If you are a React developer working on a less than trivial project, you are likely using Redux for state management. In a crude nutshell, your connected components are all listening for any updates to the store, the global state of the app, and your mapStateToProps function takes some slice of this state and returns it as props to your connected component.

I was recently working on a strange bug at work involving a redux-connected component: a user would hover over a slice of our pie chart component and sometimes the label in the center of the pie would just revert back to the default label… hmmm. For some reason, our pie chart was re-rendering even though it’s state had not updated. Double hmmm…

This intermittent bug was difficult to reproduce, but once it was sharing the store with a widget consuming realtime socket updates, I noticed it happened each time our store received a realtime update.

Should a component re-render each time the store receives an update — even if it’s not interested in that particular slice of the state? Nah, that can’t be right. Then how does our mapStateToProps function understand when it should trigger a re-render? Well, under the hood, redux does a shallow comparison of the state returned from mapStateToProps by implementing the shouldComponentUpdate method. Interesting. Still doesn’t quite explain why our pie is freaking out though.

Here’s a simplified version of our pie chart code:

Well, it turns out we were making an honest mistake in our mapStateToProps function, which was copying state using the spread ... operator. D’oh. Common array operations like slice, concat, filter or ... create a new reference to an object or array which will trigger a component update when redux internally compares the old and new state.

The quick fix here was to simply assign our state like this:

If your use case is more complicated and there is some filtering or selecting of a part of the state tree you care about, you may want to check out memoized selector functions to prevent expensive comparisons and needless re-renders: https://redux.js.org/recipes/computing-derived-data#creating-a-memoized-selector

JavaScript In Plain English

Enjoyed this article? If so, get more similar content by subscribing to our YouTube channel!

Is mapStateToProps causing needless re-renders?

If you are a React developer working on a less than trivial project, you are likely using Redux for state management. In a crude nutshell, your connected components are all listening for any updates to the store, the global state of the app, and your mapStateToProps function takes some slice of this state and returns it as props to your connected component.

I was recently working on a strange bug at work involving a redux-connected component: a user would hover over a slice of our pie chart component and sometimes the label in the center of the pie would just revert back to the default label… hmmm. For some reason, our pie chart was re-rendering even though it’s state had not updated. Double hmmm…

This intermittent bug was difficult to reproduce, but once it was sharing the store with a widget consuming realtime socket updates, I noticed it happened each time our store received a realtime update.

Should a component re-render each time the store receives an update — even if it’s not interested in that particular slice of the state? Nah, that can’t be right. Then how does our mapStateToProps function understand when it should trigger a re-render? Well, under the hood, redux does a shallow comparison of the state returned from mapStateToProps by implementing the shouldComponentUpdate method. Interesting. Still doesn’t quite explain why our pie is freaking out though.

Here’s a simplified version of our pie chart code:

Well, it turns out we were making an honest mistake in our mapStateToProps function, which was copying state using the spread ... operator. D’oh. Common array operations like slice, concat, filter or ... create a new reference to an object or array which will trigger a component update when redux internally compares the old and new state.

The quick fix here was to simply assign our state like this:

If your use case is more complicated and there is some filtering or selecting of a part of the state tree you care about, you may want to check out memoized selector functions to prevent expensive comparisons and needless re-renders: https://redux.js.org/recipes/computing-derived-data#creating-a-memoized-selector

JavaScript In Plain English

Enjoyed this article? If so, get more similar content by subscribing to our YouTube channel!