//var util = require('util');

module.exports = function consoleTransport() {

    this.name = 'console';

    this.transport = function(actor, time, originator, action, label, object, description) {
        console.log(originator+' says: '+actor+' ('+time+') did '+action+': '+label+' ('+object+') "'+description+'"');
    }
    
    this.config = function(options) {
        console.log("this transport doesn't accept any options, but it was passed: "+util.inspect(options));
    }
    
    return this;
}