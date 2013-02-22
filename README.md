#REBIN
RESTful API server and configuration dashboard - Builds RESTful endpoints for parameterized binary/script and command input and output

##Technologies
[Node.js](http://nodejs.org/) - Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

[redis](http://redis.io/) - An open source, BSD licensed, advanced key-value store.

[socket.io](http://socket.io/) - Socket.IO aims to make realtime apps possible in every browser and mobile device, blurring the differences between the different transport mechanisms. It's care-free realtime 100% in JavaScript.

[backbone.js](http://backbonejs.org/) - Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.

##Platforms
OSX

LINUX



##What is REBIN?
Creating a web service really should be this easy. Doesn't matter if you program in C, C++, Python, Ruby or even C# Mono. Expose the functionality of your app or script in just a few seconds with an API endpoint.

##Basic Use Case
You have or create a CLI based application or script. It takes input, it produces output. Now, how do you expose your work to the web so you can utilize via a web service. REBIN takes care of that! 

##Basic Example

Using ystock.py as a script example: 

ystock.py accepts a stock symbol as input, or multiple stock symbols as input. From that input, it outputs relevant stock information.

EXAMPLE: 

    python ystock.py GOOG

OUTPUT:

    GOOG

    {'stock_exchange': '"NasdaqNM"', 'market_cap': '262.3B', '200day_moving_avg': '711.306', '52_week_high': '808.97', 'price_earnings_growth_ratio': '1.27', 'price_sales_ratio': '5.21', 'price': '795.53', 'earnings_per_share': '32.214', '50day_moving_avg': '754.295', 'avg_daily_volume': '2364040', 'volume': '3511036', '52_week_low': '556.52', 'short_ratio': '1.30', 'price_earnings_ratio': '24.60', 'dividend_yield': 'N/A', 'dividend_per_share': '0.00', 'price_book_ratio': '3.65', 'ebitda': '16.278B', 'change': '+3.07', 'book_value': '217.332'}

-
###Now, let's get the above working as a RESTful endpoint!

In the case of Python, you must ensure your header has: 

     #!/usr/bin/env python 
 
Make sure your script is marked as executable:
 
    chmod +x yourscript.py
    



Within the REBIN dashboard, first click: Add New Endpoint, from there you need to give your app a name. 

Let's use yStock as an example. 

Provide the URL you would like for your endpoint: ystock

Enter the path to your script: /root/REBIN/scripts/pythonTests/ystock.py

Finally we need to add a parameter. In the case of ystock, it takes a symbol parameter (That's what we are calling it, we could call it anything really). Then click on Save.


![alt text](http://surfiki.io/addendpoint.png)

You will now see your Endpoint setup, as shown below:


![alt text](http://surfiki.io/setup.png)

We can now test our endpoint! If you happen to be running this on localhost, then your URL would be:

http://localhost/api/ystock/?symbol=goog

Which you can either enter directly in to a browser or simply use cURL, for which your output will be:


	{output: "goog {'stock_exchange': '"NasdaqNM"', 'market_cap': '262.3B', '200day_moving_avg': '711.306', '52_week_high': '808.97', 'price_earnings_growth_ratio': '1.27', 'price_sales_ratio': '5.23', 'price': '795.53', 'earnings_per_share': '32.214', '50day_moving_avg': '754.295', 'avg_daily_volume': '2364040', 'volume': '0', '52_week_low': '556.52', 'short_ratio': '1.30', 'price_earnings_ratio': '24.70', 'dividend_yield': 'N/A', 'dividend_per_share': '0.00', 'price_book_ratio': '3.66', 'ebitda': '16.278B', 'change': '0.00', 'book_value': '217.332'}"}
	
That's it!
 
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
