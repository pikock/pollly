/* global require module */

module.exports = function($stateProvider, $urlRouterProvider, AppConfig) {
  'ngInject'
  'use strict'
  $stateProvider
    .state('editor', {
      abstract: true,
      views: {
        '@': {
          template: require('./home/index.html'),
          controller: require('./editor/editor.controller')
        }
      }
    })
    .state('editor.home', {
      url: '/',
      views: {
        '@editor': {
          template: require('./editor/index.html')
        }
      }
    })

  $urlRouterProvider.when('', '/')
  $urlRouterProvider.otherwise('/')
}
