/* ExpressAPIPlugin
 *
 * A plugin middleware for AuditLog and Express that exposes endpoints containing JSON log data.
 *
 */
var ExpressAPIPlugin = function(options) {

    this._options = {
        auditLog:null          // instance of AuditLog
    };
    
    //override default options with the provided values
    if(typeof options !== 'undefined') {
        for(var attr in options) {
            this._options[attr] = options[attr];
        }
    }
    
    var self = this;

    /* middleware
     *
     * This is standard Express middleware that will add routes for api methods
     *
     */
    this.middleware = function(req, res, next) {
        var method = req.method,
            path = req.url;
        
        return next();
    }
};

exports = module.exports = ExpressAPIPlugin;