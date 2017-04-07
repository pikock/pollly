/*global module require */
/**
 * for orson by thierry_c
 */
'use strict';

require('./services');
require('./directives');


module.exports = angular.module('editor', [
  // require('./dep'),
  'services', 'directives'
])
  /* set storagekey */
  .value('storageKey', 'ymlEditor')
  .factory('editorService', function ($rootScope, $exceptionHandler, $window, storageKey) {
    'ngInject';

    var service = {}
    return service
  })
  .name
