(function(){

    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , type          = require('ee-types')
        , QueryBuilder  = require('related-query-builder');


    // the query builder implemetns the postgres syntax
    // we don't need to extend
    module.exports = new Class({
        inherits: QueryBuilder.Functions



        /**
         * SQL like statement
         *
         * @param <Object>  instruction
         */
        , jsonValue: function(command, parameters, property, entity) {
            var   typeCast = command.path.indexOf('::')
                , id = (entity || '')+this._escapeId(property)
                , path;

            if (typeCast >= 0) {
                path = command.path.slice(0, typeCast);
                typeCast = command.path.slice(typeCast+2);

                if (/[^a-z0-9]/gi.test(typeCast)) typeCast = null;
            }
            else {
                path = command.path;
                typeCast = false;
            }

            // parameterize
            path = path.split('.').map(function(identifier) {
                return parameters.set(property+'_'+identifier, identifier, true);
            }.bind(this)).join(', ');

            return 'json_extract_path_text('+id+', '+path+')'+(typeCast ? '::'+typeCast : '');
        }
    });
})();
