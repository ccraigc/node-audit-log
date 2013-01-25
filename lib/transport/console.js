var util = require('util');

module.exports = function consoleTransport(options) {
    var _options = {};
    if(typeof options !== 'undefined') this._options = options;
    
    this.name = 'console';
    
    this.emitEvent = function(eventPackage) {
        console.log(util.inspect(eventPackage));
    }
    
    return this;
}