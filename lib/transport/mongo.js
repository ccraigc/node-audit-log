/*

 this is all unfinished, going to skip to a mongoose transport layer since we're using that, specifically, anyway

*/

var mongodb = require('mongodb');

module.exports = function mongoTransport(options) {
    this.name = 'mongo';

    var _options = {
        collectionName:'auditLog',
        connection: null,
        
        
        host,
        port,
        serverOptions,
        dbName,
        server,
        dbOptions,
        
        dbConnection
    };

    if(typeof options !== 'undefined') {
        for(var attr in options) {
            this._options[attr] = options[attr];
        }
    }


    if( !this._options.connection ) {
        this._options.server = new mongodb.Server(this._options.host, this._options.port, this._options.serverOptions);
        this._options.connection = new mongodb.Db(this._options.dbName, this._options.server, this._options.dbOptions);
        dbConnection.open(function() {
            // connection open
        });
    }

    

    this.emitEvent = function(eventPackage) {
        console.log('need to send the object to db for '+eventPackage.action);
    }


    return this;
}