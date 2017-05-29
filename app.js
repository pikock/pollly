/* global require angular module */
'use strict'
require('angular')
require('angular-local-storage')
require('angular-easyfb')
require('angular-sanitize')
require('./assets/styles/main.less')

angular
  .module('ymlEditor', [
    require('angular-ui-router'),
    require('angular-ui-bootstrap'),
    require('./editor'),
    require('angular-translate')
  ])
  .constant('AppConfig', {})
  .config(require('./app.routes'))
  .config(require('./app.config'))
  // .run([
  //   '$rootScope',
  //   '$state',
  //   '$stateParams',
  //   '$document',
  //   function ($rootScope, $state, $stateParams, $document) {
  //     'ngInject'
  //     $rootScope.$state = $state
  //     $rootScope.$stateParams = $stateParams
  //   }
  // ])
  .config([
    '$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|tel|file|blob):/
      )
    }
  ])

var app = {
  initialize: function () {
    this.angularBootstrap()
  },
  angularBootstrap: function () {
    var self = this
    angular.element(document).ready(function () {
      self.onDeviceReady()
    })
  },
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },
  onDeviceReady: function () {
    angular.bootstrap(document, ['ymlEditor'])
  }
}

app.initialize()
