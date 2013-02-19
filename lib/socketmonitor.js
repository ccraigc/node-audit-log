function SocketMonitor() {

    this.io = require('socket.io');
    
    this.listen = function(_options) {
        
        var options = {
            clientPort: 8181,
            socketPort: 8182
        };
    
        // override default options with the provided values
        if(typeof _options !== 'undefined') {
            for(var attr in _options) {
                options[attr] = _options[attr];
            }
        }
    
        io.listen(options.socketPort);

        io.sockets.on('connection', function (socket) {
          socket.emit('news', { hello: 'world' });
          socket.on('my other event', function (data) {
            console.log(data);
          });
        });
    }
}

// expose yourself

exports = module.exports = new SocketMonitor();