/*global require module */

module.exports = function ($stateProvider, $urlRouterProvider, AppConfig) {
  'ngInject';
  'use strict';
  $stateProvider.state('editor', {
    abstract: true,
    views: {
      '@': {
        template: require('./home/index.html'),
        controller: require('./editor/editor.controller')
      },
      '@editor': {
        template: require('./home/main.html'),
      },
      'footer@editor': {
        template: require('./footer/index.html')
      },
      'header@editor': {
        template: require('./header/index.html'),
        controller: require('./header/header.controller')
      }
    }
  }).state('editor.home', {
    url: '/home',
    data: {
      progress: 1
    },
    views: {
      '@editor': {
        template: require('./editor/index.html')
      }
    }
  });

  $urlRouterProvider.when('', '/home');
  $urlRouterProvider.otherwise('/home');
};
