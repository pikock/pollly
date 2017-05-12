/* global module require */
/**
 * for orson by thierry_c
 */
'use strict'

require('./services/AlertManager')
require('./directives/OrAlert')
require('./directives/FileRead')

module.exports = window.angular
  .module('editor', ['OrAlert', 'AlertManager', 'FileRead'])
  .value('storageKey', 'ymlEditor')
  .factory('editorService', function () {
    'ngInject'
    var service = {}
    return service
  }).name
