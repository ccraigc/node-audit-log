// Module dependencies
var async = require('async'),
    util = require('util');


/* AuditLog
 * 
 * Interface:
 *  - addTransport : add a storage or output methodology
 *  - logEvent : provides the preferred fields for event-type data as arguments
 *  - log : free-form logging mechanism
 *
 */
function AuditLog() {
    this._transports = [];
    this._plugins = [];
    this._debug = false;
    this._userId = null;

    // The Highlander
    if ( AuditLog.prototype._singletonInstance ) {
        return AuditLog.prototype._singletonInstance;
    }
    AuditLog.prototype._singletonInstance = this;


    /* addTransport( transport, options)
     *
     * Add a transport methodology by its name.
     * Note: you could add more than one of the same type of transport,
     * they will not overwrite each other, but work in parallel.
     *
     * - transport : string name of transport methodology
     * - options : object containing any setup properties
     *
     */
    this.addTransport = function(transport, options) {
        options = options || {};
        if(typeof options.debug == 'undefined') options.debug = this._debug; // debug inheritance
        
        this.debugMessage('added '+(typeof options != 'undefined' ? ' with options '+util.inspect(options) : ''), transport)
        
        var myTransport = require('./transport/'+transport);
        this._transports.push(new myTransport(options));
    }


    /* log( logData )
     *
     * If you are specifying your own structure, use this method.
     * If you do not specify a 'logType' property, it will be 'Generic'
     *
     */
    this.log = function( logData ) {
        logData.logType || (logData.logType = 'Generic');
        
        return this.emitData( logData );
    }


    /* logEvent( actor, action, label, object, description )
     *
     * For direct, manual logging of events, use this "public" function.
     *
     * - actor : represents the initiator of this event (e.g., a user id, process name, etc.)
     * - origin : the source plugin of the event
     * - action : what action the event represents
     * - label : what type of entity the object is (e.g., 'users', a route, etc.)
     * - object : the object that was affected or the target recipient of this event
     * - description : additional information (e.g., 'changed password, name' or JSON data)
     *
     * examples:
     *
     *   actor - time - origin - action - label - object - description
     *   <craig> - 10:30am - mongoose - update - users - <john.doe> - changed password, name
     *   <craig> - 10:25am - route - GET - /manager/users/edit - <john.doe> - n/a
     *
     */
    this.logEvent = function( actor, origin, action, label, object, description ) {
        
        if(!actor && this._userId) actor = this._userId; // set the actor if it wasn't provided.
        
        var eventPackage = this.buildEventPackage(actor, new Date(), origin, action, label, object, description);
        
        return this.emitData(eventPackage);
    }


    /* emitData( dataObject )
     *
     * Emits the log data to all transports in use.
     * used by the manual logEvent call and any logging handled by plugins.
     *
     * dataObject 
     */
    this.emitData = function( dataObject ) {
        async.forEach(this._transports, function(transport, cb) {
            transport.emit( dataObject );
            cb(null);
        }, function(err) {
            return true;
        });
    }
    
    
    /* buildEventPackage( actor, date, origin, action, label, object, description )
     *
     * returns an object containing event options for transmission to transports
     */
    this.buildEventPackage = function(actor, date, origin, action, label, object, description) {
        var defaults = { actor: '', date: new Date(), origin: '', action: '',
            label: '', object: '', description: '' };

        return {
            logType: 'Event',
            actor: actor || defaults.actor,
            date: date || defaults.date,
            origin: origin || defaults.origin,
            action: action || defaults.action,
            label: label || defaults.label,
            object: object || defaults.object,
            description: description || defaults.description
        };
    }


    /* getPlugin( pluginName, options )
     *
     * returns an instance of the plugin you 
     *
     */
    this.getPlugin = function(pluginName, options) {
        var plugin = require('./plugins/'+pluginName);
        if(plugin) {
            options = options || {};
            if(typeof options.debug == 'undefined') options.debug = this._debug; // debug inheritance
            options.auditLog = this;
            var myInstance = new plugin(options);
            return myInstance;
        } else {
            return false;
        }
    }
    
    
    /* debugMessage( msg [, source] )
     *
     * shows a console log message if debug is true.
     *
     */
    this.debugMessage = function(msg, source) {
        if(this._debug) {
            var fullMessage = 'Audits-Log';
            if(typeof source != 'undefined') {
                fullMessage += '('+source+')';
            }
            fullMessage += ': '+msg;
            console.log(fullMessage);
        }
    }
}

// expose yourself.

exports = module.exports = new AuditLog();