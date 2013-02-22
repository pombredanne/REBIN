#REBIN
RESTful binary wrapper and configuration dashboard - Builds RESTful endpoints for parameterized binary/script and command input and output

##Technologies
[Node.js](http://nodejs.org/) - Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

[redis](http://redis.io/) - An open source, BSD licensed, advanced key-value store.

[socket.io](http://socket.io/) - Socket.IO aims to make realtime apps possible in every browser and mobile device, blurring the differences between the different transport mechanisms. It's care-free realtime 100% in JavaScript.

[backbone.js](http://backbonejs.org/) - Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.


##What is REBIN?
Creating a web service really should be this easy. Doesn't matter if you program in C, C++, Python, Ruby or even C# Mono. Expose the functionality of your app or script in just a few seconds with an API endpoint.

##Basic Use Case
You have or create a CLI based application or script. It takes input, it produces output. Now, how do you expose your work to the web so you can utilize via a web service. REBIN takes care of that! 

##Basic Example

Using ystock.py as a script example: 

ystock.py accepts a stock symbol as input, or multiple stock symbols as input. From that input, it outputs relevant stock information. 

Within the REBIN dashboard, first click: Add New Endpoint, from there you need to give your app a name. Let's use ystock.py as an example. Then, provide the URL you would like for your endpoint. Enter the path to your script, which should include in the case of python, the python command, such as: /root/REBIN/scripts/pythonTests/ystock.py

--

Created by Anthony Nyström and Jeff Baier at Intridea. 

Anthony Nyström

[Twitter](http://www.twitter.com/AnthonyNystrom)  
[Github](http://github.com/AnthonyNystrom)

Jeff Baier

[Twitter](http://twitter.com/jeffbaier)

Intridea
  
[Website](http://www.intridea.com)  

##License

MIT License. See LICENSE for details.

##Copyright

Copyright (c) 2013 Intridea, Inc.
