# BBCRUD - A Backbone.js CRUD Application

     ____                     __      __                                                 
    /\  _`\                  /\ \    /\ \                                   __           
    \ \ \ \ \     __      ___\ \ \/'\\ \ \____    ___     ___      __      /\_\    ____  
     \ \  _ <'  /'__`\   /'___\ \ , < \ \ '__`\  / __`\ /' _ `\  /'__`\    \/\ \  /',__\ 
      \ \ \ \ \/\ \ \.\_/\ \__/\ \ \\`\\ \ \ \ \/\ \ \ \/\ \/\ \/\  __/  __ \ \ \/\__, `\
       \ \____/\ \__/.\_\ \____\\ \_\ \_\ \_,__/\ \____/\ \_\ \_\ \____\/\_\_\ \ \/\____/
        \/___/  \/__/\/_/\/____/ \/_/\/_/\/___/  \/___/  \/_/\/_/\/____/\/_/\ \_\ \/___/ 
                                                                           \ \____/      
                                                                            \/___/       
    (_'_______________________________________________________________________________'_)
    (_.ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ._)
      
  BBCRUD is a sample Backbone.js CRUD application (C)reate (R)ead (U)pdate (D)elete developed to learn how to use Backbone.js. I'm using Zend Framework 1.12 on the server end, development & testing is being done running OS X v10.8. Download the release-v0.1 tag for the non AMD version.
  
  Thanks to numerous tutorials and example projects found on the web for a majority of the code concepts found in this project.
  
## Features

  * Demonstration of CRUD operations using Backbone.js and Zend Framework.
  * Asynchronous Module Definition. Utilizes Require.js.
  * Table grid that supports sorting, searching and paginating result sets.
  * Zend Firebug Database Profiler Asynchronous Query Logging
  
### Screenshots
Here's an example of what this project looks like.

#### Screenshot
![BBCRUD](https://raw.github.com/tomshaw/bbcrud/master/docs/bbcrud.png)
  
## Technologies

  * Backbone.js 0.9.9
  * Require.js 2.1.2
  * Handlebars 1.0.rc.1
  * Grunt.js 0.3.17
  * Underscore.js 1.4.3
  * jQuery 1.8.3
  * jQuery UI 1.9.2
  * Jasmine 1.3.1
  * Zend Framework 1.12
  * Twitter Bootstrap 2.2.2

## Installation

  Look in the docs folder for the example user database. 
  
  * Find the database and load it.
  * Update your application.ini and fill in your MySQL connection information.
  * Setup a virtual host like you normally do for a Zend Framework project.
  
## Jasmine Unit Tests

  A simple route has been defined to access Jasmine Unit Tests. 
  
    http://bbcrud.dev/jasmine
  
## Grunt Tasks

  Install Grunt.js 0.3.x globally. I'm currently running 0.3.17. 
  
    sudo npm install -g grunt
    npm install
    
  Executing the predefined tasks that include linting concating and minifying source files.
  
    grunt default
    
  Headless unit testing using Phantom.js and Jasmine.
  
    grunt tests
  
## Running the Require.js Optimizer

  Make sure you have Node.js installed. In the build directory run the following commands.
  
    sudo npm install -g requirejs
    node r.js -o example1.js
    
  or:
  
    node example1.js = Outputs and optimizes specified directory.
    node example2.js = Outputs and optimizes specified directory.
    node example3.js = Outputs a single build file.

## Todo

 A lot of testing! This project was created to learn Backbone.js. Any input, help, pull requests or ideas would be greatly appreciated. 

 List of todo items:

  * Implement some worthwhile unit tests.

## License 

(The MIT License)

Copyright (c) 2012 Tom Shaw &lt;tom@visfx.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
