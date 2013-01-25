var async = require('async'),
    util = require('util');

function AuditLog() {
    this._transports = [];
    this._plugins = [];
    this._debug = true;

    if ( AuditLog.prototype._singletonInstance ) {
        return AuditLog.prototype._singletonInstance;
    }
    AuditLog.prototype._singletonInstance = this;

    this.addTransport = function(transport, options) {
        if(this._debug) console.log('audit-log - new transport added: '+transport+'('+util.inspect(options)+')');
        
        var myTransport = require('./transport/'+transport);
        this._transports.push(new myTransport(options));
    }
    
    /* log( actor, action, label, object, description )
     *
     * - for direct, manual logging of events, use this "public" function.
     *
     * (for a description of the arguments look at logEvent)
     *
     */
    this.log = function(actor, action, label, object, description) {
        return this.logEvent(actor, 'audit-log', action, label, object, description);
    }


    /* logEvent( actor, originator, action, label, object, description )
     *
     * "private" function that emits the events to all transports in use.
     * used by the manual log call and any logging handled by plugins.
     *
     * - actor : represents the initiator of this event (e.g., a user id, process name, etc.)
     * - originator : the source plugin of the event
     * - action : what action the event represents
     * - label : what type of entity the object is (e.g., 'users', a route, etc.)
     * - object : the object that was affected or the target recipient of this event
     * - description : additional information (e.g., 'changed password, name fields')
     *
     * examples:
     *
     *   actor - time - originator - action - label - object - description
     *   <craig> - 10:30am - mongoose - update - users - <john.doe> - changed password, name
     *   <craig> - 10:25am - route - GET - /manager/users/edit - <john.doe> - n/a
     */
    this.logEvent = function(actor, originator, action, label, object, description) {
        var eventPackage = this.buildLogPackage(actor, new Date(), originator, action, label, object, description);
        
        async.forEach(this._transports, function(transport, cb) {
            transport.emitEvent(eventPackage);
            cb(null);
        }, function(err) {
            return true;
        });
    }
    
    
    /* buildLogPackage( actor, date, originator, action, label, object, description )
     *
     * returns an object containing event options for transmission to transports
     */
    this.buildLogPackage = function(actor, date, originator, action, label, object, description) {
        var defaults = { actor: '', date: new Date(), originator: '', action: '',
            label: '', object: '', description: '' };

        return {
            actor: actor || defaults.actor,
            date: date || defaults.date,
            originator: originator || defaults.originator,
            action: action || defaults.action,
            label: label || defaults.label,
            object: object || defaults.object,
            description: description || defaults.description
        };
    }
}

module.exports = new AuditLog();