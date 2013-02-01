/* MongoosePlugin
 *
 * A plugin middleware for AuditLog and Mongoose that automates the propagation of event logging for Mongoose callbacks
 *
 */
var MongoosePlugin = function(options) {

    this._options = {
        auditLog:null,          // instance of AuditLog
        modelName:'untitled',   // string name of model
        namePath:null,          // path to readable object name field
        idPath:'_id',           // path to unique ID field
        versionPath:'__v',      // path to mongoose object version number
        debug: false,           // show debug messages
        storeDoc: ['remove']    // name of callbacks that should store document in description field, if any
    };

    // override default options with the provided values
    if(typeof options !== 'undefined') {
        for(var attr in options) {
            this._options[attr] = options[attr];
        }
    }

    var self = this;
    
    /* handler
     *
     * This is a mongoose plugin-able handler function.  Example:
     *
     * var auditFn = auditLog.getPlugin('mongoose', {modelName:'myModel', namePath:'title'});
     * MySchema.plugin(auditFn.handler);
     *
     */
    this.handler = function(schema, options) {

        /*
         * save callback
         *
         */
        schema.post('save', function (doc) {
            var docObj = doc.toObject(),
                description = '';

            if(self._options.storeDoc.indexOf('save') >= 0) {
                description = JSON.stringify(docObj);
            } else {
                if(docObj[self._options.versionPath] == 0) {
                    description = 'Created "'+docObj[self._options.namePath]+'"';
                } else {
                    description = 'Updated "'+docObj[self._options.namePath]+'"';
                }
            }
            
            self._options.auditLog.logEvent(null, 'mongoose', 'save', self._options.modelName, docObj[self._options.idPath], description);
        });
        
        /*
         * remove callback
         *
         */
        schema.post('remove', function(doc) {
            var docObj = doc.toObject(),
                description = '';

            if(self._options.storeDoc.indexOf('remove') >= 0) {
                description = JSON.stringify(docObj);
            } else {
                description = 'Removed "'+docObj[self._options.namePath]+'"';
            }
            self._options.auditLog.logEvent(null, 'mongoose', 'remove', self._options.modelName, docObj[self._options.idPath], description);
        });
    }
}

exports = module.exports = MongoosePlugin;