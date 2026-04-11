# AI for JavaScript Developers: What You Actually Need to Know

---

AI for JavaScript Developers: What You Actually Need to Know

If I read one more article about how AI is taking developer jobs or hear another baby-faced CEO tell us that we’re just 6 months away from some groundbreaking AI that will alter the trajectory of humanity, I’m going to pull out the 3 strands of hair left on my head.

I started using AI at work and let me tell you — this might be the most fun I’ve had in my coding career so far.

Instead of scaring you for clicks, I want to share exactly what I’m learning, building and reading to understand large language models beneath the surface.

Since I’ve added these skills to my tool belt (and LinkedIn profile), I’ve been getting significantly more interview requests.

Unfortunately, most developers are on the wrong side of this new digital divide.

Stop thinking like the normies

Your mom, aunt and the news are telling you that tech is the wrong place to be.

My non-coding friends have asked me if I’m “nervous” about AI taking my job because the lizard king and a MAGA UFC announcer talked about it on a podcast.

Meanwhile, they do jobs that boil down to answering emails, adding data to spreadsheets and sitting in pointless meetings.

Who’s going to tell them?

No one knows the future.

If devs are screwed then most of us are screwed

AI is moving past the hype cycle and into boring, useful territory

The demand for developers who know gen-AI is rising

If you think LLMs are a 1 to 1 replacement for developers, I’d like to sell you a popular website domain localhost:3000

I started off 2025 knowing jack sh*t about LLMs besides how to ask Chat-GPT questions.

Since then, I’ve built a multi-agent app for work, learned some linear algebra to understand how LLMs work at a basic level and started using a new tech stack for working with these LLMS.

If you’re a JavaScript developer you’re probably familiar with many of the new libraries already out there.

Here’s how I’m learning, step by step:

Step 1: There will be math

LLMs for dummies:

Text is broken down into embeddings (think an array of numbers)

These embeddings or vectors are used to find similar vectors in an AI model trained on the entire internet

Those vectors are decoded into words

You copy and paste those words

I left out some very important steps — like attention mechanisms and transformers but this should give you a mental foothold.

You may notice there are a lot of numbers in this flow.

In order to have a very basic idea of how words are number-ified into vectors and how these numbers are then used to find other number-ified words in a high dimensional space, then you should study linear algebra.

Here us the best resource I’ve found:

3Blue1Brown’s Linear Algebra series.

That’s it.

No long ass course on machine learning or doing lots of calculations by hand.

Learn about cosine similarity, matrix multiplication and dot product.

This will help you develop an intuition for embeddings, vectors and set you up nicely for step 2.

Step 2: Vector Databases

Vector databases have become the unofficial choice for the AI era and RAG applications, yet most of us have never worked with them.

RAG — Retrieval Augmented Generation. Basically feeding an LLM some specific data along with a user’s request so it can give a much more detailed response. Imagine if you asked ChatGPT to fix your diet and it had access to all the information about the food you’ve logged in some other app — that’s RAG.

Remember 10 sentences ago we were talking about words being encoded into numbers?

Haven’t lost you yet have I?

Good.

Vector databases can store text and the vectorized value of that text which can then be searched with a query that is (you guessed it) vectorized. Using math (cosine similarity or euclidean distance) it will return similar vectors.

Numbers!

A not-so-practical use case could be scraping the web for articles on cooking recipes.

A liberal from the coast writes a query like:

“Best doughnut recipe using gluten-free, non-GMO, fair trade, sustainable practices”

This query is then vectorized and used to search for other vectors within the database that are similar based on cosine similarity or euclidean distance.

Out of the top 6 articles returned, you can refine them further with re-ranking and then finally feed those ranked results to an LLM to provide a recipe to our hippy user.

To get started with vector databases, try out Pinecone.io, one of the most popular choices. Pinecone has a free tier where you can begin uploading and vectorizing data to be used in your AI-powered application.

Step 3: Typescript Party

If you’re still reading this, I’ve made some assumptions about you:

You probably know and use JavaScript/Typescript.

You’re above average intelligence

You look good. JS developers are the most attractive developers in software

I know everyone is in a rush to learn Python.

It’s a great language.

Before you do, consider that a significant percentage of companies plan to use AI with RAG.

When I think of RAG-based apps, I think of web interfaces that interact with an API that can retrieve data that is relevant to a user’s query then feed that to an LLM like OpenAI and give the user back a highly customized response.

In fact, that’s exactly what I’m building at work.

As the world adopts AI and we slowly move from saying “Just Google it” to “Just ChatGPT it” — our user interfaces are barely keeping up.

Users expect streaming and dynamic components that reflect the data being shown (like charts, pictures and tables).

If you’re using ReactJS and NextJS you can already start leveraging streaming in your full stack applications with Vercel’s AI SDK, OpenAI’s streaming capability and experimental component streaming in NextJS.

Here’s a great project for you to get your hands dirty:

Scrape the web for articles on a certain subject that you find interesting or that are from a particular author you like.

Upload this data into Pinecone by vectorizing it.

Create an API that accepts an article or post written from a user and then looks up similar articles in Pinecone.

Use the results from Pinecone in a prompt to OpenAI to re-write the user’s post with those examples.

Create a UI with NextJS and ReactJS to support streaming and send a request to your endpoint that then streams the response back to the user.

Create a nightly job to keep searching for more articles to upload into your database to give better responses to your users. Maybe allow them to specify an author or use their own data for training.

Congratulations — you’ve now done more with AI than 99% of full stack software developers.

For further reading, consider:

LLM Engineer’s Handbook

Building a Large Language Model (from scratch)

Also, I’ll be working with 20 developers in a 30 day style cohort to up-skill with AI. Apply here: https://www.parsity.io/ai-developer

AI for JavaScript Developers: What You Actually Need to Know

If I read one more article about how AI is taking developer jobs or hear another baby-faced CEO tell us that we’re just 6 months away from some groundbreaking AI that will alter the trajectory of humanity, I’m going to pull out the 3 strands of hair left on my head.

I started using AI at work and let me tell you — this might be the most fun I’ve had in my coding career so far.

Instead of scaring you for clicks, I want to share exactly what I’m learning, building and reading to understand large language models beneath the surface.

Since I’ve added these skills to my tool belt (and LinkedIn profile), I’ve been getting significantly more interview requests.

Unfortunately, most developers are on the wrong side of this new digital divide.

Stop thinking like the normies

Your mom, aunt and the news are telling you that tech is the wrong place to be.

My non-coding friends have asked me if I’m “nervous” about AI taking my job because the lizard king and a MAGA UFC announcer talked about it on a podcast.

Meanwhile, they do jobs that boil down to answering emails, adding data to spreadsheets and sitting in pointless meetings.

Who’s going to tell them?

No one knows the future.

If devs are screwed then most of us are screwed

AI is moving past the hype cycle and into boring, useful territory

The demand for developers who know gen-AI is rising

If you think LLMs are a 1 to 1 replacement for developers, I’d like to sell you a popular website domain localhost:3000

I started off 2025 knowing jack sh*t about LLMs besides how to ask Chat-GPT questions.

Since then, I’ve built a multi-agent app for work, learned some linear algebra to understand how LLMs work at a basic level and started using a new tech stack for working with these LLMS.

If you’re a JavaScript developer you’re probably familiar with many of the new libraries already out there.

Here’s how I’m learning, step by step:

Step 1: There will be math

LLMs for dummies:

Text is broken down into embeddings (think an array of numbers)

These embeddings or vectors are used to find similar vectors in an AI model trained on the entire internet

Those vectors are decoded into words

You copy and paste those words

I left out some very important steps — like attention mechanisms and transformers but this should give you a mental foothold.

You may notice there are a lot of numbers in this flow.

In order to have a very basic idea of how words are number-ified into vectors and how these numbers are then used to find other number-ified words in a high dimensional space, then you should study linear algebra.

Here us the best resource I’ve found:

3Blue1Brown’s Linear Algebra series.

That’s it.

No long ass course on machine learning or doing lots of calculations by hand.

Learn about cosine similarity, matrix multiplication and dot product.

This will help you develop an intuition for embeddings, vectors and set you up nicely for step 2.

Step 2: Vector Databases

Vector databases have become the unofficial choice for the AI era and RAG applications, yet most of us have never worked with them.

RAG — Retrieval Augmented Generation. Basically feeding an LLM some specific data along with a user’s request so it can give a much more detailed response. Imagine if you asked ChatGPT to fix your diet and it had access to all the information about the food you’ve logged in some other app — that’s RAG.

Remember 10 sentences ago we were talking about words being encoded into numbers?

Haven’t lost you yet have I?

Good.

Vector databases can store text and the vectorized value of that text which can then be searched with a query that is (you guessed it) vectorized. Using math (cosine similarity or euclidean distance) it will return similar vectors.

Numbers!

A not-so-practical use case could be scraping the web for articles on cooking recipes.

A liberal from the coast writes a query like:

“Best doughnut recipe using gluten-free, non-GMO, fair trade, sustainable practices”

This query is then vectorized and used to search for other vectors within the database that are similar based on cosine similarity or euclidean distance.

Out of the top 6 articles returned, you can refine them further with re-ranking and then finally feed those ranked results to an LLM to provide a recipe to our hippy user.

To get started with vector databases, try out Pinecone.io, one of the most popular choices. Pinecone has a free tier where you can begin uploading and vectorizing data to be used in your AI-powered application.

Step 3: Typescript Party

If you’re still reading this, I’ve made some assumptions about you:

You probably know and use JavaScript/Typescript.

You’re above average intelligence

You look good. JS developers are the most attractive developers in software

I know everyone is in a rush to learn Python.

It’s a great language.

Before you do, consider that a significant percentage of companies plan to use AI with RAG.

When I think of RAG-based apps, I think of web interfaces that interact with an API that can retrieve data that is relevant to a user’s query then feed that to an LLM like OpenAI and give the user back a highly customized response.

In fact, that’s exactly what I’m building at work.

As the world adopts AI and we slowly move from saying “Just Google it” to “Just ChatGPT it” — our user interfaces are barely keeping up.

Users expect streaming and dynamic components that reflect the data being shown (like charts, pictures and tables).

If you’re using ReactJS and NextJS you can already start leveraging streaming in your full stack applications with Vercel’s AI SDK, OpenAI’s streaming capability and experimental component streaming in NextJS.

Here’s a great project for you to get your hands dirty:

Scrape the web for articles on a certain subject that you find interesting or that are from a particular author you like.

Upload this data into Pinecone by vectorizing it.

Create an API that accepts an article or post written from a user and then looks up similar articles in Pinecone.

Use the results from Pinecone in a prompt to OpenAI to re-write the user’s post with those examples.

Create a UI with NextJS and ReactJS to support streaming and send a request to your endpoint that then streams the response back to the user.

Create a nightly job to keep searching for more articles to upload into your database to give better responses to your users. Maybe allow them to specify an author or use their own data for training.

Congratulations — you’ve now done more with AI than 99% of full stack software developers.

For further reading, consider:

LLM Engineer’s Handbook

Building a Large Language Model (from scratch)

Also, I’ll be working with 20 developers in a 30 day style cohort to up-skill with AI. Apply here: https://www.parsity.io/ai-developer