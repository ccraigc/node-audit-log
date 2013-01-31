// Module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    util = require('util');

/* MongooseTransport
 *
 * A MongoDB storage handler for Audit-Log for Node.js
 *
 */
MongooseTransport = function(options) {
    this.name = 'mongoose';

    this._options = { collectionName:'auditLog', connectionString:'', debug: false };
    this._connection;

    // override default options with the provided values
    if(typeof options !== 'undefined') {
        for(var attr in options) {
            this._options[attr] = options[attr];
        }
    }

    // attempt to setup the db connection
    this._connection = mongoose.createConnection(this._options.connectionString, function (err) {
        if (err) {
            this.debugMessage("could not connect to DB: " + err);
        }
    });

    this.modelSchema = new Schema({
        actor: {type:String},
        date: {type:Date},
        origin: {type:String},
        action: {type:String},
        label: {type:String},
        object: {type:String},
        description: {type:String}
    });
    
    this.model = this._connection.model(this._options.collectionName, this.modelSchema);

    this.emit = function( dataObject ) {
        this.debugMessage('emit: '+util.inspect(dataObject));
        
        if(dataObject.logType && dataObject.logType == 'Event') {
            var newEvent = new this.model( dataObject );
            newEvent.save(function(err) {
                if(err) this.debugMessage('error saving event to database: '+err);
            });
        }
    }


    this.debugMessage = function(msg) { if(this._options.debug) console.log('Audit-Log(mongoose): '+msg); }

    return this;
}

exports = module.exports = MongooseTransport;