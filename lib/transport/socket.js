var http = require('http'),
    fs = require('fs'),
    util = require('util');

module.exports = function socketTransport(options) {
    var _options = {
        socketPort: 8182,
        port: 8181
    };

    // override default options with the provided values
    if(typeof options !== 'undefined') {
        for(var attr in options) {
            _options[attr] = options[attr];
        }
    }

    var app = http.createServer(function(req, res) {
        
        console.log(req.url);

        if(/^\/(index\.html?)?$/.test(req.url)) {
            fs.readFile(__dirname+'/../stash/socketClient.html', function(error, content) {
                if (error) {
                    console.log(error);
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        }
        else if(0) {
            fs.readFile(__dirname+'/../stash/', function(error, content) {});
        }
        else {
            res.writeHead(404);
            res.end();
        }
        
    });
    app.listen(_options.port);

    var io = require('socket.io').listen(app);
    io.sockets.on('connection', function (socket) {});

    this.emit = function(dataObject) {
        io.sockets.emit('log', dataObject);
        console.log(util.inspect(dataObject));
    }

    return this;
}