/* ExpressPlugin
 *
 * A plugin middleware for AuditLog and Express that automates the propagation of event logging for Express requests
 *
 * whitelist and blacklist can contain:
 *     - regular expressions describing paths, or
 *     - objects with this structure:
 *         {
 *             regex: /^\/my\/interesting\/path\/.*$/, // a path description
 *             methods: ['GET', 'POST', 'PUT', 'DELETE'] // which http methods are allowed
 *          }
 */
var ExpressPlugin = function(options) {

    this._userId = null;
    this._options = {
        auditLog:null,          // instance of AuditLog
        userIdPath:null,        // tell the plugin how to find the current user's ID in the request parameter. string or array of property names.
        whiteListPaths:[],      // array of regular expressions for allowed paths. if none supplied, all paths are allowed.
        blackListPaths:[]       // array of regular expressions for excluded paths. if none supplied, all paths are allowed.
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
        var method = req.method,
            path = req.url;
        
        // verify the path being requested is to be logged.
        if(!self.pathAllowed(path, method)) return next();
    
        if(typeof self._options.userIdPath == 'string' && self._options.userIdPath.length) {
            // if the id path was a string, convert it to an array
            self._options.userIdPath = [self._options.userIdPath];
        }
        if(self._options.userIdPath.length) {
            // loop through the user id path as long as the path exists
            self._userId = req;
            for(var keyIndex in self._options.userIdPath) {
                var key = self._options.userIdPath[keyIndex];
                self._userId = self._userId[key] || false;
                if(!self._userId) break;
            }
            // pass the user id back to AuditLog for usage across other internal resources.
            if(self._userId) self._options.auditLog._userId = self._userId;
        }

        self._options.auditLog.logEvent(self._userId, 'express', method, path); // no object or description currently
        
        return next();
    }


    /* pathAllowed( path, method )
     *
     * Check the requested path and method against the whitelist and blacklist options,
     * return boolean representing whether logging this request is allowed.
     *
     */
    this.pathAllowed = function(path, method) {
        var matched, i, x;
        
        if(self._options.whiteListPaths.length) {

            // if any whiteListPaths are set, the path must match at least one
            matched = false;

            whiteListCheck:
            for(i=0; i<self._options.whiteListPaths.length; i++) {
                var rule = self._options.whiteListPaths[i];

                if(rule instanceof RegExp) {
                    rule = {
                        regex: rule
                        // no methods supplied, all methods
                    };
                }
                
                if(path.match(rule.regex)) {
                    if(rule.methods) {
                       for(x=0; x<rule.methods.length; x++) {
                           if(method.toUpperCase() == rule.methods[x].toUpperCase()) {
                               matched = true;
                               break whiteListCheck;
                           }
                       }
                    } else {
                        matched = true;
                        break whiteListCheck;
                    }
                }
            }
            
            if(!matched) return false;
        }
        
        if(self._options.blackListPaths.length) {

            // if any blackListPaths are set, the path must NOT match any
            matched = false;

            blackListCheck:
            for(i=0; i<self._options.blackListPaths.length; i++) {
                var rule = self._options.blackListPaths[i];
                
                if(rule instanceof RegExp) {
                    rule = {
                        regex: rule
                        // no methods supplied, all methods
                    };
                }
                
                if(path.match(rule.regex)) {
                    if(rule.methods) {
                        for(x=0; x<rule.methods.length; x++) {
                            if(method.toUpperCase() == rule.methods[x].toUpperCase()) {
                                matched = true;
                                break blackListCheck;
                            }
                        }
                    } else {
                        matched = true;
                        break blackListCheck;
                    }
                }
            }
            
            if(matched) return false;
        }
        
        return true;
    }
};

exports = module.exports = ExpressPlugin;