#REBIN
RESTful API server and configuration dashboard - Builds RESTful endpoints for parameterized binary/script and command input and output

##What is REBIN?
Creating a web service really should be this easy. Doesn't matter if you program in C, C++, Python, Ruby or even C# Mono. Expose the functionality of your app or script in just a few seconds with an API endpoint.

##Basic Use Case
You have already or have created a CLI based application or script. It takes input, it produces output. Now, how do you expose your work to the web so you can utilize via a web service. REBIN takes care of that! 

##Technologies
[node.js](http://nodejs.org/) - Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

For installation instructions please refer to:

[Installing node.js, npm and redis](http://jason.pureconcepts.net/2011/12/installing-node-js-npm-redis-mac-os-x/)

--

[redis](http://redis.io/) - An open source, BSD licensed, advanced key-value store.

For installation instructions please refer to:

[Installing node.js, npm and redis](http://jason.pureconcepts.net/2011/12/installing-node-js-npm-redis-mac-os-x/)

--

[socket.io](http://socket.io/) - Socket.IO aims to make realtime apps possible in every browser and mobile device, blurring the differences between the different transport mechanisms. It's care-free realtime 100% in JavaScript.

[backbone.js](http://backbonejs.org/) - Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.

##Platforms & Full Installation Instructions
###OSX

Using homebrew. Everyone should use homebrew. http://mxcl.github.com/homebrew/
  


Install the "Command Line Tools for Xcode": http://connect.apple.com


    $ sudo xcode-select --switch /usr/bin
    $ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
    $ brew update
    $ brew doctor


Install Redis

    $ brew install redis

Install Node.js 

    $ brew install node
Add 

    export PATH=$PATH:/usr/local/share/npm/bin to your .bash_profile


Clone Project and install dependencies
 
    $ cd YOUR_PROJECT_DIRECTORY
    $ git clone https://github.com/intridea/REBIN.git
    $ cd REBIN/rebin
    $ npm install
    $ npm install nodemon -g
    
    * This installs a node wrapper that restarts the application when changes are made.
    https://github.com/remy/nodemon


Launch Redis and REBIN with default configurations

    $ redis-server /usr/local/etc/redis.conf
  
    $ node setup.js
    
    * This is a setup script that prompts you for a username and password for the initial web interface user account.
  
    $ nodemon app.js
    * Project is now running on http://localhost:3000/

###LINUX

Install Node.js 

    $ sudo apt-get update
    $ sudo apt-get install build-essential openssl libssl-dev pkg-config git-core
    
    $ cd /usr/local/src
    $ sudo wget http://nodejs.org/dist/v0.8.20/node-v0.8.20.tar.gz
    $ sudo tar -xzf node-v0.8.20.tar.gz
    $ cd node-v0.8.20/
    
    $ sudo ./configure
    $ sudo make
    $ sudo make install

Install Redis

    $ cd /usr/local/src
    $ sudo wget http://redis.googlecode.com/files/redis-2.6.10.tar.gz
    $ sudo tar -xzf redis-2.6.10.tar.gz
    $ cd redis-2.6.10/
  
    $ sudo make
    $ sudo make install
    $ cd utils
    $ sudo ./install_server.sh

Clone Project and install dependencies
 
    $ cd /var/local
    $ sudo git clone https://github.com/intridea/REBIN.git
  
    $ cd REBIN/rebin
    $ sudo npm install
  
    $ node setup.js
    
    * This is a setup script that prompts you for a username and password for the initial web interface user account.
  

To run REBIN on system startup, create the following Upstart configuration file:

    # /etc/init/rebin.conf

    description "REBIN"

    start on runlevel [2345]
    stop on runlevel [^2345]

    # Restart when job dies
    respawn

    # Give up restart after 5 respawns in 60 seconds
    respawn limit 5 60

    script
    	export SS_ENV=production
    	export SS_PACK=1
    	export NODE_ENV=production
    	export REBIN_PORT=80

    	chdir /var/local/REBIN/rebin
    	exec /usr/local/bin/node app.js 2>&
    end script

Issue the command to start. REBIN is now running on http://localhost/

    $ sudo start rebin



##Preparing executables and Security

Executables can only be run from:

/REBIN/rebin/executables

As well, all scripts require the +x flag

    chmod +x yourscript.py

In the case of Python, you must ensure your header has: 

     #!/usr/bin/env python 
     
Ruby

    #!/usr/bin/envy ruby

R

    #!/usr/bin/Rscript
 
##Basic Example

Using ystock.py as a script example: 

ystock.py accepts a stock symbol as input, or multiple stock symbols as input. From that input, it outputs relevant stock information.

EXAMPLE: 

    $ python ystock.py GOOG

OUTPUT:

    GOOG

    {'stock_exchange': '"NasdaqNM"', 'market_cap': '262.3B', '200day_moving_avg': '711.306', '52_week_high': '808.97', 'price_earnings_growth_ratio': '1.27', 'price_sales_ratio': '5.21', 'price': '795.53', 'earnings_per_share': '32.214', '50day_moving_avg': '754.295', 'avg_daily_volume': '2364040', 'volume': '3511036', '52_week_low': '556.52', 'short_ratio': '1.30', 'price_earnings_ratio': '24.60', 'dividend_yield': 'N/A', 'dividend_per_share': '0.00', 'price_book_ratio': '3.65', 'ebitda': '16.278B', 'change': '+3.07', 'book_value': '217.332'}

-
###Now, let's get the above working as a RESTful endpoint!

Using ystock as an example:

Within the REBIN dashboard, first click: Add New Endpoint, first thing you will see is a dialog. This is where you select your executable. Assuming you follow the default file structure, your executables will be shown. In this example, the executables from this repo. After clicking on python/ystock.py click on OK.



![alt text](http://surfiki.io/exselect.png)

Provide the URL you would like for your endpoint: ystock

Finally we need to add a parameter. In the case of ystock, it takes a symbol parameter (That's what we are calling it, we could call it anything really). Then click on Save.

![alt text](http://surfiki.io/detail.png)

You will now see your Endpoint setup, as shown below:

![alt text](http://surfiki.io/setup.png)

We can now test our endpoint! If you happen to be running this on localhost, then your URL would be:

http://localhost:3000/api/ystock/?symbol=goog

Which you can either enter directly in to a browser or simply use cURL:

    $ curl http://localhost/api/ystock/?symbol=goog
	
	{output: "goog {'stock_exchange': '"NasdaqNM"', 'market_cap': '262.3B', '200day_moving_avg': '711.306', '52_week_high': '808.97', 'price_earnings_growth_ratio': '1.27', 'price_sales_ratio': '5.23', 'price': '795.53', 'earnings_per_share': '32.214', '50day_moving_avg': '754.295', 'avg_daily_volume': '2364040', 'volume': '0', '52_week_low': '556.52', 'short_ratio': '1.30', 'price_earnings_ratio': '24.70', 'dividend_yield': 'N/A', 'dividend_per_share': '0.00', 'price_book_ratio': '3.66', 'ebitda': '16.278B', 'change': '0.00', 'book_value': '217.332'}"}
	
That's it!

##Debug

The dashboard provides a Debug section that will aid in resolving any issues you may encounter with a specific endpoint and parameters associated.

![alt text](http://surfiki.io/debug.png)
 
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
