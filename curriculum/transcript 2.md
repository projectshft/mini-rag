# RAG: Practical Retrieval Augmented Generation

[00:00:00]

## INTRO

What is retrieval augmented generation over this course? In the project you're gonna build, you're gonna learn a ton about how to practically build a rag based application. Work with large language models, type script, next JS streaming text to the front end. We're gonna build something really, really cool.

But before we dive into all that, we need to build up an intuition for what is rag. Why is it used a little bit of the math behind it. So then we can build with a very, very strong foundation. So first of all, what is rag? Right? RAG stands for Retrieval Augmented Generation. Is that helpful to know? I don't know.

Let's look at an actual use case that shows us why RAG is become such a popular and practical use case for ai. That most Fortune five hundreds and larger companies are already adopting beyond just learning how to prompt better and better and better. This is the actual use case that most companies are seeing

that is making sense for them to adopt. So let's look at how DoorDash is using RAG in a very, very high level kind of contrived case [00:01:00] here. So imagine this, you're a driver on the road and you're delivering ice cream to somebody on a really hot day, and it melts. And you get to their house, and then you're like, well, what do I do now?

Do I just deliver the frozen ice cream that's all melted and just leave a mess on their porch? Or do I, you know, give 'em a refund? Or I have to call 'em, or whatever. And so DoorDash is thinking, Hmm, well, they could either call us and we could get inundated and flooded with calls all day about this kind of stuff.

Or what if somebody could type this, kind of query this question into our app, and then we could find the relevant documents that they would need to make a decision about what to do next. Wouldn't that be cool if we could summarize all that information and give it to them back immediately?

Now, if you ask this question in chat, GPT, well it's limited from its base of knowledge, which may have been updated a year ago, may have been updated six months ago, but it certainly doesn't have access to door dash's internal documents, which are also likely changing ,

throughout different regions states, the world daily based on [00:02:00] legal cases that they're likely involved in. So this has to be really up to date information. And it can't just be guest, large language models will hallucinate basically, they're incentivized to give you an answer no matter what.

That doesn't work so well when you have people that are in the medical field, the law field, or even a DoorDash driver, trying to figure out what to do with melted ice cream. So what we can do.

Is feed relevant information to a large language model so that it can give us a response that summarizes information that is particular to what we're asking. Basically, it gives us some very, very specific context. So when a person types this in, what will often happen is we'll take this query and we'll look in what's called a vector database, find the relevant documents.

And we'll take the five or 10 most relevant documents. We'll feed those to a large language model, whether it's open ai, whether it's grok, whether it's whatever, and it gives us that context and that. Confidence that what it's giving back to us actually makes sense and is relevant to what we need to know.[00:03:00]

So now a DoorDash driver can ask this and they can get back information that is up to date based on the company policy and say, in this case, Chuck, you shouldn't actually deliver it to their house. You should give 'em a refund and tell them that you'll be back in 20, 30 minutes and we will cover the cost of this at no cost to you.

Don't worry about it. And they're like, great, now I know exactly what to do. So that is a use case for rag. Let's look at one other use case so we can build up a little bit of an intuition for why RAG is useful and then we'll jump into more of the foundational stuff so then you can start actually learning how to code and build your own rag application.

This next use case is probably something you're familiar with yourself. Have you ever wanted to watch a movie on a Friday or Saturday night? Maybe with your kids or your wife or husband or whoever, right? And you're sitting there and you just wanna watch a movie that kind of fits a few criteria.

Like, I wanna watch a movie about. Aliens that was made in the seventies or whatever. I wanna watch a movie that's not too scary. That's PG 13 that was made in the last 10 years. You can't do that as we stand right now, right? [00:04:00] You have to literally type in the name of the movie you wanna see. So when you have something like retrieval, augmented generation running in the background.

You can take these queries, these searches that are kind of fuzzy, basically take the meaning of them and then search up movies that match some of that meaning.

So it can look at basically the intention of what you wanna search for and return you movies that match that intention. It's called a semantic search. Basically searching by meaning or feeling rather than exact keywords. So you may get returned a few movies rather than one. If you type in aliens, they'll likely return you all the movies that literally have aliens in the title.

If you type, I wanna watch a movie about. Extra terrestrials that was made in the seventies. It would return you maybe the top five, 10, whatever movies that match the feeling, that semantic search you're doing. That's really, really useful. Spotify actually introduced this kind of search so people could do exactly this.

So RAG is a really popular, [00:05:00] fairly boring use case that doesn't get talked about enough, but is what companies are investing in and actually using right now. So the money is not just in building AI models because we already have really good AI models. The money isn't doing this kind of stuff, which is exactly why we're gonna dive in and learn how to build apps that leverage rag and build our own retrieval augmented generation system, including a data pipeline and a way to access it on the front end.

Let's dive in.

## Turning Words to Numbers

we're gonna learn a bit about how most rag apps work under the hood, and it really involves turning words to numbers and numbers to words at a really high level. That's basically what you're doing in a rag based application. So there are two steps to most rag apps. You like some internal knowledge document, and you'll vectorize that.

You'll turn it into a series of numbers, and the way we turn it into numbers is really, really important. We're gonna turn it into something called embeddings or vectors. Here's an example of how embeddings might look. [00:06:00] We'll take words in a document or maybe a really large document, and we'll turn that document into a series of vectors.

These vectors may have 512 dimensions, 1,536 dimensions, or more or less, right, depending on the size of the document. We'll take these. Letters, or words, or sentences, paragraphs, and we'll turn them into vectors, a series of numbers that encode meaning. Now, the way that this is done is beyond the scope of this particular course, but this is done using usually proprietary algorithms.

And we basically use these models to encode the meaning of these words, phrases, paragraphs, pieces of text, so that they can be stored in a vector database, which we'll get to in just a second. If you have a really large document, by the way, you won't just store that as one embedding. That wouldn't be one large array of numbers. That will be a series of array of numbers.

So you may have a document that is chunked or broken up into multiple vectors, and then you'll put these vectors [00:07:00] into a high dimensional space. Here's a very, very rudimentary and. Simplified version of how this may work. And we're gonna go deeper into this so you can build up more intuition because this is really important to understand

a lot about how large language models work at a fundamental level and how rag based applications work as well. So you take a word like woman or man, and we will take those vectors, those arrays full of numbers, and they'll basically be plotted out in a high dimensional space.

if this is only 2D, imagine what this looks like where you have maybe 512 numbers

that you're plotting in a high dimensional space. So we have something like, man, this would be a vector woman. This would be a vector. apple would be a vector. King would be a vector. Queen would be a vector. These all are. Words that have this vector relationship, right? They have a vector related to the word, and we see, huh, man and woman are generally going in the same direction.

Kind of like king and queen are going in the same direction. Same things with apple. [00:08:00] Fruit so we can plot these words, this meaning in this high dimensional space. And then we look up other words like maybe we're looking up, boy, where do you think boy would land in this chart?

Would it land around here? And so when we look in vector space. We're not returning the exact thing at that plot or at those coordinates, we are returning things that are closest to those coordinates. So when you're retrieving documents in a high dimensional space or using a vector database, which we're gonna learn about later, you're not just returning.

What is the thing you're looking for? If you look boy in England or something like that. It's not gonna give you exactly something that says, boy in England. It's gonna look at all the documents that kind of relate to that. So if you look up Monarch, you might get King and Queen returned back in your query.

You'll get the top five or 10 documents that are most closely related to what you're looking for.

Now this chart may be even more intuitive because it shows the direction, like are you generally going in the right direction? You can think of words as direction. [00:09:00] These vectors, again, coordinates in a large plot, high dimensional space. I say high dimensional because when you think about things like 1,536.

Coordinates or whatever you can imagine how they would slope around and go all these places this is how large language models are able to capture the meaning, definitions, the feelings, looking at what words make sense and what part of a sentence. There's a lot more that goes on underneath the hood behind this, but this is essentially what we're doing when we're using retrieval, augmented generation, taking words.

Taking text, storing it as numbers in a high dimensional space. Those dimensions capture meaning and will group certain things by meaning in the same general areas. So that way when we wanna retrieve information, we can look and find if our query kind of goes in the same general direction as other documents we have in this high dimensional space.

Don't worry, we're gonna get way deeper into this. And if you do want to go a little deeper into like, wait. How is this working? What are embeddings, [00:10:00] what are vectors? You are gonna be watching three blue, one brown videos. He's a mathematician and can explain this math much better than I would ever attempt to.

and that's gonna honestly give you one of the best foundations for understanding a little bit of the linear algebra behind this. The videos are not long, and they're super, super useful to watch because that's going to give you that strong foundation for understanding Vector math, dot product, co-sign similarity, and we will be doing some exercises based on this as well.

So you're becoming more than just a prompt engineer. We want you to have the actual foundation to speak intelligently about this stuff and not just kind of think it's magic in the cloud somewhere.

And now as a challenge to you, think of some places where you might already be using RAG and just don't know it. What are some applications you use on a daily basis that you think could either really benefit from using retrieval, augmented generation, or maybe already are? Think a little bit about that and then write them down.

Then try to answer some of the questions in the section below, and I'll see you in the next video.

## RAG vs Fine Tuning

When to use RAG versus when [00:11:00] to fine tune a model? I'll be honest, most of the time you should just go for rag. Fine tuning involves training a large language model like OpenAI on a very specific data set, and we are gonna learn how to do this so you can also see some of the pitfalls and why RAG is honestly a better choice.

The CTO at my current company, actually spoke to somebody at Anthropic.

people behind Claude, and even they said that usually fine tuning is something you don't want to do, and I'll explain a little bit why fine tuning means you need to have a very, very large data set. Essentially, you want to change the internal structure. Logic of a large language model, like Open AI's Chat, GPT, for example.

So you'll feed it a ton of information that shows exactly how you want it to respond to certain types of queries. This can help if maybe you're in the medical profession or maybe legal. Basically areas where you really wanna fine tune what the model will say to [00:12:00] try to prevent hallucinations. But even in this case, rag is often a better choice.

Here's the underlying issue. You're not going to train a model better than what OpenAI or Claw or Grok or whatever other team is out there that has billions of dollars in tons of the best engineers in the world at their disposal. The problems with training it on really specific data sets is that it may lose some of its original knowledge.

You may have to update the data sets. You need to have really massive data sets that are well constructed. In order for the fine tuning to make sense, but it can make sense in a few different instances.

If you have really specialized tasks or any really deep domain knowledge, again, like maybe the medical or legal professions, this could be a really good use case. Also, if you have to have it run offline, then using something like fine tuning could actually make sense in that case. That being said, however,

we are going to fine tune open AI's [00:13:00] model with a small training set based on the posts I've written on LinkedIn. And we're gonna see probably some variability in the quality of the responses we get back. And then we're gonna do the same exercise using rag, so you can be the judge and understand what are the trade-offs from doing it.

But in my opinion, as of now, your knee jerk reaction or your default response to somebody bringing up whether to fine tune or use RAG is likely to just use rag.

But you should absolutely make your own decisions. Those are my opinions, and you're gonna see how to do both so you can make an informed choice as we move forward with this. Anyway, read through the use cases and some of the information in this module, and just get a little bit of an intuition for why one might be chosen over the other.

It's not important to have a really strong opinion now, it's just important to know that these two different ways exist

to change a model and make it more specific or useful for very particular

types of work applications, different domains. Businesses, whatever,

and then come up with a couple of your own examples for maybe why you might choose to use one [00:14:00] over the other, depending on the business use case. See in the next section.

## Vectors and Embeddings

We're gonna learn a little bit of math. Please don't panic. So we can understand how vector similarity is determined in databases like vector databases using Pine Cone. Whatever vector databases essentially use some version of this formula under the hood.

This makes things a lot less magical. You don't really need to know this in order to use these databases, but this is some of the fundamental knowledge that I think is important and also kind of interesting, So you not only know how vector databases work, but also large language models. So we've talked a lot about how words get turned into vectors or embeddings As a quick refresher, when you type out a prompt or a query or something like that, or a document that we're gonna store in a vector database, that set of words will get transformed into numbers.

A bunch of numbers. Think of an array full of tons of numbers. Those numbers can denote meaning, definitions, feeling. All sorts of stuff that we really don't have insight into, [00:15:00] but it helps us understand

The meaning slash feeling slash intention of what we are writing. And in order for a computer to understand that, well, we have to turn it into numbers, and then in the vector database you'll type out a query or something and it will look at all the different vectors that are similar to that particular query.

It'll say, oh, you want to know about ice cream or You're trying to find a certain movie or you want to know an answer to a question that sounds kind of like this. So what I'm gonna do is I'm gonna look at all the different vectors that are around that query, embeddings are related to what you typed out?

Well, I'll have to figure out how similar it is to other vectors, and you can do that using a few different methods. But dot product

is one of the most common ways that you'll see to do this.

And you'll even see this explicitly mentioned in certain databases for the method that they use to determine vector similarity. So how does DOT product work? Well, you can take an array like this. We have V one and V two, vector one and vector two,

so you see V two over one, up two, and you'll see V two, [00:16:00] which is over two and up four. These vectors plotted on a chart right here for us, right? How do we determine the similarity of these vectors? We use dot product where you multiply the numbers in one vector by the numbers in the other vector, so it'd be

Plus two times four. If we had more vectors, we would continue doing that same operation across all the numbers in the vector, and then we would add them up and we get a number. The number 10. A larger number means higher correlation. A lower number would mean lower correlation. so you see these are fairly similar and they have high dot product, right?

So the dot product of these vectors is 10, which means, oh, these are likely pretty similar, right? If we look at this one here, one zero, right? So we go one zero for V three, and we look at V four negative one zero. These are going in polar opposite directions, and when that happens, you get an interesting dot product that tells you

these are like the opposite.

And so when you do this one times negative one plus zero [00:17:00] times zero equals negative one, meaning these are going in the opposite direction here. And finally we look at this one V five and V six. We look at V six. This is going up, and V five is going across.

And when we do the dot product of these numbers, you get zero. These are completely unrelated. Meanwhile, the V four and V five ones, these are negative, which means they have like, they actually do have a relationship. One is the opposite of the other. If one is going up and one is going across, it basically means they have no relationship at all.

Like one might be cheeseburger and one might be car, and for example, V five might be cheeseburger and V four might be, I don't know, uh, s cargo or something like that. Like they're both food, but they're completely the opposite of each other. If you can think of cheeseburger and escargot as being completely unrelated, here's where things get really, really interesting.

Because these words are ultimately going to be plotted as numbers. [00:18:00] You can do really interesting and weird mathematical stuff. With embeddings. You could embed a word like cheeseburger and then you could embed a word like S cargo, and then you could subtract those words from each other and figure out

What word would be the result of subtracting those words from each other? In fact, in the videos that are in this particular module that you need to check out that are from three Blue, one Brown, he does stuff like that where you can minus, you know, Hitler, minus Germany, plus Italy gives you something like World War II or something like that.

You can do really, really interesting stuff with this because remember words, numbers, put them on a chart, do dot product, mathematical operations on them, and then you get numbers ultimately that you can then transform back into words.

Now we've looked at dot product as a way to understand the similarity of vectors,

Cosign similarity is another way to measure the similarity of these vectors or documents in this high dimensional space by basically normalizing or not considering the length, but [00:19:00] instead looking at the angle between the two vectors to understand how close are they in similarity.

This is really, really important because when you query this high dimensional space, you could have many, many vectors. Around the embedding that you're using. So when you type out your query and it becomes embedded, and it will look for other vectors that are similar, it's gonna say, okay, what are the top 5, 10, 20, 30, 40, 50 different vectors that are near the embedding that we just plotted?

And then we can return those back to you. So really all we're doing. Is trying to find what are similar vectors using either DOT product, cosign similarity or whatever other mathematical operation these databases may use. But dot product and cosign similarity are the most common ones that you're going to come across when you're exploring vector databases.

now, we're gonna jump into some code fairly soon. But essentially, to create these embeddings, we're gonna use open AI's library to do so. there are other libraries and services to do this, we're gonna use open AI because it's kind of the off the shelf model that people just go for.

It's [00:20:00] kinda like the McDonald's of large language models. So we're gonna use open AI throughout this coursework. I encourage you to explore anything else. Don't get too caught up in the tools. Get more caught up in the ideas of what we're doing. So to create these embeddings, all we're gonna do is use these off the shelf models

That offer these methods that you can easily call in your code to take in some text and then create an embedding. That's it. So you're gonna get an embedding, it's gonna be a bunch of numbers that look like this, and then you're going to add that into your vector database.

And then from there we can look at all the different vectors that may be already in there and determine which one is closest to the embedding that we just created.

before we move on to the next section, go through some of the exercises in this one and just see if you have a little bit of that intuition and can understand or guess which vectors or words slash queries paragraphs, texts sentences would be similar.

In a high dimensional space, which ones do you think would have embeddings that are similar? In the next section, we're gonna go a little deeper [00:21:00] into the mathematical concepts before we really jump into the fundamental coding stuff, because this will give you a much better understanding so things aren't a big, magical black box for you before you move on.

Also, please watch the three blue one Brown series. That are linked in this module. Go through all those videos. I promise you they're short. They're gonna give you a really, really good understanding. I am not a math expert at all, so I think it's really important that you cover those things so you get a better understanding of things like transformers, how those work at a really fundamental level, a little bit deeper into dot product and cosign similarity.

And then you can watch as many or as few videos from that person as you want. I think they're really, really good.

But again, you don't need a really strong mathematical background to use these tools. It just helps us understand what's going on just beneath the surface. See you in the next section.

## Vector Math

so we've gone over dot product and how that can be used to determine the similarity between different vectors. Again, those words plotted as numbers in a high dimensional space. We can visualize that as a graph and these.

Points, these [00:22:00] arrows going in certain directions. In reality, these are simplistic representations and they're really, really complex vectors or these lines in space. 'cause they can have up to 1,536 or 3072 dimensions. It's more than the human mind can really understand. But as long as we understand this basic concept of how do we determine.

Which vectors, which words, which ideas are similar in a high dimensional space. That's gonna help us build our rack system and gather up this intuition. Again, I keep drilling this in because this is what's gonna separate you from somebody that just knows how to use the tools to actually understand a little bit about what's going on under the hood, so you can speak about it intelligently.

There's a couple other ways to determine. Similarity between vectors. These ones are probably not worth going deep into, but the mathematical calculations are there and I don't think it's honestly necessary that you understand them, but it's good to have a high level sense of how to measure these distances.

So there's cosign similarity and Euclidean distance. These are two additional [00:23:00] really common ways to measure the similarity between vectors besides dot product. And we look at what Euclidean distance is. This one is less commonly used in the rag and vector databases we're gonna be using.

But this measures the distance between the tips of the two vectors here. So this would measure the distance between these tips in space, co-sign similarity. Is angle based, basically how much of a distance between the angles of the vectors, not necessarily the length of the vectors.

You are gonna implement your own version of finding the distances between vectors, and you're gonna use cosign similarity to do so. And I'm gonna show you how this factors or relates to using a vector database. So let's say you have a query like this. Hey app, tell me about my goldfish, Henry, and let's say you've stored lots of documents about maybe coding.

we're gonna learn a lot about. Where we're gonna store a bunch of documents and read mes from publicly available and very popular open source [00:24:00] repositories. But let's say a user says something like this, Hey, tell me about my goldfish, Henry.

So if we're querying this high dimensional space, what do you think's gonna happen here? Well, if we're looking at the distances between this query, we're gonna embed this, and then we're going to put this in a high dimensional space as a vector, and then we're gonna look around and say, well. What's close to this vector by cosign, similarity and a visualization.

I'm using quadrant as a visualization tool. This is another vector database out there, a really popular one. The one thing I like about this is it has visualizations of the vectors, so let's pretend that your query ends up somewhere. Around here right now, if you're saying, well, what's closest to this query about Henry the goldfish?

Well, this vector's close. Does this vector have anything to do with it? Maybe, maybe not. This vector's also the closest. Is it close? No, but it's the closest. So your query will be represented as a vector in this space, along with all the other documents. That you've generated [00:25:00] and added into the space, right?

So these are all your documents and a user's query will be represented somewhere in here. And what you're gonna try to do, or rather the vector database is going to do under the hood, is use something like cosign similarity or dot product to determine which vectors are closest in this space to your query.

now, sometimes this can lead to really, really, really bad matches, right? Like you could get a match. It's like, well this is like, you know. Within a distance of it. It's the closest one I could find, but it's not great.

so the vector database will offer return a distance score, which is kind of like how far away is it? And if it's really far away, if it's like 0.1 match or something like that, you know that maybe this isn't a really great response. You can also say, return the top X amount of documents. So maybe you say, I just want the top five that are around this query, maybe the top 25, the top hundred, the top thousand, and you can be getting back

A ton of data to sort through. So this is one of the ways that Vector databases can give us a little bit of insight into the quality of the [00:26:00] documents getting returned.

So you really get some hands-on experience with implementing the same kind of calculation that a vector database will do under the hood. You're first gonna want to clone down this repo mini rag.

You're gonna clone it down to your machine. I'm using yarn to install things. I suggest you do the same thing, but if you want to use NPM, that's fine. I'm not gonna walk through how to just pull down the project and set it up. That's something I feel like you should be able to do at this point. So clone the project.

Use yarn. Use NPM, use whatever. We're gonna get deeper into this project the further we go along. So it's really important that you take the time to get this project onto your machine. Don't worry, it's not gonna be working yet, but I'm gonna show you how to run the tests that are gonna be necessary for you to see if the function you implement is correct.

So in vector dash similarity ts, you're gonna find an example and an exercise. It has the functions for calculating product, for calculating the magnitude of a vector. And finally, for calculating cosign similarity. [00:27:00] We made these for you so you can just use them. Now. What you're gonna do is implement, find top similar documents.

It's gonna take in a query vector, which is a set of numbers.

It's gonna take in documents, which is basically an object that has an id, a title, and an embedding. The embedding, of course, as you know by now, is a bunch of numbers, right? And then it's gonna take in a minimum similarity score. Again, remember when we go back to that chart, we saw all those little dots, all those little coordinates in this dimensional space, we saw that some may be further away or closer to our original query.

In this case, we want a minimum similarity of 0.7. That means there can't be super far away. So if somebody types in something like Henry, the goldfish would probably return zero documents, which actually is probably better than returning something that has nothing to do with Henry, our cute little goldfish.

And then finally, we're gonna return the top. K amount of documents that have matched. So we're only gonna return the top ones. If you have like 20 that match, just gimme the top three, right? And [00:28:00] we're gonna sort those by their similarity score. So the highest similarity documents are gonna be the top three we return.

We could return 10, we could return five. You could return as many as you want to return, but you need to enforce all these different things. So you're gonna do this on your own by calculating the cosign similarity. Filtering out the documents that don't have the correct similarity, and then sort by similarity with the highest being first, and then finally return the top K results.

This is gonna be something that Pine Cone, the vector database that we will be using does under the hood for us. But now you're gonna have a whole lot more intuition and knowledge than the average person that's using these things about how this is actually working and. Finally. we're gonna implement our vector database and start storing documents inside it and get into building a working app with agents coming up soon.

I can't wait for that. So have some fun with this. Check out the solution, but only after you've actually tried to implement this. If you're using AI coding tools, I highly recommend you turn them off so you can at least stretch your brain a little bit, give [00:29:00] your brain a little exercise outside of using AI coding tools and see if you can figure out how to do this on your own, because this is gonna be one of those light bulb moments when you see how Pine Cone does this on our behalf later on in this project.

## Solution

So I'm gonna walk through my solution for find top similar documents and hopefully yours is somewhat similar, no pun intended, or maybe there was. Anyway, what I'm doing is I'm mapping over all the documents and what I wanna see is how much distance is there between this document and the embedding that we've been given this query vector that we've been given, right?

So I'm looking at the cosign similarity. Between the current document and the vector that we've been given, the query, like, you know, where's Henry the goldfish or whatever. Finally, I'm looking at those documents and I'm filtering out the ones that do not pass the threshold for similarity. In this case, it's 0.7 is a default.

It could be 0.3 or 0.2 or whatever, whatever they pass in, whatever the user wants to use, we [00:30:00] determine, Hey, how far away are we? From the threshold that we've been given, and I'm gonna filter out those which don't hit the threshold. If you are a 0.3 similarity, but we have to have 0.7, you're not gonna make it.

Finally, I'm gonna sort those documents by the similarity score, so the highest similarity first. Lowest similarity last. And then finally, we're gonna just return the top X amount of documents that the person wanted to have. So in this case, they said top three, maybe be top five or top 10 or whatever.

This will work no matter what you really pass in. So that's the nice thing. this method can be malleable. It's dynamic. You can pass in, more documents, you can pass in higher similarity score. You can pass in a. Larger top K, and we're going to do our best to return you as many documents as possible.

And if you run this, I do yarn test. This is by the way, in the module, you can just copy this. And I wanna run just this test and I see that all my tests pass. So I've done yarn to install this. I'm using node version 22, and what I'd [00:31:00] like to do is N VM use to use the correct version.

If you see in this project, there's an M-N-V-M-R-C file, which allows me to use the correct version of node. Again, not a big deal. Use whatever you need to use to get this working so you can see if your function actually makes the tests pass. And as we go along and do more coding in here, I want you to really focus on the high level ideas and not so much like the exact things we're doing

With React or Next or Type Script. This is just implementation details. As long as you get the high level idea and can implement this on your own, that's fine. If your tests don't exactly pass like mine, or you having. Problems with your node version or something like that.

Don't worry too much about it. Do your best to follow along and make sure that you actually understand the logic behind the things we're doing. That's way more important than seeing a bunch of green checks on your test, even though you ideally should. And if you have problems, please reach out.

## Word Math Fun

All right. At this point I hope you're a [00:32:00] little tired of hearing me say the word vector and embedding, and that's the whole point. 'cause we're going to move into the actual implementation details to build a full end-to-end rag system and then also use fine tuning. But before we do that, let's have a little bit more fun and really nail home the concept of.

Words as numbers and numbers, kind of back to words. Here's the weird thing about vectors and turning words into numbers or sentences or full paragraphs or large amounts of text into numbers. We encode the meaning. You can't actually translate the numbers back to the word, because what we encapsulate again, is the meaning behind those sentences, paragraphs, whatever.

So it's not like a one-to-one relationship. Exactly. And I hope that is more clear as you do this next exercise.

If you go to Vector word arithmetic, I've done the favor of creating the embeddings for you, right? Because we're gonna need to use open AI and you're going to need to put some money into open [00:33:00] AI's platform. But I didn't want you to do that just yet.

So we're gonna give you a small amount of money to get started with. That should get you through the, the coursework and maybe even beyond five, 10 bucks or whatever the limit is that we decide to give you will be enough to get you f. Fully into all the coursework within reason.

If you abuse it, obviously you're gonna run outta money, but I didn't want you to pay for the embeddings just yet. So what I've done here is I've actually embedded them for you and I've stored them in a cash. And if you go to the cash here, embeddings cash dot js ON, you'll see a massive JSON file and you'll see the words that I've embedded

and they're in 512 dimension size vectors. Really, really long. literally 512 numbers per, word here. As you can see, this is like literally 512, right? Anyway, I've done that for you, so you shouldn't have to use open AI for this, but I wanna show you how this actually works. So we have a couple operations where we will.

Add a vector, subtract vectors, and we'll do co-sign similarity to see which one is [00:34:00] closer and we will get the embedding. So this actually will look in our cash first to see if we have the embeddings in embeddings cash if we have it. Great. So if you want to create your own embeddings, you are gonna need to pay a little bit of money for that.

But don't do that right now. Just use the stuff that we have for you here and you can just see how this works. So what I've done here is I've used OpenAI to call their embeddings method and create embeddings using text. Embedding three small with 512 dimensions, which matches up exactly with what you see in here.

We have 512 dimensions, and I've embedded all this for you. And then we have this. Cool method called Find Closest Word, where we'll get the embedding and we'll find the similarity of other words and see which word is closer. And so we do some cool little arithmetic on these words here and see what happens when you do something like, what is King?

Minus man, plus Woman? And we'll see what it's closest to. Is it closest to Queen? Is it closest to Princess? Closest to Lady Monarch, or Pizza? This is obviously wrong, right? So we should expect to [00:35:00] see lower similarity to things that are just completely wrong. So these are using the embeddings directly from OpenAI, the API, behind chat, GBT.

And we're doing some word math just to really drive home that. Hey, words, numbers, same thing here. This is how a computer, how a large language model understands the words that you give it. Transform them to numbers, and it does a bunch of calculations on those numbers to give you the closest thing in a highly dimensional space and return that thing.

Back to you. It is super, super high, basic level, But this is how Rag works under the hood. When you're looking for lots of documents and we've embedded them all, we're gonna find the top similar ones, just like the method that you just implemented. We have some not suitable for work stuff in here.

Hope you get a kick out of it. And the way that you run this is just to do yarn, exercise, colon word math, and you'll see what happens. You should just go through this. Just see like, what do you think? Make sure you understand what's happening and see if it makes sense to you. That's the most important part, and you could do some of these either by putting some money in open [00:36:00] AI and getting your own open AI key, which we'll do shortly.

But you can think, what do you think these word math problems would equal to or sort of equal to if you just had to guess? Right. So you could create your own words and your own equations by using some different vectors. You can use the ones we already have. So you could look at the embeddings we already have for the words that we've already created, and you can see.

what are these close to? So this is really interesting where you can do literal word math and you see something like, uh, I won't go through that one. Engineer, humility, ego. So what happens when you subtract engineer from humility? You might get founder entrepreneur, startup, tech, bro disruptor banana, obviously wrong.

And you can look at the similarities to the words after doing this, uh, mathematical equation and you can see what are they close to. So you have an intern minus enthusiasm. Plus cynicism and you have manager at the top of the list and you have sunshine at the bottom of the list. Obviously not going to be very close in similarity.

I think this is kind [00:37:00] of cool and hopefully this really drives home the point of the words going to numbers. And finally, we're gonna get into actually implementing this and building out our rack pipeline. Have some fun with this. Check it out. Make sure you understand it before you move on to the next section.

'cause it will be important for you to understand and have this really good foundation for how this works at a high level so we can begin implementing it and begin uploading tons and tons of data into our pine cone database. And we're gonna set that up next.

## Pinecone Set Up / OpenAI set up

so now we're gonna finally set up Pine Cone and OpenAI. Now one of these is free and one of these is not So free. Pine Cone has a free tier. OpenAI does not have anything for free at all, but for the purposes of all the work we're gonna do, you shouldn't need more than $10.

You can probably get away with five. But what I'm gonna do now is walk you through how to get your API key for OpenAI, where to place it, and walk through some of the code that we've already generated. For you so you can focus on the actual implementation of the more difficult stuff like uploading vectors, finding data, scraping stuff off [00:38:00] the web, and feeding it into your pine cone database.

But before we get into the actual code, and please make sure that you have the project and that you've done something like Yarn or NPM to Install all the necessary packages. Now we're gonna go, and first we're gonna go to OpenAI on their platform for their API, and we're gonna show you how to get an API key.

I am at openai.com/api. I'm gonna log into my account and I already have a key in here, but I'm gonna show you what you need to do here. So I'm gonna go to API platform.

And now that I've logged in, I can go to API Keys and I can generate a new secret, API key, I can call it, I don't know, Rag app, make it my default project and I can create a new secret key. Now, this will only be shown here, so please make sure you copy this because we're gonna need to put this in our environment variables in our next JS project.

Now I can do this because I've already put my billing information into OpenAI. You will likely need to enter in your own billing information. Again, have something like five or 10 bucks [00:39:00] on here. That should be more than enough for you to. Do all the work and even more here. In fact, if you go through my budget here, um, let's see if we can see how much I've really spent here.

So I have a budget of 120 bucks. I've spent like 2 cents in the last couple days. So this is me doing all the work I've shown you with all the embeddings that we've done for the previous exercises where I embedded something like, I don't know, a few words or something like that, it cost me 2 cents.

So I've done a ton of embeddings. I've done some other stuff on the side. It's cost me 2 cents. I have a budget of 120 bucks. I'm just not spending that much, and I don't think you're going to either, even in the last 30 days, we can say how much I've actually spent in the last 30 days. Wow. Really, really low cost.

Anyway, don't be afraid. five or 10 bucks on here. That way you can have a limit so you don't go way over your limit. You don't have to be afraid of just incurring some massive bill. So now that, you have that environment variable, you're gonna go into your project,

you're going to add that secret key in your e NV file at OpenAI API key. This is really important, this naming convention. [00:40:00] Make sure you follow this exact name. Just copy it from the notes in the module and just paste it into your NV with your secret key.

And now we can move on to creating a pine cone account.

So I'm at app dot pine cone.io. I've just made an account. I've signed in and you should see something like this. Welcome to your project. What we're gonna do is create an index and it will offer you some different configurations, and this can be a little overwhelming at first. So let's do this step by step together.

What you're gonna do is pick text, embedding three small. We're doing this for cost reasons. We're doing this because the documents we're gonna be looking at. Lend themselves well to this particular model. If we were doing something else, maybe one of these other models would be better purposes of illustration and learning, we're gonna use the most cost effective model out there so you don't run outta credits.

Text embedding three small dimensions, 512 the metric. Co-sign. See, it's all coming together right now, right? You see that We're gonna use co-sign similarity to determine the distance between the vectors and find the [00:41:00] vectors in this space that match our query. And we're gonna use 512 dimensions in our vectors.

We're gonna use a serverless, a cloud provider, AWS, or whatever you want to use. I'm gonna choose Virginia East. I'm just gonna choose the stuff they automatically give me, oh, and most importantly, let's name our index rag to Tori. You can name yours, whatever you want to name it.

I'm gonna create my index and now we're off to the races. It's gonna create that index and we're gonna need to get the API key for this as well while it's initializing. So we see that we have a host here and we're going to need to get our API keys. I'm going to. Create an API key this API.

Key's gonna be called, I don't know, rag tutorial. Why not? And I'm gonna create that key and I'm going to copy it. And then I'm gonna go on my NV file at Pine Cone API key, and I'm going to use that specific key they just gave us. Now I have open ai, API set up and Pine Cone [00:42:00] set up. It's still initializing and this may take a little bit of time, but we can go to our rag tutorial here. We can look at our, database.

We can look at rag tutorial. I see mine is set up and we have no records yet. That's fine. We don't need to have records yet. We're just starting off. We're gonna be updating and adding documents into this index shortly

you can think of an index as like a particular database or almost like a table in like a SQL or Mongo or something like that. That's kind of my mental model. So a different index may have different types of information. So we're gonna upload a lot of documents that have to do with, uh, popular open source repositories online.

We're gonna upload documents about like, Elle's ai, SDK, um, type script, uh, react. Next js, whatever else you want to. Now, when you make your own project, you probably want to have a different index. In my mind, and the way I've seen this done is that each index will generally hold a certain type of information.

So if you have a bunch of knowledge about code bases in one, [00:43:00] and you want to put another one that has a bunch of, I don't know, legal documents in the other one you have. Two different indexes because you're on the free tier. You can have, I think, up to three indexes at this time, but you can also just blow away one and start all over again.

Again, we're doing this for the purposes of demonstration, gonna create a knowledge base for learning about popular open source repositories, like Next JS TypeScript

and all the other stuff I just mentioned. Um, but yeah, make sure you have a different index for a different type of document, right? Because that makes sense. Why would you want to query one index and potentially get things that have nothing to do with one and the other? It's hard to make sense of that.

It's just gonna make your life a lot easier. So we have one index right now,

And the name of that index is Rag tutorial. We're gonna want to copy this, make sure it's copied exactly as it appears here, and we're gonna put it here. Pine Cone Index. I'm gonna change that to rag dash tutorial. I don't want you to see all my other API keys because I'm just trying to be a little safe.

I am going to deactivate these because obviously I don't want these out there on the worldwide [00:44:00] web for anybody to look at and potentially steal, but I don't wanna also just expose them in this video. Now let's take a look at our open AI TS file. I'm following a pattern here that I like

To have my libraries exported from a lives folder. This way I don't have to call this in every single file where I want to use OpenAI. I simply initialize it here and then I export it so I can use it all over the place in other files and other components, wherever else I want to use it. Pine Cone follows a similar pattern and what Pine Cone does,

and in our pine cone library, there's quite a lot more code here. What I've done here is import All the different types from the Pine Cone Library, the node JS library that they expose, and here I'm importing my OpenAI client library. These things work hand in hand, so step one, we initialize a new pine cone client with our API key.

Then we have a function called search documents. This looks probably a lot like the thing we implemented in the past, [00:45:00] your find similar documents function that you made. So this is how Pine Cone does this. We have search documents we enter a query and then we give the top K results back from that query.

And what we do is we look in a particular index. So we say, Hey, pine Cone client, look in this index here. This gives us back the index. Then we create an embedding, we create a vector. Based on the query, we provide a query like, you know, tell me about Pine Cone or something like that. Right? And it's going to vectorize it,

Turn it into an array of 512 numbers, right? This is important. 512 here. And remember in our database, we have 512 here. These must match. I can't tell you how many problems I've had when I've first set up a database and I've had something like 1536 here, and I've had something like 12 here.

The number of dimensions, literally the number of numbers. Finally, we're going to use the OpenAI client embeddings method to create an embedding. We're gonna get back that, embedding this set of 512 numbers, and then we're gonna pass that to [00:46:00] our Pine Cone client and say, Hey, we want to get

the top three vectors are the top X amount of vectors. Based on this embedding include the metadata, and we'll go over all that shortly about how we're gonna actually store the documents. so you can return pieces of a document or you can include metadata, which might have the original text or the author name or

the date that it was added into Pine Cone, and then you can return all the matches. These are the matches. These are the top X amount of vectors that matched your embedding. Take a bit of time to go over this. This is really where all the foundational knowledge that we've built up comes together. You've built some of this by hand, and now you're seeing how this is used with OpenAI and Pine Cone

To take a string, turn it to a number, feed that number to Pine Cone, and tell Pine Cone to give you all the documents that are similar using co-sign similarity and find the top X amount of documents That are close to that query and return all the matches for it.

Now we can have some fun. And now we're finally gonna [00:47:00] begin adding lots of data to our Pine cone database and then be able to query it and then feed this to a large language model so it can give us a very tailored custom response about a topic we're interested in. We're gonna create our own knowledge base, and then we're gonna be able to query this knowledge base in a chat like interface.

Like a chat GPT style like interface, and then see where that information came from so we can verify it and see if it's trusted. And also get better responses than just asking chat GPT directly. So this is gonna be a lot of fun, but please make sure you walk through these two files in particular to make sure you understand what's going on here.

And don't worry, this project will not run as it is right now. There's a lot of things we're gonna have to add to make it work, but we're actually much closer than you probably think.

## Scraping 101

we have no records in our Pine Cone database yet. How are we gonna get information in there? We have to feed our hungry, hungry database, and we're gonna do this by scraping the web. And I wanna go over very briefly what scraping is. This is not gonna be a whole tutorial on scraping, [00:48:00] which is honestly a very large topic in itself.

We are gonna be scraping the web. For mostly open source read mes and documents that we can find about react type script, next js, pine cone, whatever. And you can extend this to be as large in scope or as small in scope as you want. The reason why I chose for this particular project and for this course to use widely available in public documents is because they're really easy to get scraping.

Is tough. There are people that have whole businesses that are just based on scraping and because I don't wanna overfocus on scraping, I wanna just have documents that are gonna be really easy for us to pick up. But what is scraping at a really high level? It's basically you sending some code, some sort of little robot

that is going to go to a site. It's going to get the HTML off that site and then parse it down, take out the text, and then feed that into our Pine cone database. Why would you wanna do that? Maybe you wanna find a bunch of knowledge about things like, I don't [00:49:00] know, TikTok influencers, or maybe you want to scrape the web.

For court cases and the outcomes of those court cases for some sort of legal tool. Or maybe you want to scrape the web for, you know, different vendors and your competitors for online marketing or something like that and see what they're doing. So you can get a lot of really deep knowledge and research on those competitors.

Now, scraping is a bit controversial, if I'm being honest, because most people, including the large language models that we all use. Basically said, screw it, and just scraped the entire internet. That's honestly how OpenAI chat, GPT got its knowledge base you may be wondering, well, how does chat GPT know so much stuff?

Like how does it know everything from like the Bible to what happened in the news last week or last year or whatever? It's because it scraped the entire internet. There's been lawsuits against OpenAI. People have said it's unethical. There's plenty of people out there that are doing unethical scraping.

I've done scraping as part of my job for many companies where I've worked. Some of it is more ethical than others. I'm gonna tell you the ethical way to [00:50:00] scrape a website, because this is what you should do as a human being and also as a software developer that cares about legal issues and just being a good person.

Can we all just be good people out there please? Right. So you have some code. In fact, it's code that I've provided in the web app. We've written the code for you to do the scraping 'cause this is not a course on scraping. You're just gonna use that tool. You can extend it, you can rewrite it, you can break it.

I totally encourage you to extend the code so that you can do better scraping. I have a very naive implementation of a web scraper. Basically it is some code that goes out to a particular site. Grabs the H, TM L, or any other things that you might be interested in getting, and then takes that information, parses it out, and then you can do whatever you want with it.

Now, if you're going to do more scraping, more intensive, and more.

complex scraping logic. You should do one thing, which is usually check the robots txt file that you'll see on most websites that will tell you, Hey, don't touch certain files. Certain things are off limits, and it might say you're not [00:51:00] allowed, right? You should respect the robots.

txt files. If the robots txt file says, Hey, you're all good to go, or This page is not protected, or We don't mind if you scrape it. Great. Go to that particular page, have at it, try to get the documents outta there. Try to get the things by paragraphs or try to get certain images or whatever you find valuable in that particular thing.

If I was scraping something like TikTok or Instagram, which by the way is incredibly difficult and they really discourage this, I'd probably want to grab something like the pictures right now for this stuff, we're scraping. These are publicly available documents and they don't really have a problem with us scraping this at all, which is why it shows this.

We're using stuff like React. Dev and if you go to React Dev, you go to.

And if you go to a site like React Dev, you see there's all sorts of stuff on this page that we may find useful, and a lot of it we probably won't find useful. So our scraper has to be pretty opinionated and be very particular for the pages that we're scraping. If we just get all the HTML, we might end up with too much information and that leads us to another problem.

[00:52:00] Some of these pages are massive and they have a ton of information on there,

but remember, our database, our index only allows 512 dimensions, right? So what do you do in this case? Think about what you might do if you had a really, really large legal document and you're limited to these 512 dimensions. If you try to embed the entire document, you may not get very good results.

You're likely to lose some meaning, or you just may not be able to embed it correctly. This is why chunking is a strategy that is so important when it comes to retrieval augmented generation. Look at this sentence here.

After years of research, scientists finally discovered that the secret to eternal youth lies inconsistent. What right? Chunking is taking a sentence or a large paragraph or a large document and chunking it into smaller pieces that we can feed to our pine cone database. Now, how you chunk a document is really important, right?

Because if I chunked it here, if I had the [00:53:00] cutoff be right here, chunk doesn't really make sense because I'm lacking the context. I'm lacking the final word, which really gives it all the context. Like what if it meant consistent drug use or consistent,, eating or something like that.

We need that last word in here. So the way we chunk is really important. This is fairly subjective. There are definitely some wrong ways to do this and definitely some better ways to do this, but you're gonna have to think what is a good way of doing this. We have a fairly naive strategy, which we're gonna go into the next module to show you how we will be chunking documents, but I encourage you to think about this, and one of the exercises is gonna have you create your own chunking strategy.

This is super important because just looking at a big document and just doing like, well, I'll just take as much as I can. Then you may just lose important context. So one way is to go sentence by sentence. That may be too granular. One way is to go by paragraphs, but what if the paragraph is really long?

One way is to do a combination of trying to take the last sentence. So at least you're taking as much of a paragraph as you can, and then getting [00:54:00] at least the last sentence so you don't just get cut off in these random places. 'cause remember we're gonna use this context or these documents. We're gonna feed these to our large language model, along with the question we're trying to ask

Tell me about Enums in TypeScript and why they're good or bad, or tell me about the latest features in next JS and what I should be doing to update this code or something like that. And it's gonna be grabbing the top X amount of documents and feeding them to the large language model to come up with a very, very custom and good response.

And if you give it bad input, you're gonna get bad output. So the data needs to be whole. It needs to have the context, it needs to be as full as it can be. So you get good answers. Because if you give it something like this where important context is missing, you're gonna get bad stuff, right?

This, in my opinion, is what kind of separates the rag nubes from the people that, have a little bit deeper understanding. So we have a naive chunking strategy, which we're gonna get into. But think about this. How would you chunk a document? How would you chunk a big legal document?

How would you do something like chunking a LinkedIn post? [00:55:00] Would you need to and why? Just think through these things so you have at least an opinion, because that's gonna be really important because as you're trying to sell this to your team or your company, or you're become the person that is the defacto expert at this time, because there's not a lot of experts around, you're gonna kind of have to have a reason behind the choices that you make.

And even if you're really junior or even really senior. We're all kind of starting at the same place when it comes to retrieval. Augmented generation at this point. There's very few web developers that I've met, or even consultants that I've met that really have a strong opinion on this or that have really, really good insight because it's just so new.

So have an opinion, do some research, think through this, And then we're gonna come back and actually show how we are doing chunking and we're gonna start uploading documents, chunk them, and finally have a database with a ton of documents. and you're gonna keep adding on with more information that you're interested in yourself.

See you in the next section.

## Chunking

We've done most of the chunking logic for you, but you're gonna implement one piece of it to do a really important thing, which is to enable [00:56:00] overlapping of chunks. Now, to reiterate why chunks are so important, it's because we are limited. To the amount of dimensions in our vector store, right? So we have 512 dimensions in our vectors in pine cone for the project that we've just made.

This means if we have an entire novella or something like that, or a massive document, we can't store that in one vector. It simply won't work. Now there are some good ways bad ways of splitting up or chunking. Groups of text a bad way would be something like counting the characters and doing like characters zero through 511.

We're gonna store those in a chunk. What would be the problem with this? Well, you probably get a lot of really useless or broken apart sentences that don't make any sense. So what is a better way of doing this? And I'm not gonna say here's the way of doing it. This requires thought.

This requires some actual thinking. Like what is the best way? Right? So the way we're choosing to do this is fairly naive, but it does have some guardrails. to make sure we store the proper context. So let's take a look at this chunk. For example, react Hook [00:57:00] for introducing React 16.8. They allow you to use state and other React features without writing a class component.

We are doing something called overlapping where we would take the last sentence or some sort of. Piece of a last sentence and have that overlap be available in multiple chunks. Why would we want to do that? Why would we want to have an overlap that is available in one chunk and also in the next chunk?

Well, without overlap, chunk one would have react and components. Chunk two would have hooks and then they would be both missing the full context. So this is one way of doing it. Now, is this perfect? Obviously not. We don't know how these authors or the, people that wrote this stuff, how they organize their documents, it's just too difficult for us to have a a hundred percent way of doing this.

But this is a fairly known and common pattern of doing this overlapping and a rule of thumb is to use 10 to 20% overlap. As you're doing chunking this way, you have the full context, and when you're looking in that vector store and you're getting multiple documents that are [00:58:00] related to a query now, it's more likely that you'll have the full context

in either one of these vectors, right? so this might require a little thinking to see like, wait, What's the point of this? Again, think about this. You want to have full context

in each vector, so independently they can have better context. So using an overlap kind of makes this relationship between the two vectors, so that way they can maintain the context when you query them. We're gonna implement this in a minute, but the most important thing to do is make sure you actually go over the code.

Now we're gonna go over the actual code, which is at chunking ts in our apps lives folder here. So go to chunking ts. And most of this is done for you. We have a chunk size of 500. Why 500? Because we are limited to 512 dimensions. If you put this at like 700 or 800, we'd likely go past our window or past the dimensions available.

We have an overlap. This is 50, which is 10% of 500. Could we make this a hundred? Perhaps? We also have a source. Now what [00:59:00] we're doing is we're doing a split on the sentences where we look for different punctuation, like exclamation question mark, a period. Common markers that would tell us that this is the end of a sentence, and then we simply do, we just go sentence by sentence, and then we store a chunk.

Now, what we're storing is important. We have an ID where we have the source and we have the chunk index. This could be important if later we want to do some updating of these chunks, maybe the documents change or something like that. The ID is not super important, but you can also query chunks directly by id.

So we're gonna have the source in the id. We're gonna have the actual content, which is the chunk of text that we're getting out, and we're gonna trim it so we can get all the white space out so we don't run over our 512 dimensions. And lastly, metadata. Metadata is like a catchall. You can put really anything in here.

You can put any key value pair that you want. So we're gonna store the source. We're gonna store the chunk index. Is this important? Is this not? This could be useful later when you wanna know how many chunks are related to a particular [01:00:00] source. The total chunks, we can update this later. We can probably remove this if we want the starting character and the ending character.

This is probably more information than we really need. But this is just an example, an illustration of what you could store in here. And if you want to do something like store metadata, especially the source, this may help you when you want to query and you want to only get react material. So for example, if you know that the user's query is about react, you could use the metadata to first filter to only look at stuff that has react in it, and then only look at vectors that one have react in the metadata and then match.

The, um, top X amount of vectors by the embedding, you could do the co-sign similarity on those vectors. So this would be a more advanced way of filtering before you do a query that's beyond the scope of this particular module or this course. But this is another way that you can kind of do more SQL or like traditional database filtering without having to do a fuzzy search or a search using embeddings.

Then we [01:01:00] push the chunk into our chunks. Now what you are gonna do. Is implement the Get last words method, the get last Words method. take in the current chunk and the overlap, and we're gonna see, hey, what is the overlap here? And we're gonna try to make the overlap fit into the first chunk and the next chunk, so that way they can store that context between each other.

So the instructions right here, go step by step about what you should do to actually implement this. you're gonna get the overlap, and then you're gonna store that overlap. You're gonna have the overlap text, and you're gonna have, Hey, current chunk, I'm gonna add the overlap text and the next sentence.

So

That way you get the overlap in the next vector that we're going to store. Right? Again, keeping this context, this shared context between them,

so they both have the information necessary to provide a better response ideally. go ahead and try to implement this and I'll show you my solution when you come back.

## Chunking Solution

To test if your chunking solution actually works, you can do yarn test, colon chunking, and we'll see this fail because [01:02:00] obviously I haven't written the code yet and so again, this get last words or really this function could be called like Get overlap is going to do this. It's going to

Hey, is this text like length less than the max length? Well then just take the whole text. Otherwise, we're gonna work backwards through the text. We're gonna split the text on the words. We actually are gonna split on the words here because this is the last sentence. We're trying to get the overlap between the two chunks so they can have this relationship between them.

And we're gonna do this by splitting. The sentence by the white space and assuming, hey, these are probably words in between white space, right? And now what we're gonna do is we're gonna work backwards. Why would we work backwards? Because we want to get the last words, which are gonna be more important in this case, because the previous chunk is likely gonna have the first words.

So the last words are actually. More important to get in the overlap because these are the ones that are likely gonna connect these two vectors. This is a little bit difficult, even as I'm explaining it [01:03:00] to understand why would we want to get the last words more than the first words.

But if you think about the overlap here, if the overlap between my two fingers is here, what's more important To get the first part of my finger over here? Or the last part? Probably the last part. Right? Because that's likely where the context where that joining takes place. So it's more important to get the last piece of the sentence, then the entire full sentence before it.

Those last words will lead into the next chunk, right? So the last words lead into the next chunk. That's why it's more important to get the last words, but that's not like immediately obvious, just looking at this. And by the way, there are many ways to do chunking. This is a strategy to do it. This is also likely the place where it takes the most thought and the most testing should probably go here.

Because getting this right means you have good chunks, good vectors. Good data and getting this wrong means you may have wasted a ton of credits time and need to blow away your entire vector database. [01:04:00] This is why we're taking so long to do this, and this is also why we've actually done a lot of this for you.

If you were doing something like LinkedIn posts or Twitter posts, you wouldn't have to worry about this at all. That's the really nice thing with small documents. Now, I've actually implemented something like this at a company where I was working and we did something. Fairly similar to this, but it does require testing.

It does require a little bit of knowledge about like, well, how do we maintain context and keeping relevant text so it's related to each other. Now let's see if this thing works. We're gonna run the test again, and what do you know? We got all the tests passing, and now we move on to the really simple part, which is just uploading all these vectors into our pine cone database.

See it in the next section.

## Upload Vectors

are you ready for this? We're finally going to scrape and vectorize our articles, and we're gonna walk through the code to do this because really all it's gonna take is running the command, and we're hoping that this works. But let's check this out. Here is the. Script that you're gonna run called Scrape and Vector derives content.

Now, it's important [01:05:00] that you do walk through this because there's a few libraries in here that we're using that you should be familiar with by now. The Open AI client, which is gonna be used for the embeddings and the Pine Cone client, which obviously is gonna be used to actually. Store our vectors into the cloud in Pine Cone.

Now there's this data processor here that we've created for you, and it does scraping with Cheerio. Cheerio is a very popular library for headless browsing. Basically it acts as a browser. It makes a get request to get some HTML from a page, and then what it does, it removes the unwanted elements, like things we know we don't want like footers or script styles.

It makes some assumptions about things we probably don't want to have. It's very naive. It's not the best. There are other tools that you can use to scrape. You can write your own scraper, but essentially what you're gonna do is go out, fetch a URL, make a get request, get back the HTML, and then you can use something like Cheerio to parse it and look through it and dig through this actual H TM L document and remove all the junk [01:06:00] that you don't want to have.

So this requires some knowledge on your hand or some inspection of the source to see what am I actually getting now There is a tool called Fire Crawl. Now Fire Crawl basically does this for you because they understand that people that are building these kinds of applications likely don't want to have their own infrastructure for doing all this crazy scraping.

And we're gonna show you another way of doing this too, that doesn't require any scraping at all, where you can literally just upload the text of a document. That way you don't have to worry about doing scraping. This is really for illustration purposes. This should get us good enough for us. To achieve what we want, which is to scrape some very well known pages that have to do with next Js and TypeScript and React.

Get the documents and get the H TM L. From there, take out all the junk and then store those documents in chunks in our Pine Cone database. So you can check this out and see. Maybe you want to update it, maybe you want to go to those pages, inspect the source code and see does this actually make sense here, or should we be using a different strategy?

Or different content [01:07:00] types or different elements we should be checking for. So the data processor is going to do that. It's gonna chunk the text using the method that you helped create by getting the last words and doing all the chunking, taking chunks in 500 with an overlap of 50 at that particular URL, and it's gonna store that URL.

Metadata as well. And then we're finally going to upload this all into Pine Cone. So we vectorize it, we process the URLs, and then finally we get our Pine Cone index and we store this stuff in Pine Cone by making an embedding on each chunk. We say, okay, let's make all these chunks and then we will feed these chunks.

We do an upsert on these vectors. Vectors will just go over this map full of these embeddings.

And then store them all in Pine C. What could go wrong? I don't know. Here are all the different URLs we're gonna do. So we have 3, 6, 7, 8, 9, 10. Not a ton, honestly. So this is not a ton of data, but I think we're gonna have [01:08:00] a lot of information within these texts here, within these, within these URLs. We're gonna go to the url, we're gonna scrape it, and then we're gonna vectorize it.

Now, this may break at the time of you using it, and if it does,

Then you should try to find some different URLs that may work. So maybe find a read me or a different HTML or different URL for an open source project that you're familiar with. But don't worry, even if this doesn't quite work, just as you expect, we're gonna show you another mechanism in the next section so we can just upload text in.

So we can just upload text and break that apart, which is way simpler, right? Like if we don't have to do the scraping, if we just provide the actual text. So much simpler and we're gonna show you how to do that. But this is for illustration purposes. So if yours doesn't work exactly the way that this does, don't sweat it.

Don't stress out, we're gonna fix it and get you to where you need to be. Now for this to work, obviously you have to have open AI's, API key, and you need to have a few bucks in open AI's [01:09:00] platform. If you don't do that, stop right now. Reach out so we can get you settled and then you can come back and finish this off.

But let's run the script and see what happens.

We gonna run yarn, scrape content.

Because this is a type script script, we're gonna run N-P-X-T-S dash node, blah, blah, blah, blah, blah. The file path. So we can actually run this particular script and let's see what happens. We're scraping the URLs. We have 82 chunks, 145 chunks. I actually have quite a few chunks here looking pretty decent so far.

And let's see if this actually makes it into Pine Cone shortly. But it looks like we have quite a few chunks. I think we're gonna have a pretty decent amount of material, so we have. To have in Pine Cone.

Okay. After a few minutes, this is actually completed and it looks like we've successfully uploaded. 1100. Now I had some failures happen here, which is typical. This is just gonna happen. This is how software works in real life. Um, you're not always gonna have a hundred percent success rate. So now we can actually go to Pine Cone and what do you know?

Look at this. So we [01:10:00] actually have some cool stuff here. this is not terrible at all. We have the text, we have the title, we have the chunk, we have the URL where it's related to. This is really cool. So now we have a knowledge base about Pine Cone, about some TypeScript stuff, about some React stuff.

This is super cool. So now we've actually created a knowledge base we can use in our own app, and I'm gonna show you how to do that in the next section where now we're gonna finally put everything together. We're gonna take a query. We're gonna look at our embeddings, look at our vectors, and we're gonna return response to the user that is based on the context that we provide through Pine Cone.

We're gonna get those documents from Pine Cone. We're gonna feed them to a large language model, and then we're gonna spit out response that has this document as a reference, so that way you get something that makes sense for the thing you're trying to ask. That is based on the stuff we scraped. Super cool.

This actually worked. I hope yours worked as well, but don't worry. Again, we're gonna go over a way to upload text, [01:11:00] um, directly rather than having to do it through scraping shortly. But scraping is a way that we can keep building on this document base and this knowledge base and keep it growing and growing, which is often what you want to do.

Think about this, if you had a legal app or something like that, Some sort of company that was marketed towards like lawyers or something like that, and they needed to know the most up-to-date court cases, you'd probably want to have some sort of scraping mechanism running every night, right?

that would look for updated court cases and then store them. So it would be useful in that case to have this run automatically. Now, there are ways to do this in next js. Again, that is fairly outside the scope of this course, but it's really not that difficult.

I think a naive approach to do this would be to literally just run the scripts every single night and then just get more and more information. But you want to be careful because these are read mes. They're not likely to change very often, but if you find stuff that you think, I'd really like to know this, or I'd really like to see this document in here, and it's not currently in there, then you can just keep adding or replacing the um.[01:12:00]

You can just keep replacing the URLs and just look for more URLs, store them in there, and just run this job on a regular basis, and you're gonna have a really large knowledge base. The only thing that's missing here is to automate this by having it happen like on a nightly basis, and then finding some way to surface or find those URLs.

Anyway, take this as. Far as you want or just keep it as it is. I think we actually have enough to have a pretty decent little rag system right now, so I'll see you in the next section where we'll build the interface and the way to communicate and get a response back using our vector database with pine cone.

## Upload Documents

now we're gonna go into the actual implementation steps of building out this system and being able to accept documents. So you can upload them directly into Pine Cone via an API route. Next JS is a full stack application, so we can do all this in the same app, our front end, our backend, all the data processing.

That's why I've chosen to use it. And actually this is why it's literally [01:13:00] recommended by OpenAI to use basically this exact stack. But anyway, we haven't really checked out the user interface very much yet, and now we're gonna start interacting with that a lot more. So I'm gonna show you a couple things here.

Remember when I said not to worry if your URLs failed? Well, we've actually created an upload interface for you, so you don't have to worry about that at all. So to start this project, I'm gonna use Yarn dev. If you've used NPM, you might need to use NPM Run Dev. This should be running at local host 3000, and we go there and we should see this upload interface right here where you can post in raw text and you can upload raw text.

You can literally just take text, right? You can go to your favorite document or read me online, whatever. Put it in here and hit the upload button, and that should just work. What you are gonna do, however, is implement the URL's API, which is gonna take in URLs, just like it says line by line by line, and it's gonna upload them.

If I put in a [01:14:00] URL for A-I-S-D-K, which is one of the libraries we use, and I hit upload, it says, Hey, it's not implemented. We don't even have this ready yet. So what the heck are you even doing? So what you are gonna do is implement that, right? So we're using a few libraries here, which you may not be familiar with.

I'm using a library called Zod. Zod is a schema enforcement library. Basically, it'll do something like this where you will take the body of the request and let's turn this to JSON, and we can see, hey, does that actually work with the upload document schema? What do we expect it to have?

We expect it to have a property called UR ls. If it does, then great. We have the URLs. If it doesn't, we can reject it. Now, you don't have to use Zod schema. This is just like more protection to make a more production grade application, because if you're using TypeScript and you're expecting certain properties and keys and things like that to be in the body, you probably want to enforce that somehow and not just assume that when you.

[01:15:00] Turn the request into JSON that it just works. Now, do you have to do this? No, you don't. You could just do this, you could do request that, you know, URLs or whatever and expect this will actually work. Um, or actually, well more like this, uh, body URLs, I think it is. But anyway, we're gonna use this upload document schema.

From Zod, in order to enforce that the schema is correct, it's gonna say, Hey, does this have a property named URLs? Is it an array of strings? And are these strings URLs with a minimum character of one? L. So you need to send at least one RL in here for us to get this to work.

So let's see if this works. And we can just do console log processing URLs. Let's see if this works and we can go back here. And it says, not implemented yet,

and let's try one more time here.

And sometimes when you see this happening, I'm kind of glad this is happening. It's just better to just do yarn dev and start over again. Let's see if it works. Now this should have hot reloading enabled, but let's see, just in case it doesn't, so it says processing URLs. Okay, good. [01:16:00] Now we know we're at least in a place where we can keep working on this.

Now, I want you to try to work through this on your own because this gives you all the steps needed to do. And a lot of this, you can actually look at scrape and vectorize content to see how we accept A URL, how we vectorize it, and how we add it to Pine Cone. So while you're doing that, I wanna show you how you can just, you can just store text right now.

So let's just take the text from that particular.

From that URL, for A-I-S-D-K and let's go check it out. And let's, um, I don't know, let's just take some random stuff from here. Let's take this, I don't know, generative user interface. Let's see how much stuff we can copy. Okay, that's a lot of stuff. Geez. Okay. I'm just gonna copy the whole thing.

Let's see if we can do it. Oh, I don't wanna do that. So let's go up here. Um, and we'll go keep going. And this, so let's dump this in here into our, um, raw text. We're gonna paste it here. We're gonna upload that. Let's [01:17:00] see. It's creating 34 chunks. Hey, not too bad. It actually stored 34 vectors based on that.

So this is a way that you can just immediately store your documents in Pine Cone. If you haven't been able to do it in the previous step, what you're gonna do is implement this URLs Upload though, and you'll know it works because you'll see the stuff in Pine Cone. And when we come back, I'll show you the solution that we've created and that you can use to keep moving forward.

But please don't check out the solution too quickly. Try to struggle a little bit and make this so it's your own. You don't have to use Zod. You don't have to use our methods of doing it. You can do whatever the heck you want as long as the end goal is that you accept A URL. You scrape the content and you store the chunks of that content in Pine Cone.

As long as you've done that, hey, you're all good to go.

## API route Solution Overview

Now finally, let's look through the actual implementation. You can probably just copy and paste this from the actual module, but just to walk through it real briefly together, just to make sure you have it working. We parse the incoming request body. We make sure it has a URL's property.

Follow some rules that it's an array of [01:18:00] strings and it has a minimum of one URL in there. Then we call our data processor, which essentially calls our scraping method under the hood with Cheerio, and we do a couple checks, say, Hey, do we have any chunks at all? If not, forget it. We get our pine cone index, the index where we wanna store the documents, and we do this in batches of a hundred.

Where we go over each batch of a hundred chunks and we embed a hundred chunks at a time. This is efficient and this is better cost for you potentially, but also it's just a better way to use open AI so you're not running and embedding on every single chunk and getting rate limited or something like that.

So instead we just pass a bunch of chunks to OpenAI and then we just map over those chunks. We get the embedding response, and we look at the particular index for that embedding. That way we go over a hundred chunks at a time, and then we insert them into our index in Pine Cone. Finally, we just return response with success.

True the number of chunks processed and the vectors uploaded. [01:19:00] So let's give this a quick test to see if this works.

So we don't have a lot of information about Claude in our knowledge base yet, so maybe that would be something kind of cool to add. Let's see if this actually works. we're gonna upload it and see if this actually works. It looks like it's scraping it and it got 23 chunks and now it's gonna put those 23 chunks into a pine cone.

We can go to Pine Cone. And Pine Cone is really difficult at this point. The time I'm using it to like query within here. So we're gonna need a way. To query this thing, right? Because it's great that we have documents in here. We have 1,160 documents, but we can't really just search. We have to search by ID or dense vector value, but that's not gonna work, right?

We don't want to do that. that's wild. We want to be able to do something like, tell me about anthro, or Tell me how to use the Pine Cone TypeScript client, and common pitfalls, or something like that. We wanna be able to search. Like that, right? So let's do that in the next step. Now we have a great [01:20:00] process for uploading documents, either programmatically or through a web interface.

And now finally, we can make this whole response and request cycle come to life By having our chat bot be able to take in a request and then answer some questions about our knowledge base by looking in pine cone and then using that to return a response.

And that'll be really the full lifecycle before we get into using agents and other additions and more complex layers that we can add to make this even better, to make this even more cool to work with. And I'll see you in the next section.

## Querying Documents

So you know what's really missing at this point? A way for us to find documents that are relevant to a query and then return a response to us by feeding those documents to something like open ai. It'd be really cool if we could do something like, tell me about Enums. In type script or something like that.

and then we could send that to an API route. It would then look up relevant documents, feed those to a large language model like [01:21:00] OpenAI, and then return us a response that has this context. Now the chat's not gonna work right now, so we're gonna do this all via API routes, just to test that our whole end to inflow works.

And that's gonna be your challenge. To implement basically

this. You should be able to use this curl request. Basically hit an endpoint running on port 3000 and say how to react hooks work and then get something back. And right now doesn't work at all. It's like that's not working one bit. So we need to implement this so that you can search the documents in your vector database with the query, get the top three documents or the top five, or whatever you think

Is a reasonable amount to use. provide those to open AI's API, and then get a response back based on those documents and the user's original query. Let's walk through this so you know how to actually implement this.

now that we've stored a ton of documents in Pine Cone, it'd be cool if we had a way to query [01:22:00] those documents with like some text, like something like this. Like tell me about Enums in TypeScript, and then we could return the top three or five or 10 documents that match this particular.

Query. So we're gonna build that, or rather you're gonna build that and I'll show you the solution when you come back. But essentially what you want to do is make a route that can handle a request like this where you have a query, which is something like how to React Hooks work, and then you have a top K parameter.

Which gives you the top K documents that match this query. So think through how you could do this. You're gonna, one, want to embed the original query using OpenAI, and you're gonna use 512 dimensions with text embedding three small. Hopefully this is all obvious or at least makes sense to you at this point, why you're doing that.

That's because our pine cone database was set up with 512 dimensions using text, embedding three small, and then you're gonna query the documents. You're gonna search the documents and get the top. K, the top 3, 5, 10, [01:23:00] whatever, based on this, and then you wanna return them to the user so that way we can see what these documents are and say, Hey, does this actually make sense?

Do these make sense? That is basically one of the last steps before we can begin feeding this stuff to a large language model. And then coming up with a nice response. That'll help our chat interface actually stream a nice long text response to somebody based on the information in those documents.

Basically, it's like giving chat GBT access to those documents and saying, Hey, based on these documents in the user's query, now gimme a response. For now, all you're implementing is the way to actually retrieve the documents to see if the documents you get are relevant to the query. Just a quick way to test and sanity check.

And when you come back, I'll show you my implementation of how to make this work. But hopefully you can figure this out on your own because it's really just a combination, a collection of all the things we've already learned about embedding stuff, doing a search of the documents, and returning the top X amount of documents based on the query.

Good luck and I'll see you in the next section.

## RAG Query Solution

Now, hopefully this is one of the [01:24:00] easier sections to implement. It's really just enabling a post request. So what you should have done is make an API route at this particular route. This is just using next JS conventions for making a route. And there's other examples of other routes we have here.

So this is a post request. It takes in a body, it takes in a query and a top K, and then it just searches documents, which is a method that we already have exposed from the Pine Cone Library that we've created. And then we simply format the results. We get the results. This is the cool thing about TypeScript.

We know exactly what kind of results we're gonna get. We pass back the id, the score, the metadata, the source chunk index, total chunks. If this stuff, again, probably not super useful to know, but could be helpful in case the user just wants to have More data available than less data.

So you can kind of determine what you think is important to have here. And maybe instead of the top three, maybe you want the top five or whatever person can pass in whatever they want here. And so if we actually run this request, now we see that appears to be [01:25:00] working. So we'll go in here, we get a 200 request, and we get some actual information here.

Not too bad. So this is pretty cool. And we can look at this information here and we can format this by adding this into our window here. We have the query and we have the results. let's see what the results are. We have a chunk. Two 11, the content is blank. For some reason, that's not actually very good here.

the doc is not actually content, it's doc metadata text. And now if we run this again, as you can see, I've already run it again. We actually get the text back and we can look at this in the console here.

And we can see some nicely formatted text, I hope at this point. So let's make this a little bigger. We'll go to the results. And what do you know we have? Cool. So now we actually have some text that's available for it and we can see it looks like it's chunked pretty well too. Great. It's ending at the sentences.

This tells us a little bit about hooks, and it also has the source still unknown. I'm not too worried [01:26:00] about that. For right now, we have the correct text that's coming back, which actually the most important thing and the score. The score is how much is this relevant to the original query?

So the score is the distance basically between the query and this particular document. So we have a pretty high score here. We have pretty high scores across here, which is great. Now, if we did something like, um, Let's go in here and make a query for something that we, that we have no clue about.

how, how is, um, spaghetti made? I don't know. Okay. Now let's see what we get. We get a score of 0.26. So if we look at scores in here and we look at the different scores, oops, I don't wanna do that. Um, let's look at the scores in here. So we get 0.25, 0.26.

Yeah. These are terrible scores in here, right? And we get some just kind of random things about agents and things like that. So high scores usually mean more. More relevance, basically, really low scores mean [01:27:00] low relevance. And you may want to think, well, what if somebody does just ask something that we know we don't have information about?

What do we do? And we're gonna approach this in upcoming sections when we actually implement an agent architecture, which will decide what we do with a user's request. If they say, Hey, how do I make spaghetti? And if we know it has nothing to do with our knowledge base, do we even wanna waste time and tokens responding to something like that?

Probably not, but right now you have an actual working version where we can query and then we can search our vector database and actually return the relevant chunks that might actually make sense for that query. And then we could pass them to OpenAI and actually generate a response, which will be doing in the upcoming sections.

But Now we actually have a full, basically an end-to-end system for retrieval, augmented generation. We have the upload step. We have the ability to query, And we have the ability to see what is returned from that particular query. So now we're gonna switch gears and we're gonna go away from rag into fine tuning.

Really briefly [01:28:00] take a slight deviation, a slight detour so we understand. Fine tuning really briefly, honestly. And then we're gonna get into actually building out the rest of the ui. So all this comes together and using agents to support all sorts of queries and to have a much more robust slash complex workflow using AI agents and actually have our chat working, which is coming up.

So let me be completely honest with you. Fine tuning is something we're not gonna dive too deep into. 'cause in my highly opinionated opinion, you probably don't want to fine tune a model. What does fine tuning really entail? Basically it's sending a whole bunch of examples of. Prompts and responses to open ai so it can be trained on these responses and these questions to understand how it can adjust its weights and parameters that it uses under the hood to return certain responses.

Basically, you are injecting your examples into the model and changing fundamentally how it works under the hood. When might you want to do this? Perhaps [01:29:00] you have a very unique, specific style of writing that you want to achieve. Maybe you have really highly technical documents or things like legal documents and you have to quote certain things when a certain prompt is asked, or maybe you have something like that has really high, strict parental controls or something like that.

Basically. How much control do you want to have over what OpenAI can give you? Now in reality, you can do a lot of this through prompt engineering. You can do a lot of this through rag systems like the one we've implemented that we're gonna show and we're gonna use later to inject documents into an OpenAI response format.

So it can give us. That we're gonna use later to provide documents to open ai so it can use those while it generates its response. But inevitably, if you are at the forefront of AI at your company, if you're one of those early adopters, you're that person that's integrating AI systems at your company, which you likely should be after doing all the work in this course, then somebody inevitably is going to ask you.

Hey, why don't we find tune a model, and then it's gonna be up to you to speak [01:30:00] intelligently about the pitfalls of doing so. And anecdotally, our CTO at the company where I currently work, went to a big event and he met somebody from Anthropic that's kind of high up there at Anthropic. Even they told us.

Using fine tuning is likely not what you want to do. You could probably just use rag, and that seems to be kind of the winner in the AI space. For most software applications, for most web applications, for most things that companies want to achieve, they can be achieved better through using retrieval augmented generation rather than fine tuning.

That's not to say that there are not cases where you want to use fine tuning, but. You should always proceed with caution, and one of your final assignments is gonna be transforming what we've done with a fine tuning model into using a rag based model. So how does fine tuning work? You'll see here we have a very specific format that OpenAI will expect.

What has a role? The content and what's more important here is the user role in content where basically [01:31:00] you'll ask something of the AI and it will return you some sort of response and you give a bunch of examples of the types of ways that you want it to respond. This is based on my LinkedIn posts, and what we're gonna do is we're gonna upload all this into OpenAI using their API.

To upload and train a model, and then we're gonna get that model back so we can use it in our code, and we're gonna actually use that through some agent workflows in the near future.

## Running Fine Tuning Model

So we're gonna upload our training data, which is actually super duper simple here. We've gone a little bit over the J-S-O-N-L format. This is like JSON, but you'll see there are no commas at the end of each line. This is just the format that OpenAI expects you to submit the training for it to work on.

Its, uh, model that you're going to, uh, update. Basically, it's gonna return you a new model that's trained based on the. Content that you provided here through the J-S-O-N-L. Again, the J-S-O-N-L is simply a list of examples. So maybe if you had a spam detector or maybe you want to have it [01:32:00] right in your style, you want to give it some good examples, and then it will use these to update its training parameters.

So before we run it, let's estimate the costs that this may incur, and we have a little script here that says, let's estimate the tokens here. Now, I've assumed the tokens are 0.01 cents per a thousand tokens, and I have this small little script here that you can use.

This is just a bit of a sanity check to make us feel a little safer before you run something like this. Because if you're either at your own company or maybe you're using your own API and you're paying for it. You probably wanna make sure you're not just gonna blow up the amount of credits that you're using or tokens.

So you can run this script to actually check out the training costs here. And you can do this by doing yarn run estimate costs. It will just estimate the amount of money we're gonna spend. Looks like 31 cents. Not too bad, right? So I feel pretty comfortable running this. Do you? Let's do it.

Let's upload our training data right here. And if we want to see how to run this, we go to package js ON, and we can see [01:33:00] here where we have our train so we can, okay, I'm ready to do it. Let's do yarn, run, train, and let's see what happens. Yarn, run, train. And what's it's gonna do, it's gonna execute this script so let's go over this script. It runs a method called upload training file, where really all it does is call open ai dot files, dot create and creates a read stream and then returns the file. Do id, let's see where this is being called from here. So we have this main function here where we check for the open AI API Key.

We look for the file that we need to upload. We upload the training data and then we create fine tuning job, just calls another OpenAI method where we create the job with the file id. We give it the model that we want to use. This one is the best for fine tuning at the time of writing this,

And now we can just check on the status of the job here. So I'm gonna open this up and we're gonna go to the fine tuning job and we're gonna see what we got here. So it says fine tuning. You see I've done this a few times here. What's [01:34:00] gonna happen when it's done fine tuning is it's going to give us a actual model and we're gonna use that.

We're gonna store that in our environment variables because we are going to use that. When we build our agents so that we have an agent that can take care of doing a LinkedIn stuff and we have an agent that can take care of rag stuff, we're gonna have multiple agents, each responsible for a certain type of response.

So if a user type something like I wanna write an article about why TypeScript sucks, then we might use our fine tuning agent, the one that uses the LinkedIn model that we've trained here. If they're like, Hey, I want to know about. Enums and TypeScript, then we would probably use our rag agent to look there for some data, for some information that we have in our Vector database, and use that particular agent for that.

So we'll have two agents that are gonna be responsible for looking at different sets of data, and then you can add more agents and add more functionality.

And this is where a lot of the fun begins, and where our front end will finally become one with our backend and we'll have a cool streaming front end with a chat interface that will work with these multiple [01:35:00] agents that will do one of these two things for now. So I'll wait for this to finish,

And in the next section we'll talk about agent architecture and an overview of the last and final step of what we will be building.

## Agent Architecture

How many times have you heard the word agents? This year, when people talk about ai, they often talk about agents, and I do think that agents have been very much over-hyped, but beneath the hype, there is some actual use case, and I've built agents that have actually been deployed out into the wild that people use.

Companies with actual customers and stuff. This isn't based on some tutorial. This is based on my real life experience building and deploying agents. Now, this is a very new topic and the rules are being written as we're doing it. We are building the plane as we're flying it when it comes to working with agents, but what an agent really is, is basically like a small AI system that does one specialized task.

That's it. There's a rule in software called. The single responsibility principle, you can use that same principle when it comes [01:36:00] to building AI agents. So in our case, we have two different types of things that we need to support. We need to support people that want to do a LinkedIn post, and we need to support people that want to query a knowledge base.

So if we go into our app here, Which we haven't yet finished. Somebody should be able to type in something like, um, write a post about TypeScript, and our agent should understand, oh, we should probably use our fine tuned model to do this. While if somebody wrote something like, tell me about pine cone types.

Then we should know we should query our knowledge base, but how do we know which agent or which flow, which model, which tool we should be using?

Well, this is where agents come in, and this is a very standard manual agent workflow that I'm gonna show you. Typically, you'll have something like a selector agent. That selector agent will take in a summary of the conversation, [01:37:00] maybe summarize it, and then create a query for the next agent, because oftentimes they have a really, really long chat.

You can't just put all of that chat and pass it to every agent because they have a limit as to how much they can actually take in. So you might wanna summarize it. If somebody says, Hey, yo, I wanna write a post, bro. You know, maybe you want to summarize that and then massage that into something that our knowledge agent or our LinkedIn agent can use.

Something that's free of typos, something that makes more sense, Something that has more context so our agent can do its job a little bit easier, and maybe you want to potentially just reject the request and maybe you say, I'm not gonna actually send you to the LinkedIn or the knowledge based agent.

I'm just gonna kick that right back to you because you asked me about cheese and I don't know anything about cheese, right? I don't have that in my knowledge base. So how can I tell you about cheese? Right? That's another scenario we should support, where we don't actually wanna do anything to the request at all.

We don't want to hand it off to an agent. And then finally, our agents are going to stream this request [01:38:00] back to the user, and they're gonna have a nice streamed request back to the user we're gonna be using a library that's gonna allow us to stream the text back.

That's more of a cool little fun feature to use. This is not really necessary as we're building these agents. I just thought it would be cool to check out. So it has more of that chat GPT type feel that people are now coming to expect. So we are going to stream our responses back to the front end, which will look really.

cool. So that's a bit about agent architecture and honestly, it's not as complicated as people make it sound, But let's actually dig into the code to see what is going on here. So we have this selector here. There's a route called select dash agent and has all this messed up stuff here.

What we're gonna do in the next section is we're actually gonna implement this particular agent or this routing request where a person first types in a message, and the first place that message is gonna go to is a route. This is just an API route in our backend. On next js, we're going to parse the body.

We're gonna expect it to [01:39:00] have, um, a select agent schema, which is really just messages, right? It's just a list of messages. They're message history, and what we're gonna do is we're going to look in that message history. We're gonna get the last five messages. We're gonna look at all the agents we have at our disposal, and then we're gonna feed that to a large language model and say, Hey, based on this query, based on these recent messages.

Which agent do you think we should choose? That's the only job of the selector. Just gonna tell us which agent do we choose, and then summarize the query, right? Like make sure the query makes sense and is contextual, and then pass it on to the next person. So what does it need to make those decisions? It needs to know the recent messages, and it needs to have the query and it needs to know what agents are available.

So we have a thing called a registry. Agents. If we look in the config here, the agent configs, we have a bunch of agents where we actually just have two agents. Now, if you want to add more agents, add more agents, and you can add more. And I suggest you do to really make this your own. But right now we have two known agents that we're going to need to support.

We have a LinkedIn agent and we have a rag agent. And we have [01:40:00] a name here. And most importantly, we have a description here and maybe we can even update this description. So, um.

About for questions about documentation regarding TypeScript, um, TypeScript Next Js Pine Cone Versailles.

Verse A-I-S-D-K and more, right? We can keep adding things in here that makes sense for it to know. Oh, it wants to know about that. Well, in that case, I should probably tell it. To use the rag agent for things about LinkedIn, I should probably use the LinkedIn agent. And this actually isn't for questions.

This is for writing posts In a certain voice and tone for LinkedIn. Actually, we could just get all that outta there and we could say, this agent is for writing posts in a certain tone, and the rag agent is for a specific documentation, and if it doesn't fit either one of these, then we don't have an agent that we can support and we won't do anything.

And we can see what other tools we have here. We have the registry [01:41:00] here have an object that will map the type of request to the type of agent. So We'll say, okay, you wanted the LinkedIn agent or the rag agent, and if we say you want the carrot agent or the pig agent, we say, Hey, we don't have that.

We're not gonna do anything, right? We're not gonna do your request. So we have this little helper function called Get agent, which is gonna look in our agent registry and then grab the particular agent. So you pass in the agent type, which will be one of this. It'll be LinkedIn or rag, and then you can use that agent.

This may be a little confusing if you don't know TypeScript, but what I really want you to take away is the high level this selector is going to determine from your request and the conversation that we've passed, in the summary of your history of messages, what do you want to do? Do you want to go to our LinkedIn agent?

Do you want to go to our knowledge base agent? And then from there. They will take care of the request, they will take the new agent query and they will stream a response to the front end. When we come back, we're actually gonna implement the first agent in our response cycle, the [01:42:00] selector, and then we're gonna go down the line building the LinkedIn one next, and the knowledge base one next.

And if you want to go on your own and try to figure this out. Be my guest to do so. You can watch me do this also in real time, and I'm going to show you some of the mistakes and then how to correct those mistakes, especially as we use the selector agent, because there are some ways to do this really well, and some ways to do this that are a little bit more naive.

We're gonna use something called structured outputs, which I'll show you in the next module as we implement this selector as the first step in our agent architecture.

## Implement Selector

Now that you've learned a little bit about prompting, we're actually gonna build our first agent, which is a bit of a misnomer because this isn't technically an agent. It's more of the logic that's gonna determine which actual agent to use, but I use that term pretty interchangeably With some small amount of AI logic that's gonna be responsible for doing one thing. So this is our selector agent, which is actually really, really important because it's gonna take a request like, Hey, write me a post about TypeScript or something like that. or Tell me about [01:43:00] why Enums are evil in TypeScript.

Or Tell me how to use Pine Cone DB with re-ranking or whatever. And it's gonna have to determine. From that request, which agent should it go to? Now, large language models are really good at this kind of thing because they can take something that is not really well structured like a human thought or some sort of like text or query, and they can determine from that what is the best route to go.

You know this already intuitively because you use chat GBT for doing things like writing code or cheating on your homework or writing emails, and you can tell it kind of a nebulous, cloudy type of. Request or something like that, and then it will distill that information and do something with it. This is where large language models tend to shine.

So what we are gonna do is implement this selector. We're gonna go over how to use open AI's API, and then we're gonna create a prompt, and then we're going to, Return an object that's gonna tell us which selector we should go to, and we'll implement each selector independently, and then we'll have a working end-to-end system.

So let's go through [01:44:00] this now. The code is mostly done for you. I'm at API select agent route. This is a next JS route, and in here we are accepting a post request. We have an A select agent schema, which is a Zod type. This is a schema here, and you can see what does it expect? It expects an array full of messages.

What is a message? A message has a role and it has some content. So this is what it expects to receive,

And we will run some tests with this using local host and sending a request to our backend so it can take that and then return us, what do we want it to return? Remember, what we want to return is the type of agent that we should be using. So to do this, I'm gonna go in here. We have recent messages. We take the last five recent messages.

This is really arbitrary. The problem with taking in. All the messages in a chat history, because we are ultimately going to use this with a chat. That is that if you send all the messages, you're gonna run out of context. You're gonna run out of tokens. Tokens are [01:45:00] used to understand and respond to your response. You can't send an entire novel to chat GBT. It's gonna say, Hey, you're way outside the limit of what I can handle. And even with messages, which usually aren't that long, we don't wanna have every single message in history. Why would we wanna do that If you have the last five messages, that makes sense though.

You could make this the last 10 or even the last two. The problem I'd say with using the last one is that in a conversation context can quickly be lost. If you say something like, I want to know about TypeScript, and our agent responds with, Hey, I need more information. Like, what do you mean?

And you type enums, or something like that. That might be enough for the agent to have context, like, oh, you wanna know about TypeScript and Enums? But if you just said Enums. Then it might not have enough context. Or if it says, do you want me to write a post? Or do you want me to find information about enums?

And it just says, post, is that enough information for our agent to determine what to do next? Or would it need more context? Like having the message history that it understands, oh, [01:46:00] they just said yes, or they'd have a one word response, and that means that I should actually do this action versus that action.

Now we also have an agent configs file here that tells us the name of the agent and the description. This is really important because it's gonna use these to determine which agent it should return back to us. and you should be updating these as you see fit. This is a art and a science, so

If you have a better prompt, you're gonna get a better response. if you have a very convoluted or difficult to understand prompt or have descriptions which aren't really accurate, You're not gonna have a very good response from your AI agent.

So let's actually implement this agent. So We're gonna say constant response equals, OpenAI client chat completions.

And then we're gonna create a response that's going to respond to the chats. We have a content, which is our system prompt. Our system prompt can be something like, You are an agent router. Based on the conversation history, determine which [01:47:00] agent should handle the request.

Here are the available agents and respond in this exact format. Agent, agent, name, query, refined query without the conversation fluff. Now the query part saying, Hey, I want you to extract the actual request that the user is making based on the conversation history. We went over a little bit about the conversation history.

And why that would be needed to be summarized because you might have a one word response or the person might have things like typos and things like that. A large language model will understand this and still give us a good response, but we wanna pass this information to the next agent so our rag agent or our LinkedIn agent can have enough context and have a very nice summarized request to do what it needs to do.

So let's see how this is working. we have response, which is gonna be returned from this completions create method. We've given it a system message. We've given it some agent descriptions. This is basically the Context. Engineering is a pretty hot term. Really all it means is are you giving me information that I don't already have available?

[01:48:00] So you're giving me all the available agents that I have, and then you're giving me a list of all the recent conversations in history, and you're telling me what to do with all this information. Right. So I need the descriptions of the agents, 'cause that way I can tell what to do from your original query, right?

Now let's see about the response. So now we have next response and we're Console log, the response choices zero message content. Now this actually returns some choices, a list of chat completion choices, and this, you're almost always gonna be looking at the very first one, and you're gonna look at the message and you're gonna look at finally the content.

So let's just see if this works right now by just doing this. So we're using the OpenAI client, and remember the OpenAI client. Is using our open AI API key.

The model we are using is GPT-4 oh mini. The reason why we're using the four oh mini is because this doesn't take a lot of thought for the model to do. It doesn't take any complex reasoning at all. [01:49:00] It's pretty simple. There's only two agents that can really choose from, and we should probably have a third choice where it's like, if none of these agents make sense, then just kick back to the user that say, Hey, I don't have enough information to complete your request.

Can you please be more specific about what you want? Do you want me to do X or Y or Z? That might be something to improve or enhance the response later on.

So now to see if this is working so we can just at least test it out. We're going to give our agent a list of messages, which is actually gonna be only one message here, and we're gonna see if it actually responds with something decent.

So let's take a look and see how this performs. Let's go back to our route here. I'm gonna open up my terminal here and I'm simply gonna copy and paste that in here and we can see, oops, I need to actually get this running. So I'm gonna do yarn dev here, and I'm gonna turn off what I have over here. And now I'm going to run this.

We're at local Host 3000. I'm doing a post request to local host 3000 at API slash select agent passing in the following messages. [01:50:00] Let's see what happens. So we've got the agent and we say agent rag query, how to use state in react. Hey, not too bad here. So there was no response returned. That's okay because we don't actually have a response returned here.

Let's try to see if we can make it understand context. This time we have a larger amount of messages and we can see if it is able to keep track of what we're actually asking. So the first message is, tell me about react hooks, and then the assistant says, react. Our hooks are functions, blah, blah, blah, blah, blah, and the user says, how about the state one?

Let's see if it understands what we mean when we say, how about the state one? It should understand that that is in reference to react. So let's send this over and let's check out what's going on in our console here.

And it looks like I actually have to restart it because the other one was broken. So we're just gonna do a quick test and we're gonna run that one more time and see what we get here. API Agents select and look. It says, Hey rag, explain the use of the use state hook and react, and how manages state and functional components.

This is really, really good here. [01:51:00] Amazing, right? So we got the correct agent and we got the correct query. And by correct, I mean we have a query that understands the full context. It doesn't just say, Hey, explain the use of use state. It says, explain the use of use state in React and how it manages state in functional components.

So now what we really need to do is return response that looks like this. We need to have the agent and the query. The query is basically the massaged query for the next agent to handle. So how do we do this? We're gonna do this the wrong way, actually first, and then we're gonna do it the right way in the next module where you're gonna try to implement a much more sophisticated and better way of doing this.

Because this is often what people do when they're first working with agents or working with a open ais API responses. What you're used to doing, most likely is working with chat GBT, and you're sending text and then you get text back. Now a traditional API like in software development doesn't return just random text.

It returns from sort of structured data. We don't really have any structured data here. We have something that kind of looks like [01:52:00] structured data. I mean, we got this, this is okay, right? But it's not an object, but we'll do our best, right? So let's like see if we can parse out the stuff from here.

Some terrible reject stuff that we'll try to like just figure out. And then we'll, hey, next response agent query. So we've said, we've looked at the content, we're looking at the, um, first line, and then we're saying we're splitting the thing after the colon and getting the next word after the and then we're trimming the white space, even saying it out loud.

So I'm gonna yarn dev to restart the server, and then I'm going to pass in the same request. And let's see what we get this time. What do we get? We get, oh, look at that. Pretty good. We get this right here. So this is exactly what we want.

We get agent rag query, explain the use of, use state, hook, and react for managing state now. I challenge you to do this before we go any further and learn about structured outputs, because this is not reliable. This is not something you want to do. If you're doing this or you're seeing this in a code [01:53:00] base that you're actually working in.

I'm gonna show you a much better way to do this that doesn't require weird string manipulation or doing like rejects and things like that. But before you go any further, do you see an issue here? We have two options that our agent can give us. RAG or LinkedIn. What if they ask something that has nothing to do with either one of those?

Shouldn't we have an option to return, unknown or reject the response or somehow that our agent knows, Hey, we shouldn't really go any further, right? Because going any further would mean that we'd give you a really bad response. If you ask about how to make spaghetti or how to bake potatoes, for example.

We should tell you we don't know how to handle that response, and you need to ask me a question that I know about whether you wanna know about LinkedIn or you wanna know about, TypeScript or, or Pine Cone or something that we actually have in our knowledge base. So where would you fit this in and how would you do it?

Because right now we can have this valid agent check where we say, Hey, is this an agent? And is it part of our agent configs? Um, then we give you the agent or else we just default to rag. [01:54:00] That's not really a great use right there because we're obviously going to return you Things that we definitely don't have knowledge about.

So think through this. How would you update the prompt and potentially the response to make sure that we're not routing your request into an agent that can't even handle it in the first place.

I'll see you in the next section where we're gonna refactor this and use structured outputs to have a much better, more reliable system that's also gonna lend itself to testing in the near future when we implement some tests for these agents.

## Structured outpyuts

We're gonna refactor this original text-based response to use structured outputs. Basically returning us a contract that we can enforce using a schema library like Zod. OpenAI basically supports this out of the box, and they're pretty opinionated on the libraries you should be using. So we're using exactly what they re.

TypeScript and Zod, large language models tend to respond really, really well to types, and that is why TypeScript is basically the official recommendation from OpenAI at the time of making this. So here's how you can get a structured [01:55:00] output here. it's not exactly intuitive and the documents are, okay, so I'm gonna show you how to do this in real time here.

We're gonna do const, um. Structured or parsed response maybe, I don't know. Parsed response equals OpenAI client response. Parse. We use the same model. We'll use the same system prompt and you know you are a router agent, router based on the routing, blah, blah, blah, blah, blah. We send in the agent descriptions.

Now here is where you pass in the text and you pass in a text or response. I believe it's response format, and we can just also look at the documents for here too. I'm just going completely based off memory here. But you pass in this new text property here, and we can even read about structured outputs here.

So let's go to structured outputs and see what we find here, and we can go to the actual documentation so we're not just guessing right here. So we have text format and then we will [01:56:00] pass in like this. Cool. So this looks like basically what we're doing here, and we can copy this, they're using model GPT-4.

Oh, let's go back to ours. And we have text, we have format, and we have our input here where we have the, last messages.

So we have all the messages here. Actually, we can just take this out and then we can look at our agent selection schema. We have an object, an agent type schema, and we have a query, and we can even put a describe block on here to give some hints to the model about what we want it to do.

This is kind of a cool little trick you can use where you can use your schema. To help the model understand what it should return back. So in this case a refined query without the conversational fluff. And for our agent schema, we have the agent type, which is gonna be a Zod Enum of LinkedIn or Rag.

So make sure you are using Zod text format when you pass that to the text property here. This will tell it, Hey, we're gonna pass in a schema and then you give it the name [01:57:00] of the schema. I'm gonna call this agent selection and

now this is pretty cool 'cause now we can actually take this parsed response. We already have awaited it, I believe. So let's make sure we're awaiting this. To finish, we need to await here. So we await the open AI client to respond.

We get parsed response, that output parsed, and if we hover over this, we see what it actually returns. It's gonna return either nothing. Or an agent in a query. So it's already type safe for us. So here we can do this. We can take now the output. We can get rid of this, this kind of dirty version here.

We can remove that here. And what we can do here, we can remove all this junk here And then finally we can put agent equals output, agent output query. Now the output could be null, so if it's null, you know, maybe we should do something right here. But now we see that it's gonna be one of LinkedIn or RAG or maybe undefined or the query, which is gonna be a string [01:58:00] or undefined.

I would say if either of these is undefined, um, if you know output, uh, is undefined or output dot. You know, agent if output, agent and output query, then we could just do this. Now we could say, Hey, if we have an output and we have an agent, we're good to go. If we don't, we should probably return something else.

I think that what you could do is to update the actual schema here and then say maybe we have like an agent schema. Maybe the type of agent is not just LinkedIn or rag, but maybe you could have something like unknown. You could have an unknown one too, or unsupported or whatever. Uh, we could have an unknown type of agent here, and then you could update the prompt.

To say, Hey, if we can't handle the request, then maybe we don't do anything and we can remove this here now. So we don't need to have that anymore either. we simply pass in the schema and it's gonna know this is what I have to return. And then on top of that, We can have hints [01:59:00] to our AI to tell it what this is for.

So in this case, we describe the agent to use LinkedIn for posts. Rag for help with technical questions. Now we have a described block in our schema that we're gonna pass to open ai. It's going to look in this schema and it's gonna understand, oh, I need to return these two properties and they can only be one of these types of options that I have, and they must follow this certain type and format.

And then I have a describe block, which gives me a little bit of a hint as to what I should return as well and what should be included in here. This is a really powerful way. To write your agents and this means you have a lot more control and now you can actually write tests for them because you know the types of thing it's gonna return.

This is more like a traditional API now, rather than things that just return random unstructured text. And if we run our API again, and we go back and we run our curl request, let's see what we get out this time. So now we're [02:00:00] running this again and look at this. Now we have agent rag query explain the use state hook and react.

we actually get the exact same response that we got last time, but now we don't have to do any weird parsing or string manipulation. This is much more reliable. And more importantly, testable. So now we are done with our selector. Now I suggest you enhance this, change the prompts, change how it responds, make sure that maybe it responds with, Hey, I need more information.

If you give it something like, you know, make me pasta or. Book me a flight to Hawaii or just asks random questions, you should be able to safeguard against that. Now that's something I really want you to try to do. You should have enough information at this point to update the types, update the prompt, and then see if you can support or not support requests that we obviously won't have an answer for.

And I'll see you in the next section so we can start building out all of our agents, because now we have the brain of our agents done.

And then finally, our knowledge base agent. And then very last [02:01:00] step, which will be showing you how it all works in the ui. and then adding some observability and some testing. So we do all the traditional software engineering practices we should be doing even while working with ai, even while working with RAG new technologies.

Same rules apply. See you in the next section.

## Linkedin Agent

Now we're gonna work on implementing our LinkedIn agent. So this is the agent that's going to take a request, like, Hey, write a post for me about getting a job in 2026 or something. That has to do with writing a LinkedIn post. And remember, this is gonna use the model that was trained on my voice.

So we trained it with all those different posts, giving examples, and the examples were. Okay, so I'm not exactly sure how well this model or this agent will perform, but we shall see, and for building this agent, which is gonna follow the exact same pattern as the rag agent, we're gonna use something called stream text.

This is a method provided by the AI library that comes from versa. This isn't so important to really understand. This is just we have a cool looking [02:02:00] front end. So I want you to focus a lot more on the actual logic and the implementation of using the model and the way we prompt it, rather than thinking about the actual presentation on the front end, which is really kind of just an implementation detail at this point.

This is not like a course or a project where we wanna go deep into how to build streaming front ends. But we are gonna build a streaming front end. So first of all, you should have your open AI, fine tuned model, which should be in your environment variables.

This is the fine tune model we got from sending all that J-S-O-N-L format stuff to open AI and creating a fine tune model. So if you haven't done that step, obviously you're gonna need to do that and you're gonna have to have it As an environment variable that references the exact model from the fine tuned model.

So I'm gonna close that and now we're gonna actually work on building this. And building it is actually really, really, really simple here. So I'm gonna show you how we do this. We're gonna do result is stream text. Look, this is the problem with using AI tools so much. It's so quick that you don't even know what's [02:03:00] happening.

So we're gonna call OpenAI. The model we're using is not like GPT-4 oh or GPT-4 Oh mini. We are using our particular fine tuned model. We're presenting a different model. By the way, open AI's a p. I can work with other models as well. That's beyond the scope of this particular project, but you should experiment with that as well.

I honestly don't think that trying to find the exact right model for the exact right prompt is worth your time and usually is just a exercise in futility. But if you want to try out something like GR or Anthropic or whatever, be my guest, I think it's kind of a fun thing to do. So we're gonna pass in this, um, thing here.

We're gonna put a hash bang at the end of it. Or an exclamation point rather to make sure, hey, you must have this. Basically it's saying this has to be here, this is required. We're using the fine tuned model. And the system prompt is you are a professional assistant helping us with LinkedIn and career related questions.

That's not actually right. You're a professional LinkedIn writer. [02:04:00] You, um, you are, uh, you are a. A professional LinkedIn copywriter, I don't know, copywriter, to create high engagement.

LinkedIn posts. That's it.

All right, now let's actually update the code so it returns just the stream text. 'cause all we're gonna need to actually return is the streamed text here. So in this case, we just return stream text and it looks like I've misspelled model, so I make sure that's spelled correctly. And for messages you can pass all the messages into stream text.

But in this case, we really just want to pass in the prompt, which will be from the request. We want the request dot. Query, which will be the query that the selector logic chose for us. It'll basically be a more refined query that we can use here, a very [02:05:00] fancy, nice, refined query that's not gonna have typos and other things like that in here.

And so here we go. We are using the model that we fine tuned, we're giving it a system prompt, and then we're giving it. The query. So let's actually do some console logging here to see what's going on. So we'll console log request query, and we'll see how this works. Now I have this running right, so I've done, let's do this from the start.

Let's do yarn dev. Let's actually have this working. We're gonna go over how the whole front end is constructed, but honestly, that's the easiest part of this. We're just gonna walk through how it's already hooked up for you. We already have the routes connected to the chat, and now it's just a matter of testing this particular model.

So let's write something that we know will use this model. So we're gonna say, write me a LinkedIn post about getting a job as a junior developer, something I know I've written about. Let's send it and see what it says, and you'll see. Ideally we'll see some nice streaming here.

Let's go [02:06:00] to our backend and see what it's asking and see what it is, uh, generating for us what it is, console logging here and see if we get something cool. So it's sending, it says, write me a thing. Look at this. So this is. Something. I don't know. Is it, is it good? I just passed my reaction. If you got hired as a junior dev, um, hey, this doesn't seem super chat GPT generated.

This seems kind decent. I'm not hating this at all. And look at this says, write me a LinkedIn post about getting a job as a junior developer. And let's see if that's actually what we asked right? Me a LinkedIn post about getting a job as a junior developer. I'm not sure exactly if we sent the right request here.

And let's see something like this. Let's do, let's try another one. Post about React J reacts. Let's just see if that works. Oh, look at this. Write a LinkedIn post about React. Okay, that's great. So this is actually doing a pretty good job. It has no emojis. React is not a framework, it's a component utility library.

This is, wow, [02:07:00] this actually is not that bad at all. I'm not hating this one bit. And now you've seen just how simple it is to implement a quote unquote agent.

All this is doing is a super simple stream text, Which literally generates a stream of text, so it has this cool streaming effect on the front end. We pass in the model that we fine tuned, and then we have a system prompt here that tells us what you should be doing. And lastly, we have a query.

That's really it. And obviously your agent can have more context, less context. You can make the. System prompt longer or better or more verbose and give it more instructions, but this actually is totally fine. It is doing the job we needed to do, and the last agent we're gonna build is our rag agent. Now, this agent actually will be a bit more complex, a little more complicated, and have more logic

That we need to establish slash incorporate, so that'll be a lot of fun. That's basically our last agent in the flow, and then we'll have a fully working end-to-end chat app that uses a fine tune model [02:08:00] and our rag system as well. See you in the next section.

## RAG agent

Let's implement our rag agent. Now, this agent's gonna be a bit different than the LinkedIn agent because the LinkedIn agent really just used our model under the hood and took the request, and that's it. This one will be much different. So this rag agent's gonna need to do a few things. First, it's going to need to embed the query

That we send to it, then it's gonna need to use that to check in Pine Cone, our vector database and retrieve the top X amount of documents or whatever. We're gonna take those documents and then we're gonna pass them into our large language model, which is OpenAI, and then it's gonna use those documents to return some text to the front end.

Why are we doing this? This is basically an example of how you can add. Really relevant context to a large language model that it might not have available. So is this the best use case? Maybe not. And you're actually gonna redo some of this rag by building your own rag. And then you can either use the data that I provided, which is all my LinkedIn posts, or you can go out there and try to find.

More data. So I [02:09:00] suggest you either upload in the interface that's already available for you in this app, or maybe you just think of your own way of scraping the web and finding some data that's not like publicly available or just wouldn't be in chat. GPTs system knowledge already. News stories are really good ones because it doesn't stay up to date on news.

The chat GBT models are not updated every day They're updated every few months, I think, or maybe every year. I don't really know. It's a bit of a black box, but. If you have documents or maybe personal things like diaries, workout plans, things that you have that you want to share in some sort of chats, you can ask it questions about yourself.

This could be a really, really cool tool to do that. And obviously businesses have a ton of use cases for these kinds of things. Everything from frequently asked questions to onboarding documents, to sensitive information that they may not want to share to chat GPT where they need to build something in-house.

That can actually access these documents. They don't just dump them all in the chat, GBT. This is honestly where most companies are going to [02:10:00] be using ai. It's not gonna be in building their own large language model or doing more agent workflows and all these kind of things. These are buzzwords. RAG is where the market is seeing the money and the investment heading towards.

Anyway, enough about the spiel about rag, I think. hopefully I've already sold you on why RAG is an important thing to use and do, and I just want to. encourage you to try to find your own cool use cases for using retrieval augmented generation. But let's get down to business.

So step one. So we're going to make an embedding text, embedding three small. Hopefully that's driven into your head. So many times now why we're doing this, we have to make our embedding right, so we make the embedding, and then we actually will pick this embedding response. How about that? We'll make this embedding response, and then we'll get the embedding, which will be the data and the first item in that array of data and get the embedding from it.

Cool. Step two is using our favorite vector database, pine cone. And if you want to, you can try to do something like maybe using quadrant or something like [02:11:00] that. You can use other vector databases in the future. They all kind of work the same. It's like using Postgres versus MySQL, you know, same kind of thing.

Slight differences, but same general rules apply. So knowing this and seeing this one place means you can apply it all over the place. So we have our index, we get the Pine Cone client index, and then we finally query that index and we'll get the top. I don't know, maybe you get the top three. Is that. Fine to do.

I think three is probably enough. So that seems decent enough. And then let's get the actual content outta there. So let's do the, um, content equals query response matches. We'll get the text, I believe it is, and then we will join it now. I'm just doing this and I suggest you think of doing this because remember, we're passing this to a large language model, so it's gonna wanna be able to read this in a way that is somewhat formatted because I do notice that if you don't somehow format or structure the data you're feeding to the large language model, it.

It can kind of get confused. You don't want to pass in too much [02:12:00] data. You want to pass in just enough. So if you just pass in like the entire JSON object that comes back from pine Cone, it can handle it, but it's likely to get confused or just have too much context and maybe even run out of memory or maybe run out of context rather, and it won't return you the best responses.

This is a bit of an art, so you'll have to see like, well. What's going on here? Is it giving me the kind of responses I want? And you'll have to do some debugging, which is often difficult with large language models because they are non-deterministic. Meaning you could give it the same input, but you won't always get the same output.

That's one of the most difficult things with working with large language models. Anyway, we have our content here. And I'm gonna console log the content because I wanna make sure that we're actually getting what I think we're getting. So actually, matches map. Um, we're gonna filter out, okay, so this is like a bit of a type script trick here.

We're gonna filter anything that is null or just undefined or anything like that. And then we're gonna join it. Now we're gonna console, log the content, and then finally, let's actually pass it to [02:13:00] OpenAI. We'll make a system prompt. You are a helpful assistant that answers questions based on the provided context.

So here's the, we're gonna put request, query, and, uh, you know, we don't, I don't think we need the original request. We can just put, here's the, um, user query. Here's the context from documentation to use in your response. Use the context above to answer the user's question. If the context doesn't contain enough information, say so Clearly.

Or do your best to answer. We can always refine these later. And now. Now the fun part. Okay, let's do return stream text. We're gonna use OpenAI, GPT-4 oh, or maybe we should use GPT-4 Oh mini. I don't know. I actually think we should use GPT-4 oh in this case because this requires a bit more complex logic because you might have a few documents, three documents at least in this case, and we're gonna use those documents to generate a response.

So it may need a little more reasoning than [02:14:00] GPT-4 oh mini. The difference is slight enough that I don't think it really matters. I suggest you experiment with this and see which one you think does better. We're gonna get rid of the messages and instead put the prompt. Which is the request query I don't think we even need the query in here because I think the system prompt is gonna be fine.

Here you are a helpful assistant answers questions based on the provided context, context from documentation. the system prompt is gonna have a hard time being cached, which you should have read about by this point. You should understand that system prompts can be cached, so this might prevent it from caching.

I don't know if this is the best place for this, so we can actually take that out here. You are a helpful assistant that will answer questions based on the provided context in the user's query. Use the context, in the query to answer the user's questions. And if the content doesn't contain enough information.

So now the system prompt understands like, okay, what am I doing? What kind of agent am I? And now in [02:15:00] here, it's gonna be more important to have the prompt be like context. Content and then we'll have user query, which is the user query. I think this is maybe good enough. So let's see how this works. And we're going to do yarn dev.

And then what I really wanna see, which is the most important thing, is the content. I wanna see the kind of content we're passing in here because the streaming part, this part is just kind of simple stuff, right? This is nothing crazy going on here at all, but.

So let's see how this responds. Let's ask it something about using pine cone, for example. And this, we can ask it a question about how it might implement re-ranking, which you are gonna do in the next module. How can I implement. Re-ranking with Pine Cone. Let's see what it says. I'm a little nervous, always a little nervous to do these.

These are always the fun part to see like what breaks, what doesn't break, um, for re-ranking. The quick, oh, this is really cool. Actually, this is not too bad at all. This looks like it actually looks like something's kind of wrong here. Oh, look at that. Re-rank the [02:16:00] documents and let's see, actually the documents that it got out of here, blah, blah, blah, blah, blah.

For re-ranking. If, uh, the main query, oh, this is not. Too bad at all. So these are actually the documents, and let's make sure these actually are the documents. I'm gonna put content after here to make sure this is actually what I think it is and we'll put, you know, a couple breaks in there. Um, tell me about enums.

Okay, let's see what it says this time. And we have a select agent. The agent should ideally select our re ranker. Look at that. Okay, cool. Um, undefined and assignable types. Wow. Look at this. Not bad at all. So this is pretty cool to see. The provided context doesn't mention Enums, but I can give you a brief overview based on general TypeScript knowledge.

So, um, I think that we should do a little experiment here and let's look up something on Enums and what's the point of enums? Let's find something. TypeScript Handbook Enums. And let's just [02:17:00] dump all this in our knowledge base and we can re-ask the question and see if it works. Oh my God. This is, this is a lot.

Oh, holy moly. Why? Why so much? But let's see what happens when we dump it in our chat. Okay. And then we'll upload it.

Oops. And I'll need to select raw text when we upload this. So let me. Let me select raw text and let me upload this now and see what happens when I upload this. And ideally we'll get a bunch of vectors there and let's, um, say try again and see what happens now. So this is a good way to see if we actually test, um, test things right there.

This, this is looking like it's kind of the same. And, okay, this is pretty good. This looks pretty good. The provided context doesn't provide information about enums. Um, okay. That's not, that's not great, but I think that this is at least a way for us to check and see why or why not. Our, our vector database may not be returning what we think it should be returning.

we can look at the query We can see if maybe the database doesn't have this all [02:18:00] up to date yet, but this is an imperfect science, and you're gonna have to debug some of these things and figure out like, okay, well how is this working or not?

So if I wanted to debug this further, I think what I'm gonna do here is look at the request query here. let's comm log the request query. Let's refresh this and let's say, tell me about Enums and let's see what happens here.

Tell me about Enums in TypeScript request and we'll get the content back and let's see what the content says. Okay. Hey, look at that. Look at that. Okay. Not bad. Not bad at all. This is great. So this actually looks like, oh, the content is is nothing. Well, that's not good at all, is it? So that's a little bit strange right there.

So we cons log content. It does look like we're getting a pretty decent response here. We could do some more debugging, but this is a way for you to at least track what the query is you're using, the content that it's getting back, And what it's providing to your large language model OpenAI in this case, before it delivers you a [02:19:00] response.

Not bad at all. You can upload more things, maybe upload like stuff that would only know about you, for example. And then to take it even further, you can have your response, reference the documents that it got back from Pine Cone to see, Hey, are these good at all or not very good at all.

so by the way, I actually discovered a bug as I was showing this to you, where I was using a different metadata field to store the text. When you upload. From this text box here. So what I've had to do is make sure that I look at match metadata, text or match metadata content.

You shouldn't have this problem in your version because it is fixed. But now if I do this again and I say, tell me about Enums, now I can see what's going on here and I should get at least something in here when it comes to the content. Great. Look at that. So now I got some good content here. I'm, I'm happy.

I'm seeing some good metadata in here. I'm seeing the stuff that I've uploaded, I can only assume, and now the world is all right, but I'm glad this happened in front [02:20:00] of you because this is the way you're gonna have to debug things, and this is one of those things you'll have to really meticulously check because uploading the data and having good data is the most important thing.

The rest of this is honestly just rappers. Around the data. So when people talk about AI or agents and all this stuff, at the end of the day, if you don't have good data in, you won't have good data out. And in the next section, I want you on your own to do some research on re-ranking and what that means, how it's achieved in Pine Cone, and then try to do it on your own.

This is really, really important. And then come up with your own opinion on re-ranking. Is it overkill for this? When would it be useful? And is a bonus. When you're re-ranking, I want you to answer this question. Do you have to use the documents that come from the Vector store in order to re-rank?

Or could you do it with something else? Why or why not? Why would that be useful? How would that maybe not be useful? Could it be used here? I just want you to think through this problem about what re-ranking is really for and what it is limited [02:21:00] to. Do you have to use the documents that are in Pine Cone in order to re-rank, or could you just pass in anything at all?

And why would you wanna do that? Good luck and now that the training wheels are off, do the next section on your own as best you can. And you can just watch me go through it on my own in the next one. But honestly, that's really trivial because it's just gonna be riding a little bit of code.

Which way more important is understanding why you would do something like re-ranking. Anyway, see you in the next section.

## Reranking

so re-ranking is a bit more of an advanced technique when it comes to retrieval, augmented generation, and using vector databases. Basically what we've done is we've done this search and vector space and we've got the top X amount of results, but because there might be hundreds or thousands or millions of vectors out there, sometimes what we get back.

Might not be the best or related very well to the user's original query. So you can run basically another pass over the stuff that you got back to get even more fine tuned and get even better quality results. So then you can look at all the text that comes back and you can re-rank it and maybe have [02:22:00] re-ranking.

You realize that, oh, this one's actually better. This one's actually second best. This one's actually third best, and so on and so forth. And then you can take the top X from there. So to do re-ranking, you may want to actually over fetch, meaning you might wanna go from only getting the top three to getting the top 10, and then re-rank the top 10 and then get the top three from there, if that makes sense.

Because then you're saying, okay, I over fetched, I got more data than I probably need. Some of it's probably not great. That's okay because I'm gonna re-rank that data and then I'm gonna get the top ones. From that data, I'm gonna get the top three because if I only re ranked, I might have not actually grabbed these ones or known that they were actually the most relevant to the user's query.

This is an advanced technique, and by the way, that bonus question I asked you in the last section about if you can pass other data into a re ranker that is not from Pine Cone. Yes, you can. So this is also a really powerful tool. Maybe you have two different databases. Maybe you have some data in SQL and some data in [02:23:00] vector stores, and you want to put it together and then re-rank it.

And you can say, maybe we actually have better data in sql, or maybe we have better data from a web search we've done. You could do things like a quick scrape of the web in real time and see if you can find information that is even more relevant and up to date and see which one is the best one out of here.

So re-ranking, again, a powerful tool complex. A bit more advanced

and we're gonna implement this now in here. So let's turn this from top K three to top K 10 potentially. And let's do cons re ranked.

So Pine cone actually outta the box offers a free re-ran that you can use. So it looks like re-rank, just takes in the name of the model, the query, and then the documents like this. Okay, so I think this is all we need to really pass in for this to work. Let's see here. Um, match, oops, let's see. Query response matches, match and we'll return.

All right. So I think this should [02:24:00] actually kind of work here. Um, and let's take the documents here. We'll pass him here. Of course, this is deciding not to work. Always, always fun coding in front of other people, right?

Um, join. Okay. We have documents, which is okay. Match text. We should already have this. This should be map text as string. Okay. And I think we finally have this working. So what we had to really do here, if it's not clear, was to make sure that we are passing in a string of documents here, in fact, an array of, we're passing in an array of strings.

So basically something like this, this is how it re ranks stuff. Okay. And we have text, text, text, text, text, text, text, text, text. Um, now we have our re-rank documents here and we can feed now the re-rank documents. We'll get rid of this here and we'll pass in our context [02:25:00] re ranked data and boom. I think we're gonna be all good here.

Let's, uh, console dot log the re ranked stuff to see if it worked. Now let's run this again and see if our re-ranking actually works, or at least is, is running the way we expect and we can say, um, how do I make an agent with verses A-I-S-D-K? And let's see what happens here. We have our selector agent, which is running, and we say, oh no, we didn't actually get what we wanted to get here.

Permission denied project, not authorized to use model, re-rank English V three.

So I actually went to my Pine Cone IO organization and I'm looking at inference to see what I can actually use for re-ranking. And let's see here. So we have BGE reran, V two M three. I'm just gonna use this one actually. So I'm just gonna use BGE e reran and we're gonna. Change this to bge. Reran her V two dash M three, and let's see what we get [02:26:00] here.

Okay, and let's try this one last time. We'll go back to our rag and we'll just copy this and we'll run it one more time and we will go in here and see if this works. Select the agent again. Come on. Hey, look at that. We have now re ranked the documents now, so we get a re-rank score, the index of it, the score.

We get some pretty high scores here. Not too bad. So now we have this to create an agent, so not too bad at all. Obviously this doesn't look great on the front end, but this is pretty good stuff and we can see that the re-rank her appears to have done the job it was supposed to. We got the top 10 documents that we re-rank them, and now you see that the re-rank by the score and we return the original document that we can now use when we pass this to

our stream text method, we pass in the system prompt, like normal. We look at the re-rank data, we map over it, and then we get the document dot text and we filter out all the stuff. And then we [02:27:00] finally say, and here's the user's original query, and it uses this to return us a beautiful response. Are you happy?

Are you satisfied? I hope so. Now, the fun part, which is making this look. Cool. so for all you people that are really interested in the front end portion of this, in the next section we're gonna walk through that and we're gonna look at how we can kind of beautify this a little bit.

But to be completely honest, we've done all the hard stuff. In my opinion, the front end part is really good for something like an AI tool like Claude or Cursor to beautify a little bit for us. But I think there's some way more interesting challenges you could do, like adding in things like the source here, so you can add the source or source that you've used

And also maybe support the scenario where we ask a question and we are not able to answer it. We should tell them that instead of routing to an agent to do anything at all. So see if you can figure out how to beautify this and maybe just make it your own so it doesn't look like Craigslist from 1995.

But honestly. The work is done now, so I hope you've learned a ton here. [02:28:00] The next couple things we're gonna do is really just making this production ready by adding in some observability, and then also adding in a test or two or three or four to make sure that our agents aren't going completely haywire

Through updating our prompts in the near future. Can't wait to finish this whole thing off with you, and then you'll have a working end-to-end project with observability and some tests so you can sleep well at night and know that you haven't destroyed your company's reputation or yours by uploading agents out into the wild that have no guardrails or barriers.

Anyway see you in the next section where we'll kind of wrap all this up.

## Interface Walkthrough

Now you may be wondering how we made this beautiful interface for you to use, and I'm gonna walk through some of the basic parts of the interface here just so you can see kind of how it all works together. This is using React and Next js, and it's not doing anything particularly interesting besides maybe the streaming portion.

So we're using U State to capture all the messages that we are sending back and forth from the front end to the back end. And we have some things for uploading the data to our vector [02:29:00] database, but most of that logic is really in the backend. So what we have really is a form that will submit some data.

We use U-U-I-D-V four to make a unique id. Is this overkill? Is it not? It's just a way to have unique IDs per each message.

so then when we map over them in the ui, we have a unique key, Which react, we'll expect. So that's pretty simple, right? Here's where the actual logic comes into play here, and this is the part where I wanna spend the most time because this is how it all kind of works together.

So when you submit a message, we submit all the current messages here, right? And we could probably shorten this down to just past the first five messages or 10 messages in here. We already shorten it in the backend, but we could probably just shorten it right here. So maybe that's an improvement that you want to do.

What we do is we call the select agent. Route. We pass in all the messages and then we wait for it to return an agent and the query. From there, we just simply pass the agent and the query to our other calls, and we don't even really need to pass in all the messages because we've already summarized [02:30:00] them in this call here.

So we do a two step process where, one, we decide what agent we should use, and then next we pass that on to our next agent in the flow, which is either gonna be the LinkedIn agent. Or the rag agent. Now what you can do in here is decide that maybe if, like, maybe if the agent, you know, if the agent is, uh, unknown or if the agent equals, you know, something else, whatever.

Right? Then we would show a different message like, sorry, we didn't have enough information to route your request correctly. We only know about X and Y or whatever you think would be appropriate to tell the person. So we don't have that right now. Right now we route to an agent no matter what, but ideally, you would only route to an agent if you actually could support the type of request.

And then finally, we set messages with the new message we received Back from our agent, we add a unique ID from the assistant message id. And then here's an interesting part. We have that cool streaming effect. What we're doing in here from like LinkedIn agent, we call stream text.

We return stream text, which returns a [02:31:00] readable stream, and on the front end we'll read that stream. We're gonna read that stream and we know when we're done or we have a value if we're done. We stop streaming. If we're not done, we append piece after piece into the UI to create that nice streaming effect.

Now, Elle's ai, SDK, the library that we're using actually has a really cool method to do this. They have this method called Use Chat Which will expose all sorts of cool functionality to support chats and like handle, submit, and stream stuff. In all honesty, that would've taken too long to implement.

It would've just added more complexity to what we're doing. You don't have to use these libraries. There's tons of things out there to use and you meet a lot of people with really strong opinions on which ones you should use. Ultimately, this is a front end design choice and really should meet the needs of whatever you're actually building and whoever you're working with, and.

Whatever you think looks appealing. I decided to use a very, very bare bones minimal setup here so you could make this your own. If you don't wanna make it your own, that's fine. [02:32:00] We're basically done, but you should at least understand what's happening here in this particular section where we select an agent, we get back the type of agent that we're going to send to the next.

The next request down the line where we actually invoke the agent. And then finally we will call the agent. Now let's check out the chat API here as well where we do what we've done most of the other routes, we parse out the body, we make sure we have something that is actually valid, and then we get the last message, we get the original query, and then we execute the agent.

So.

from our selector, our selector is gonna give us one of those two agents, and we're gonna get that agent in the actual route that will be used to execute the agent. Then we're gonna get the agent. We're gonna say, okay, is this either a LinkedIn or a rag agent?

And then we simply execute it. All we do is call that particular agent. We execute the agent and we get the streamed response back from the agents. We look at agent executor. This just gets the agent and all this does. It just returns us. One of these agents. [02:33:00] That's really it. We call the agent and then we boom.

We execute it with the query and the messages and the original query. We're actually not using the original query, so we could probably get rid of this for now if we wanted to, but we'll keep it in there for this purpose. So that is how all this fits together. We have a chat interface. You hit submit. You first go to the select route.

Where you'll get an agent back and a refined query. From there, we'll send that refined query and that agent to our chat route. That chat route will be responsible for handling that request and then streaming that response to the front end, what we call result two, text stream response,

And then we can handle that stream in the front end and have that really cool effect going on there. And so now take this as far as you want, because all we're gonna do now is add something called observability to this project so you can observe what's going on underneath the hood and explaining why that's important for us to have.

So now we're gonna add observability, basically a way for us to monitor token usage, the types of responses we're [02:34:00] getting, and actually just see the quality of the responses in the large language model and the documents and all the things we're providing. So it's not a complete black box, because remember, large language models are non-deterministic, meaning the same input.

Will not always generate the same output. Small tweaks to the prompts, small tweaks to the models, small tweaks to the documentation you're returning can give you wildly different responses. So how do you observe all this And make sure that people are not abusing your app. Make sure that people are having a good experience seeing the types of requests that your users are making and seeing the types of responses that you're generating.

This is super duper important, and that's one of the last things we're gonna implement in the next section.

## Observability

So what is observability? It's basically what it sounds like. It's a way to observe our app and observe the underlying functionality and logic and making sure that it kind of works. There's a few really big players in this space for AI powered apps. One is Helicon, one is Lang Smith. These are the ones that I'm most familiar with.

Helic C is cool and you can get started for free. So is Lang Smith. And what you get is a really nice [02:35:00] dashboard like this where you can see the latency of your request, you can see who's using it. You can see the costs of the models and things like that, and the top models that you're using. The errors, it just gives you observability, it gives you a, a bird's eye view

of how users are actually interacting with your app. Super important, and you can even go deeper and look at the prompts

and look at the responses and see if you're getting out what you're expecting. So let's make an account on Helicon.

I am gonna call my organization Parity here, and I'm gonna create an organization. This is all free right now and I'm gonna continue. Cool. And I'm gonna send a request, like I'm just gonna skip to the dashboard at this point. So all you really want to do is make an account and now we need to add a provider key.

We need to create a helic, API key rather. So this shows us how we're going to wrap our open AI provider with this Helicon observability tool.

So I've created a key here and I'm gonna put that in my environment. Variables

under Helicon API key. So now I have my Helicon API key, and now I want to actually [02:36:00] integrate it into my app. Okay.

So the Helicon docs are a bit strange, honestly, and what I'm using is the github.com helic to see how to actually implement this without having to put my API key for OpenAI in their dashboard, which I don't really want to do.

I just want to use their base URL here,

so that way I can keep using my API key in here. So let's see if this works. So let's put something like, make a post about side projects and see if this works. So we have select agent, and now let's go to our Helicon dashboard and see how this is being generated or what is going on here.

Let's go to our dashboard and see if we can see any requests coming in. Hey, look at that. So I have one successful request. I'm using GP two four oh mini. This is pretty cool. I'm using a max of 0.3. Point one three tokens and, the quantile is not exactly sure what that is, but I can actually look at the requests.

Let's see if we can actually dig into the request. Look at this now. This is really good. Write me a post about [02:37:00] JavaScript and it tells me the agent that we're using and the number of tokens was 187. This is super, super cool. And now we have some visibility into how the app is being used by me or our one.

User, which is probably you at this time. Now, something interesting though that I noticed is that we're not seeing it in our rag agent at all. We're not seeing OpenAI in here. So I think we're gonna need to somehow configure this

to also use Helicon and not exactly sure how to do that.

So we're using OpenAI from AI dash SDK because we want to use something cool like stream text. Maybe we have to give it a base. URL here. I'm not exactly sure how to incorporate The observability here. So that's something maybe you'll have to figure out.

But I think we have observability into one of the most important parts of our app, which is the selector agent. So right now we have at least some visibility into our selector, and We see what the system prompt is, we see what the user request is and we see what the actual output is.

This is super duper cool, and that would be a cool challenge for you to figure out, well, maybe we [02:38:00] can't use stream text in this case. Maybe we'll have to actually update our keys in the dashboard. I think that's honestly the only way you can do this is by in the dashboard,

Providing them your open AI API key, and then you can get more visibility into every layer and every agent and what they're doing. But for now, I'm pretty satisfied. And this gives us enough information that we can start monitoring how we are using our agent workflow and we have something pretty cool that is actually fairly useful.

So I encourage you to play with Helicon and then potentially consider something like Lang Smith and see what are the pros and cons of using one or the other. All these tools have a little bit of a difference between them, and you're gonna find people that have really strong opinions on which one you should use.

For the purposes of demonstration, though, I think this is good enough and at least gives you some insight into why you should be doing this, because you want to be able to have some insight into how your models are behaving. At the very least, you wanna see how much. Tokens you're using and what the latency of your request is, because this is super important.

Maybe if we change [02:39:00] the model from GPT-4 oh to GPT-4 oh mini, for example, we might see our latency drop, but now we can measure it over time and we can track changes in our code to the changes that we see here and see if things that we've changed make a difference here. This is something you can't really just track in GitHub.

You can't say, huh, well, what changed recently? Well, somebody changed a prompt. Will somebody changed the underlying model. Maybe we have more users. Maybe we're sending too many documents to the model in the first place, and we're just blowing up our token costs.

So now you actually have some way of observing this and seeing this. And this is where real engineering happens because it's not all about just having the thing work. We need to see why it's working and why it's not working, and seeing if what we have here is actually making sense to us.

If the quality of what we're seeing is good. So play around with this and see if you can find other cool ways of using this and then maybe share them with the rest of us, because I know this is really, really new for most of us and we're barely scratching the surface of what this particular tool can use.

I'm sure we could do a whole course just on this tool alone or observability with large language [02:40:00] models, but play around and see what you find and then maybe share it with the rest of us.

## Testing/Outro

so let's move on to the very last thing that we're going to do before you move on to your Capstone project, where you'll really make this truly your own. Now you're gonna see a test suite here at Selector Test Ts. It's under agents underscore test folder. So. I've created the test for you. This is mostly just as a reference for you to use when you want to create tests, and this will really drive homewise.

Structured outputs especially are so important when working with large language models. So what we're doing here is we have this wrapper around a next JS request from a backend API. We describe the test and then we say, here's what it should do. it should route to LinkedIn post creation using a LinkedIn agent, and we provide it.

A query that is representative of the type of query we would want for the LinkedIn agent to be used. Right. And the query here, we can just probably erase this. Actually, what we really just care about is the agent we can see is the agent LinkedIn or is it rag?

And this is a pretty simple set of tests, [02:41:00] but it can at least clue you in to when something has changed and, oh no, I changed the prompt and now like things just break because changing prompts is one of those things that's really easy to do that has these weird downstream effects that you might not realize till afterwards.

So you could test this by just going in the UI and testing all sorts of different queries and seeing what you get back. Or you could have a test like this, which goes through some known queries and test some weird edge cases and see does this actually pass? So you can see that these are passing obviously.

We go to yarn test selector and we see do these in fact pass. Now, this is the power of using these structured outputs because it's really hard to test something like, Hey, like gimme a LinkedIn post and it generates a bunch of text and we say, I mean, is that good? Is that not good? There is a way, in fact, to test the quality of things like that, and one way you could do that is to have another large language model test the output.

It's basically using a large language model as a judge. Where you could pass the output from streaming the text and say, okay, we've [02:42:00] got all the stream text now. Now let's pass it to another large language model and see, you know, on a confidence of zero to 10, how confident are you that this is a good response?

I don't think that is as useful yet, but the jury is still out, and honestly the jury is still out when it comes to writing tests for these kinds of APIs. And these kind of applications in general. I have never really seen anybody talk about testing large language models, but I do think the best way and the most obvious way to test them is by using structured outputs.

And then you can test, you know, given this input, what is the structured output? This is much easier to test than the quality of a response. So when you're using structured outputs, it becomes much easier to write a series of tests that can just say, Hey, are we gonna route to the right place?

Is this property actually coming back and does it have a value attached to it, which is what we expect. These are pretty decent tests. It can give you some sort of sanity check that you haven't completely ruined things and can really clue you into, in a prompt updates some logic that you didn't quite expect.

Now, the problem with these tests. is that they use [02:43:00] tokens. You cannot mock out or you cannot fake using the open AI API. I've actually seen people do this, and I have no clue why they'd ever think that would be an appropriate thing to do.

But you obviously want to actually call OpenAI and use the actual API call in here, which means this is not free. So this is not the type of test that you wanna run. Every single time you make a commit, it's not even the type of test you really wanna run on a regular basis. You wanna run this right before you deploy, or maybe after you make a series of pretty large changes.

So the jury is also still out about when do you run these kinds of tests and is it okay to just blow through tokens and just test all the time? 'cause honestly, you're not gonna spend a lot of money running these tests, but you're spending a few cents every single time you run the test. So you have to be aware of this kind of thing and maybe just run this on demand ,

Anyway, check out the tests, see what makes sense to you. Add your own tests, maybe see if you can clean this up a little bit and see do you feel confident with these types of tests? Do you see the value in them? And how might you rethink doing these [02:44:00] tests? And what kind of things would you check? What edge cases might you have in there?

And how would you keep adding on to these tests? Or would you take them away? When would you run them? You need to think through all these types of things because these are the questions That are going to come up when you're in the real world and you're trying to sell this to your team or your team is considering not writing tests and thinking, well, you can't possibly test large language models.

And you can say, well. You kind of could. So I hope you find this useful, if nothing else as a reference guide and then think through how you would do this on your own. And please add some more tests, or at least make this your own so you understand it and get your hands a little bit dirty. And then that's it.

I am really excited that we went through this together. I have learned a lot, honestly, just building this again, I've built a few large complex applications using RAG, using agents, and I've taught you now everything that I've known from doing this in the real world. And I guarantee you there's not many people out there that are teaching this right now.

So you're in a very small club now to really, really extend your knowledge and to [02:45:00] really drive it home, you're gonna take the training wheels all the way off using all the knowledge you have. Finally build your own rag system with your own data and deploy that out to the web. And most importantly, you're gonna record a video explaining exactly what you've done, the pitfalls, what tools you've decided to use, what models you've decided to use, what observability tools have you decided to use, and then come up with a comprehensive.

Walkthrough of what it does, why it does what it does, pitfalls, learnings, all sorts of things that you think are interesting to share because this is gonna get you used to talking about and really internalizing that knowledge.

If you can teach something, that means you know it very, very well. So if you're able to teach in about five to 10 minutes and do a video explaining what you've done, why, and some of the stuff that you've learned along the way, that's a really good litmus test to see. Do you really understand this stuff?

Good luck. I hope you had fun doing this, and I can't wait to see the project that you're gonna share with me so I can check it out and maybe I can learn something myself in this very, very new field. See you [02:46:00] around.
