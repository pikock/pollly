/*global require angular module */
'use strict'

require('angular')
require('angular-animate')
require('angular-ui-bootstrap')
require('angular-ui-router')
require('angular-local-storage')
require('angular-easyfb')
require('angular-translate')
require('angular-sanitize')
require('angular-bootstrap-colorpicker')
require('./editor')

var dependencies = ['ngAnimate', 'ui.router', 'ui.bootstrap', 'LocalStorageModule', 'editor', 'colorpicker.module', 'ezfb', 'pascalprecht.translate', 'ngSanitize']

angular.module('ymlEditor', dependencies)
  .constant('AppConfig',{})
  .config(require('./app.routes'))
  .config(require('./app.config'))
  .run(function ($rootScope, $state, $stateParams, $document) {
  'ngInject'
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams
})

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
