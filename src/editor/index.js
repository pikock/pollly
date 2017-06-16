/* global module require */

'use strict'

module.exports = window.angular
  .module('editor', [
    require('./directives/OrAlert'),
    require('./services/AlertManager'),
    require('./directives/FileRead'),
    require('./controllers/exportController')
  ])
  .factory('editorService', function() {
    'ngInject'
    var service = {}
    return service
  }).name
