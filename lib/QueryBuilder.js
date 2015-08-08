(function() {
    'use strict';


    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , type          = require('ee-types')
        , QueryBuilder  = require('related-query-builder').QueryBuilder
        , Functions     = require('./Functions');


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
        , init: function init(options, FunctionsConstructor) {
            init.super.call(this, options, Functions);
        }
    });
})();
