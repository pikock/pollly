'use strict'

module.exports = window.angular
  .module('AlertManager', [])
  .factory('AlertManager', $timeout => {
    'ngInject'
    var service = {
      list: [],
      add: (text, delay) => {
        if (service.list.length >= 1) service.list.splice(0, 1)

        service.list.push(text)
        $timeout(() => {
          if (delay < 0) return
          service.list.splice(0, 1)
        }, (delay || 5) * 1000)
      },
      addNotification: text => {
        service.list.splice(0, 1)
        service.list.push(text)
      },
      del: () => {
        service.list.splice(0, 1)
      }
    }
    return service
  }).name
