'use strict'

module.exports = window.angular
  .module('AlertManager', [])
  .factory('AlertManager', function($timeout) {
    'ngInject'
    var service = {
      list: [],
      add: function(text, delay) {
        if (service.list.length >= 1) service.list.splice(0, 1)

        service.list.push(text)
        $timeout(function() {
          if (delay < 0) return
          service.list.splice(0, 1)
        }, (delay || 5) * 1000)
      },
      addNotification: function(text) {
        service.list.splice(0, 1)
        service.list.push(text)
      },
      del: function() {
        service.list.splice(0, 1)
      }
    }
    return service
  }).name
