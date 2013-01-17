var AuditLog = exports = module.exports.AuditLog = function AuditLog() {
    
}

AuditLog.prototype = {
    log: function(message, userId) {
        console.log('logging: '+message+' for: '+userId);
    }
    
    
}