var util = require('util');

module.exports = function consoleTransport(options) {
    var _options = {};
    if(typeof options !== 'undefined') this._options = options;
    
    this.name = 'console';
    
    this.emit = function(dataObject) {
        console.log(util.inspect(dataObject));
    }
    
    return this;
}