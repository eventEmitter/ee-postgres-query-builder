!function(){

    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , type          = require('ee-types')
        , QueryBuilder  = require('../../ee-query-builder').QueryBuilder;


    // the query builder implemetns the postgres syntax
    // we don't need to extend
    module.exports = QueryBuilder
}();
