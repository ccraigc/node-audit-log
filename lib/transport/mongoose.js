var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function mongooseTransport(options) {
    this.name = 'mongoose';

    this._options = { collectionName:'auditLog' };

    if(typeof options !== 'undefined') {
        for(var attr in options) {
            this._options[attr] = options[attr];
        }
    }

    this.modelSchema = new Schema({
        actor: {type:String},
        date: {type:Date},
        originator: {type:String},
        action: {type:String},
        label: {type:String},
        object: {type:String},
        description: {type:String}
    });
    
    this.model = mongoose.model(this._options.collectionName, this.modelSchema);


    

    this.emitEvent = function(eventPackage) {
        console.log('mongoose emitEvent');
        var newEvent = new this.model(eventPackage);
        newEvent.save(function(err) {
            if(err) {
                console.log('audit-log - error sending event to database: '+err);
            } else {
                console.log('audit-log - done saving object');
            }
        });
    }


    return this;
}