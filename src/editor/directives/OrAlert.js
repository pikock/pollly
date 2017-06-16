module.exports = window.angular
  .module('OrAlert', [])
  .directive('orAlert', function() {
    'ngInject'
    'use strict'
    return {
      template: require('../alerts/index.html'),
      scope: {
        alerts: '=orAlert'
      },
      controller: require('../alerts/alert.controller.js'),
      link: function(scope, element, attr) {}
    }
  }).name
