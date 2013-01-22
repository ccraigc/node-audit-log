var async = require('async');

var AuditLog = exports = module.exports.AuditLog = function AuditLog() {
    this._transports = [];
    this._plugins = [];
}

AuditLog.prototype = {

    addTransport: function(transport, options) {
        this._transports.push(transport);
        var myTransport = this.require('transports/'+transport);
        if(typeof options != 'undefined') myTransport.config(options);
    },

/*
actor - time - originator - action - label - object - description

<craig> - 10:30am - mongoose - update - users - <john.doe> - changed password, name
<craig> - 10:25am - route - GET - /manager/users/edit - <john.doe> - n/a

*/
    recordEvent: function(actor, time, originator, action, label, object, description) {
        // utilize correct transport based on initial setup.
        console.log('logging: '+message+' for: '+userId);
    }
    
    
}