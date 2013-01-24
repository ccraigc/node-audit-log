var async = require('async');

function AuditLog() {
    this._transports = [];
    this._plugins = [];

    if ( AuditLog.prototype._singletonInstance ) {
        return AuditLog.prototype._singletonInstance;
    }
    AuditLog.prototype._singletonInstance = this;

    this.addTransport = function(transport, options) {
        console.log('hello, you added a transport.');
        var myTransport = require('./transport/'+transport);
        //if(typeof options != 'undefined') myTransport.config(options);
        this._transports.push(new myTransport());
    }
    
    this.logEvent = function(actor, originator, action, label, object, description) {
        var eventPackage = this.buildLogPackage(actor, new Date(), originator, action, label, object, description);
        
        async.forEach(this._transports, function(transport, cb) {
            transport.emitEvent(eventPackage);
            cb(null);
        }, function(err) {
            return true;
        });
    }
    
    this.buildLogPackage = function(actor, date, originator, action, label, object, description) {
        return {
            actor: actor,
            date: date,
            originator: originator,
            action: action,
            label: label,
            object: object,
            description: description
        };
    }
/*
actor - time - originator - action - label - object - description

<craig> - 10:30am - mongoose - update - users - <john.doe> - changed password, name
<craig> - 10:25am - route - GET - /manager/users/edit - <john.doe> - n/a

    recordEvent: function(actor, time, originator, action, label, object, description) {
        // utilize correct transport based on initial setup.
        console.log('logging: '+message+' for: '+userId);
    }
*/
}

module.exports = AuditLog;