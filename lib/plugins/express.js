/* ExpressPlugin
 *
 * A plugin middleware for AuditLog and Express that automates the propagation of event logging for Express requests
 *
 */
var ExpressPlugin = function(options) {

    this._userId = null;
    this._options = {
        auditLog:null,          // instance of AuditLog
        userIdPath:null         // tell the plugin how to find the current user's ID in the request parameter. string or array of property names.
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
     * This is standard Express middleware that will intercept requests and log them.
     *
     */
    this.middleware = function(req, res, next) {
        console.log(req.user);
        if(typeof self._options.userIdPath === 'string' && self._options.userIdPath.length) {
            // if the id path was a string, convert it to an array
            self._options.userIdPath = [self._options.userIdPath];
        }
        
        if(typeof self._options.userIdPath === 'array' && self._options.userIdPath.length) {
            // loop through the user id path as long as the path exists
            self._userId = req;
            for(var key in self._options.userIdPath) {
                self._userId = userId[key] || false;
                if(!self._userId) break;
            }
            // pass the user id back to AuditLog for usage across other internal resources.
            if(self._userId) self._options.auditLog._userId = self._userId;
        }

        self._options.auditLog.logEvent(self._userId, 'express', req.method, req.url); //req.route); // no object or description currently
        
        return next();
    }

};

exports = module.exports = ExpressPlugin