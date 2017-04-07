/*global require module */

module.exports = function ($stateProvider, $urlRouterProvider, $animateProvider, AppConfig) {
  'ngInject';
  'use strict';
  $animateProvider.classNameFilter(/animate-/);

  

  $stateProvider.state('wizard', {
    abstract: true,
    // onEnter: require('./accueil/accueil.service'),
    views: {
      '@': {
        template: require('./home/index.html'),
        controller: require('./wizard/wizard.controller')
      },
      'debug@': {
        template: require('./debug/index.html')
      },
      '@wizard': {
        template: require('./home/main.html'),
      },
      'footer@wizard': {
        template: require('./footer/index.html')
      },
      'header@wizard': {
        template: require('./header/index.html'),
        controller: require('./header/header.controller')
      }
    }
  }).state('wizard.home', {
    url: '/home',
    data: {
      progress: 1
    },
    views: {
      '@wizard': {
        template: require('./wizard/index.html')
      }
    }
  });

  $urlRouterProvider.when('', '/home');
  $urlRouterProvider.otherwise('/home');
};
