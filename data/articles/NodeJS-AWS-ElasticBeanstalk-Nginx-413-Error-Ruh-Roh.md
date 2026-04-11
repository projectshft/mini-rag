# NodeJS + AWS + ElasticBeanstalk + Nginx + 413 Error — Ruh Roh

---

NodeJS + AWS + ElasticBeanstalk + Nginx + 413 Error — Ruh Roh

But… it worked locally, I pitifully mumbled at my screen. For some reason, the NodeJS API I had recently deployed to production on AWS using ElasticBeanstalk was returning a 413 (Request Entity Too Large) when a user attempted to upload an attached file. Without the ability to upload, we basically didn’t have an app!

Luckily, or perhaps not so luckily, the internet is littered with articles suggesting solutions to this common issue. At the root cause is the nginx configuration on the EC2 instance having a limit for incoming requests that is lower than what you are attempting to send over the wire. Going through at least 5 dead ends and high rated answers on Stack Overflow that just didn’t work, I was beginning to wonder whether this was some big joke I was not in on. Could you in fact update your nginx config for a NodeJS app on ElasticBeanstalk?

Well, dear reader, you can! Firstly, to test what limit you need to set, you can connect to your EC2 instance using AWS’s GUI and tinker with increasing the body size limit in real time:

A terminal should appear and you can directly edit the nginx config using vim (your favorite!)

As a refresher once you’re in vim:

i to be able to edit the file

esc to get out of edit mode

:wq write (save) and quit vim

Now let’s update the config and restart nginx so your machine can use the new limit:

After confirming that your new limit does in fact work, it’s time to set this limit in a more sustainable way. The problem with editing it in the machine as we’ve done above is that if the instance autoscales then all changes will be lost.

At the root of your NodeJS project create some folders .platform/ngnix/conf.d Now, create a file in conf.d to increase the limit. I will name mine body_limit.conf with the following content:

Redeploy your NodeJS app and connect to the terminal. You should now see your file in the EC2 instance.

Take that nginx! Take that 413!

I am by no means an AWS expert but hopefully if you found yourself in my situation with this particular error, you’ve saved yourself some painful debugging and getting lost in the maze of internet solutions that don’t quite work.

NodeJS + AWS + ElasticBeanstalk + Nginx + 413 Error — Ruh Roh

But… it worked locally, I pitifully mumbled at my screen. For some reason, the NodeJS API I had recently deployed to production on AWS using ElasticBeanstalk was returning a 413 (Request Entity Too Large) when a user attempted to upload an attached file. Without the ability to upload, we basically didn’t have an app!

Luckily, or perhaps not so luckily, the internet is littered with articles suggesting solutions to this common issue. At the root cause is the nginx configuration on the EC2 instance having a limit for incoming requests that is lower than what you are attempting to send over the wire. Going through at least 5 dead ends and high rated answers on Stack Overflow that just didn’t work, I was beginning to wonder whether this was some big joke I was not in on. Could you in fact update your nginx config for a NodeJS app on ElasticBeanstalk?

Well, dear reader, you can! Firstly, to test what limit you need to set, you can connect to your EC2 instance using AWS’s GUI and tinker with increasing the body size limit in real time:

A terminal should appear and you can directly edit the nginx config using vim (your favorite!)

As a refresher once you’re in vim:

i to be able to edit the file

esc to get out of edit mode

:wq write (save) and quit vim

Now let’s update the config and restart nginx so your machine can use the new limit:

After confirming that your new limit does in fact work, it’s time to set this limit in a more sustainable way. The problem with editing it in the machine as we’ve done above is that if the instance autoscales then all changes will be lost.

At the root of your NodeJS project create some folders .platform/ngnix/conf.d Now, create a file in conf.d to increase the limit. I will name mine body_limit.conf with the following content:

Redeploy your NodeJS app and connect to the terminal. You should now see your file in the EC2 instance.

Take that nginx! Take that 413!

I am by no means an AWS expert but hopefully if you found yourself in my situation with this particular error, you’ve saved yourself some painful debugging and getting lost in the maze of internet solutions that don’t quite work.