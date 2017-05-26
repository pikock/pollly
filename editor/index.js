/* global module require */

'use strict'

require('./services/AlertManager')
require('./directives/OrAlert')
require('./directives/FileRead')
require('./controllers/exportModal')

module.exports = window.angular
  .module('editor', ['OrAlert', 'AlertManager', 'FileRead', 'exportModal'])
  .factory('editorService', function () {
    'ngInject'
    var service = {}
    return service
  }).name
