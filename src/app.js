/*global require angular module */
'use strict'

require('angular')
require('angular-animate')
require('angular-ui-bootstrap')
require('angular-ui-router')
require('angular-local-storage')

require('./wizard')

require('angular-easyfb')
require('angular-translate')
require('angular-sanitize')
require('angular-bootstrap-colorpicker')

var dependencies = ['ngAnimate', 'ui.router', 'ui.bootstrap', 'LocalStorageModule', 'wizard', 'colorpicker.module', 'ezfb', 'pascalprecht.translate', 'ngSanitize']

// TO DO TSIFEI
// if (process.env.NODE_ENV !== 'production') {
//     dependencies.push(require('./mocks'))
// }

// console.log(process.env.NODE_ENV)

angular.module('orsonLiftWizard', dependencies)

  .constant('AppConfig',{
    current_env: process.env.NODE_ENV,
    facebook : {
      dev: '1307602376002847',
      staging: '1309145495848535',
      production: '239545502808545'
    },
    orsonificator: {
      dev: 'http://localhost:8080/api',
      staging: 'https://orsonificator-test.appspot-preview.com/api',
      production: 'https://authentic-ether-162317.appspot.com/api'
    },
    unsplash: {
      dev: 'https://api.unsplash.com/photos/?client_id=cdf052c488e7dd5be4722a3a3578df9ba65196d376ba250ab570e3c075018045&per_page=30&page=#',
      staging: 'https://api.unsplash.com/photos/?client_id=cdf052c488e7dd5be4722a3a3578df9ba65196d376ba250ab570e3c075018045&per_page=30&page=#',
      production: 'https://api.unsplash.com/photos/?client_id=cdf052c488e7dd5be4722a3a3578df9ba65196d376ba250ab570e3c075018045&per_page=30&page=#'
    },
    secure: {
      dev: 'http://localhost:3001',
      staging: 'https://roubles.pikock.com',
      production: 'https://secure.orson.io'
    },
    endpoints: {
      subscriptions: '/subscriptions/',
      user_build: '/users/build/',
      facebook_build: '/build/facebook/',
      oneOnone: '/build/'
    }
  })

  .config(require('./app.routes'))
  .config(require('./app.config'))
  .config(function (localStorageServiceProvider) {
    'ngInject'
    localStorageServiceProvider.setPrefix('OrsonLiftWizard')
    localStorageServiceProvider.setNotify(true, true)
  }).config(function ($locationProvider) {
  'ngInject'
// $locationProvider.html5Mode(true)
}).run(function ($rootScope, $state, $stateParams, $document) {
  'ngInject'
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams

  if (process.env.NODE_ENV !== 'production') {
    $rootScope.debug = true

    /* Route debug */
    //         $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //             console.log('$stateChangeStart to ' + toState.name + '- fired when the transition begins. toState,toParams : \n', toState, toParams)
    //         })
    //         $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    //             console.log('$stateChangeError - fired when an error occurs during transition.')
    //             console.log(arguments)
    //         })
    //         $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    //             console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.')
    //         })

    //         /*
    //       $rootScope.$on('$viewContentLoading', function(event, viewConfig) {
    //           // runs on individual scopes, so putting it in "run" doesn't work.
    //           console.log('$viewContentLoading - view begins loading - dom not rendered', viewConfig)
    //       })
    // */

    //         $rootScope.$on('$viewContentLoaded', function(event) {
    //             console.log('$viewContentLoaded - fired after dom rendered', event)
    //         })

    //         $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
    //             console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.')
    //             console.log(unfoundState, fromState, fromParams)
    //         })

  }

  $rootScope.agent = 'browser'
  angular.element($document[0].body).addClass('platform-browser')

  if (navigator.userAgent.match(/Android/i)) {
    $rootScope.platform = 'android'
    angular.element($document[0].body).addClass('platform-android')
  } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    $rootScope.platform = 'iOS'
    angular.element($document[0].body).addClass('platform-iOS')
  }

  if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|Tizen/i)) {
    $rootScope.device = 'mobile'
    angular.element($document[0].body).addClass('platform-mobile')
  } else {
    $rootScope.device = 'desktop'
    angular.element($document[0].body).addClass('platform-desktop')
  }
})

var app = {
  // Application Constructor
  initialize: function () {
    this.angularBootstrap()
  },
  // Bind Event document Ready
  angularBootstrap: function () {
    var self = this
    angular.element(document).ready(function () {
      self.onDeviceReady()
    })
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },
  // deviceready Event Handler
  //
  onDeviceReady: function () {
    angular.bootstrap(document, ['orsonLiftWizard'])
  }
}

app.initialize()
