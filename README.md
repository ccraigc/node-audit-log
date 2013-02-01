# AuditLog

Audit logging toolkit for Node.js.  Choose your storage or notification strategy by utilizing one or
more extendable transport systems.  Automate log creation by utilizing plugins for common libraries such as
Mongoose (CRUD logging via model plugin) and Express (access logging via route middleware).


# How To Use It
**0. Install the module:**

Use NPM to install the module, like so:

    npm install audit-log

**1. Include the library:**

```javascript
var auditLog = require('audit-log');
```

**2. Add a Transport System:**

Different transports may have varying options. You should read their documentation for details.
The Mongoose and Console transports are described in this example.
```javascript
auditLog.addTransport("mongoose", {connectionString: "mongodb://localhost:27017/myDatabase"});
// either or both -- up to you where your messages are sent!
auditLog.addTransport("console");
```

**3a. Log an Event**

Events are the usual structure for log events.
```javascript
//  method is logEvent( actor, origin, action, label, object, description )

// descriptive parameters for your reading pleasure:
auditLog.logEvent('user id or something', 'maybe script name or function', 'what just happened', 'the affected target name perhaps', 'target id', 'additional info, JSON, etc.');

// a more realistic example:
auditLog.logEvent(95049, 'AppServer', 'Shutdown', 'Production-3 Instance', 'ec2-255-255-255-255', 'Terminated from web console.');
```

**3b. Log another kind of message of your devising**

You can make up another type of message and give it a descriptive label, if you so desire...
```javascript
auditLog.log({logType:'Warning', text:'An error occurred and you should fix it.', datetime:'2013-01-31 13:15:02', traceData:'...'});

// note:
auditLog.log({message:'Call your mother.'});
// will send this to your active transports:
// { logType: 'Generic', message: 'Call your mother.' }
// because logType is needed by AuditLog to identify handlers.
```

**4. Use a Plugin to Automatically Send Messages**

There are some plugins already available which ship with AuditLog, including Mongoose CRUD logging and Express route logging.


**Addendum**

It's usually a good idea to check any documentation in the Transports and Plugins, because they can vary a fair amount,
and might be specifically written to handle a specific *logType*.


# Plugins

## Express
Log requests, and automatically assign an actor to events by checking session variables.

### Usage Example
```javascript
// setup the plugin
var auditLogExpress = auditLog.getPlugin('express', {
    userIdPath:['user','_id'],
    whiteListPaths:[/^\/some\/particular\/path.*$/]
});

// use it in your Express app
app.use(auditLogExpress.middleware);
```

## Mongoose
Log MongoDB database activity by adding this plugin to your models.

### Usage Example
```javascript
// Here's the mongoose plugin being used on a Model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema
    auditLog = require('audit-log');

var HumanSchema = new Schema({
    name: { type: String },
    height: { type: Number }
});

var pluginFn = auditLog.getPlugin('mongoose', {modelName:'Human', namePath:'name'}); // setup occurs here
HumanSchema.plugin(pluginFn.handler); // .handler is the pluggable function for mongoose in this case
```

# Roadmap

+ Adding a Redis Transport
+ Log archival and pruning
+ Socket-driven live log monitoring API


# License

(The MIT License)

Copyright (c) 2013 Craig Coffman <craig@imakewidgets.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
