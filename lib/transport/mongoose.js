var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function mongooseTransport(options) {
    this.name = 'mongoose';

    this._options = { mongoose:null, collectionName:'auditLog' };

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
    
    this.model = this._options.mongoose.model(this._options.collectionName, this.modelSchema);
console.log(this.model);

    

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