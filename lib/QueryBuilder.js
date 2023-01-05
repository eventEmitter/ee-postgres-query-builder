(function() {
    'use strict';


    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , type          = require('ee-types')
        , QueryBuilder  = require('related-query-builder');


    /**
     * takes a query object and returns a sql string
     */


    module.exports = new Class({
        inherits: QueryBuilder

            



        /**
         * class constructor
         *
         * @param <Object> contains the esacpe and escapeid function
         */
        , init: function init(connection, parameters) {


            init.super.call(this, connection, parameters);


            // parameters must must be parameterized on a vendor specific manner
            this.parameters.renderParameter = this.renderParameter.bind(this);

            // set counter variable
            this.parameterIndex = 0;
        }





        , renderParameter: function() {
            return '$'+(++this.parameterIndex);
        }


 



        /**
         * SQL like statement
         *
         * @param <Object>  instruction
         */
        , jsonValue: function(command, property, entity) {
            var   typeCast = command.path.indexOf('::')
                , id = (entity || '')+this.escapeId(property)
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
                return this.parameters.set(property+'_'+identifier, identifier, true);
            }.bind(this)).join(', ');

            return 'json_extract_path_text('+id+', '+path+')'+(typeCast ? '::'+typeCast : '');
        }






        /**
         * build a create query
         *
         * @param <object> query
         */
        , _buildCreateQuery: function(query) {
            if (type.string(query.schema)) {
                if (!query.database) return Promise.reject(new Error('You have to specify in which database to create the schema!'));
                else return Promise.resolve(`SET search_path to ${this.escapeId(query.database)}; CREATE SCHEMA ${this.escapeId(query.schema)};`);
            }
            else if (type.string(query.database)) {
                return Promise.resolve('CREATE DATABASE '+this.escapeId(query.database)+';');
            }
            else {
                return Promise.reject(new Error('Unknown create statement!'));
            }
        }





        /**
         * build a drop query
         *
         * @param <object> query
         */
        , _buildDropQuery: function(query) {
            if (type.string(query.schema)) {
                 if (!query.database) return Promise.reject(new Error('You have to specify from which database to drop the schema!'));
                else return Promise.resolve(`SET search_path to ${this.escapeId(query.database)}; DROP SCHEMA ${this.escapeId(query.schema)} CASCADE;`);;
            }
            else if (type.string(query.database)) {
                return Promise.resolve('DROP DATABASE '+this.escapeId(query.database)+';');
            }
            else {
                return Promise.reject(new Error('Unknown drop statement!'));
            }
        }



        /**
         * SQL in statement
         *
         * @param <Object>  instruction
         */
        , in: function(command) {
            var values = command.values;

            if (type.array(command.values) && command.values.length && type.object(command.values[0]) && type.function(command.values[0].isQuery)) values = values[0];

            if (type.function(values.isQuery)) {
                return ' IN ('+this._renderSubQuery(values)+')';
            }
            else {
                if (values.length) {
                    var uniqueValues = Array.from(new Set(values.map(value => this.renderInValueValue(value))));
                    return ' = ANY (VALUES (' + uniqueValues.join('), (') +'))';
                } else return false;
            }
        }
    });
})();
