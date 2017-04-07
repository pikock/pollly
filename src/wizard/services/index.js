/*global require module */
/**
 * for orson by thierry_c
 */
'use strict'

module.exports = angular.module('services', [
  // require('./dep'),
])
  /* set storagekey */

  .factory('Tools', function (AppConfig) {
    'ngInject'

    var service = {
      array: {},
      string: {}
    }
    service.array.random = function (myArray) {
      // Return position
      return Math.floor(Math.random() * myArray.length)
    }

    service.string.isEmpty = function (value) {
      return angular.isUndefined(value) || value === '' || value === null || value !== value
    }

    return service
  })

  

  .factory('AlertManager', function ($timeout) {
    'ngInject'
    var service = {
      list: [],
      add: function (text, delay) {
        if (service.list.length >= 1) service.list.splice(0, 1)

        service.list.push(text)
        $timeout(function () {
          if (delay < 0) return
          service.list.splice(0, 1)
        }, (delay || 5) * 1000)
      },
      addNotification: function (text) {
        service.list.splice(0, 1)
        service.list.push(text)
      },
      del: function () {
        service.list.splice(0, 1)
      }
    }
    return service
  })

  .factory('GenericDatas', function (localStorageService, $q, $http,AlertManager) {
    'ngInject'

    var service = {
      fr: {},
      es: {}
      

    }

    service.fr.get = function(){
      return {
          "fr": {
              
              "toto": {
                "tutu": {
                  "caca": "prout"
                }
              },
              "page_disabled": {
                  "caca": "L'accès à votre site d'administration Orson a été désactivé",
                  "bo_disabled_message": "Merci de nous contacter pour plus d'information",
                  "dada": "dadada"
              }
          }
      }
    }

    service.es.get = function(){
      return {
          "es": {
              "toto": {
                "tutu": {
                  "caca": "prout"
                }
              },
              "page_disabled": {
                  "bo_disabled_title": "L'accès à votre site d'administration Orson a été désactivé",
                  "bo_disabled_message": "Gdyguyaghdyuaga"
              }
          }
      }
    }


    return service
  })
  .name
