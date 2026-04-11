# The Art of the Chart

---

The Art of the Chart

Charts are an excellent way to synthesize and highlight information, making them useful for both data nerds and your casual reader. With the spread of Covid-19, we’re being inundated with charts trying to make sense of all the dynamic data surrounding this epidemic — from unemployment to comparing the rise and decline of infections between countries, counties and neighborhoods. The New York Times may have offered us the most compelling chart thus far on their March 27th issue:

That small bar at the end of the chart tells a story, using no words. This single chart on this page will likely be an iconic reference to this period that we will see in future history books.

As a full stack Javascript developer at a company that analyzes massive amounts of media, I’ve worked with lots of charts and JS charting libraries and they are not all created equally. Creating beautiful, scalable charts can be a difficult process and depending on your needs, you may be limited to certain libraries. Over the past year, our team has worked with three different charting packages with varying degrees of success and productivity.

Victory Charts

Ahh, my first love… and kinda hate. My introduction to charting in Javascript began with Victory Charts and with no real frame of reference, I assumed this was the standard for charts and accepted my fate to work with Victory Charts for the foreseeable future.

The biggest hurdle I encountered with using Victory is that there isn’t a large community of users compared to a library like HighCharts so you’re a bit on your own when it comes to implementing custom interactions and designs.

Victory offers a lot of primitive chart components that you can compose into charts, which offers a high level of customization but also forces you as a developer to take into account and then maintain all these components, which results in some fairly verbose code and a lot logic for implementing things like a time series axis or spacing between columns in a bar chart (a situation our team found ourselves in that led to a fair amount of headaches).

Here’s an example of a simple column chart using Victory:

HighCharts

If Victory is the boutique shop of the JS chart world, then HighCharts is McDonald’s. When it comes to scouring the internet to find examples of creating charts using JavaScript, you’ll find more examples using HighCharts than any other framework.

It’s ubiquity isn’t its only selling point, however to me that definitely gives it an advantage if you’re not a developer that’s well versed in data visualization. HighCharts takes a lot of the cognitive load off the developer and take care of things like time axes, tooltips and general styling for you… or much of it anyways.

A cursory comparison of some code our team wrote for the same chart using Victory vs HighCharts ended up reducing the lines of code by about half!

Here’s how simple it is to begin using HighCharts with a UI library like React (compare this with the example above):

D3

If you’re looking for complete customization and advanced use cases or non-typical charts then D3 will likely be your first choice in JS charts. The learning curve here is easily the steepest of all 3 as the D3 syntax can be a bit daunting.

D3 interacts with the DOM by binding nodes with data using D3 transformations (D3 stands for Data Driven Documents). As a front end dev, some of D3 is quickly approachable, like the concept of selecting and appending elements to the DOM but figuring out how to create a chart with a legend, axes and responsive sizing is a non-trivial undertaking.

I’m currently using D3 to create a Ridgeline Chart because no other library quite suited our team’s use case. If your team doesn’t want to be tied to a particular framework to do the heavy lifting or wants a very high level of customization, then D3 is probably the best choice.

Luckily, there are a ton of examples using D3 so you can begin your journey by copy-pasting bits of code to create a basic chart and add on from there. Because you are directly manipulating the DOM and depending on D3 mostly for the kind of transformations you are doing to your data, the sky is the limit as far as what kind of chart you can make while using a library like HighCharts constrains you to the limits of the library.

Your Turn

Whether or not you are currently using a charting library, any one of these 3 mentioned above is worth learning a bit, especially HighCharts and D3 as they are so widely used. Instead of creating another ToDo list app or a Rails MVC, a small dynamic chart project can really show your value as a developer and really standout on a portfolio.

The Art of the Chart

Charts are an excellent way to synthesize and highlight information, making them useful for both data nerds and your casual reader. With the spread of Covid-19, we’re being inundated with charts trying to make sense of all the dynamic data surrounding this epidemic — from unemployment to comparing the rise and decline of infections between countries, counties and neighborhoods. The New York Times may have offered us the most compelling chart thus far on their March 27th issue:

That small bar at the end of the chart tells a story, using no words. This single chart on this page will likely be an iconic reference to this period that we will see in future history books.

As a full stack Javascript developer at a company that analyzes massive amounts of media, I’ve worked with lots of charts and JS charting libraries and they are not all created equally. Creating beautiful, scalable charts can be a difficult process and depending on your needs, you may be limited to certain libraries. Over the past year, our team has worked with three different charting packages with varying degrees of success and productivity.

Victory Charts

Ahh, my first love… and kinda hate. My introduction to charting in Javascript began with Victory Charts and with no real frame of reference, I assumed this was the standard for charts and accepted my fate to work with Victory Charts for the foreseeable future.

The biggest hurdle I encountered with using Victory is that there isn’t a large community of users compared to a library like HighCharts so you’re a bit on your own when it comes to implementing custom interactions and designs.

Victory offers a lot of primitive chart components that you can compose into charts, which offers a high level of customization but also forces you as a developer to take into account and then maintain all these components, which results in some fairly verbose code and a lot logic for implementing things like a time series axis or spacing between columns in a bar chart (a situation our team found ourselves in that led to a fair amount of headaches).

Here’s an example of a simple column chart using Victory:

HighCharts

If Victory is the boutique shop of the JS chart world, then HighCharts is McDonald’s. When it comes to scouring the internet to find examples of creating charts using JavaScript, you’ll find more examples using HighCharts than any other framework.

It’s ubiquity isn’t its only selling point, however to me that definitely gives it an advantage if you’re not a developer that’s well versed in data visualization. HighCharts takes a lot of the cognitive load off the developer and take care of things like time axes, tooltips and general styling for you… or much of it anyways.

A cursory comparison of some code our team wrote for the same chart using Victory vs HighCharts ended up reducing the lines of code by about half!

Here’s how simple it is to begin using HighCharts with a UI library like React (compare this with the example above):

D3

If you’re looking for complete customization and advanced use cases or non-typical charts then D3 will likely be your first choice in JS charts. The learning curve here is easily the steepest of all 3 as the D3 syntax can be a bit daunting.

D3 interacts with the DOM by binding nodes with data using D3 transformations (D3 stands for Data Driven Documents). As a front end dev, some of D3 is quickly approachable, like the concept of selecting and appending elements to the DOM but figuring out how to create a chart with a legend, axes and responsive sizing is a non-trivial undertaking.

I’m currently using D3 to create a Ridgeline Chart because no other library quite suited our team’s use case. If your team doesn’t want to be tied to a particular framework to do the heavy lifting or wants a very high level of customization, then D3 is probably the best choice.

Luckily, there are a ton of examples using D3 so you can begin your journey by copy-pasting bits of code to create a basic chart and add on from there. Because you are directly manipulating the DOM and depending on D3 mostly for the kind of transformations you are doing to your data, the sky is the limit as far as what kind of chart you can make while using a library like HighCharts constrains you to the limits of the library.

Your Turn

Whether or not you are currently using a charting library, any one of these 3 mentioned above is worth learning a bit, especially HighCharts and D3 as they are so widely used. Instead of creating another ToDo list app or a Rails MVC, a small dynamic chart project can really show your value as a developer and really standout on a portfolio.