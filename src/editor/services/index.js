/*global require module */
/**
 * for orson by thierry_c
 */
"use strict";

module.exports = angular
  .module("services", [])
  /* set storagekey */

  .factory("Tools", function(AppConfig) {
    "ngInject";
    var service = {
      array: {},
      string: {}
    };
    service.array.random = function(myArray) {
      // Return position
      return Math.floor(Math.random() * myArray.length);
    };

    service.string.isEmpty = function(value) {
      return (
        angular.isUndefined(value) ||
        value === "" ||
        value === null ||
        value !== value
      );
    };

    return service;
  })
  .factory("AlertManager", function($timeout) {
    "ngInject";
    var service = {
      list: [],
      add: function(text, delay) {
        if (service.list.length >= 1) service.list.splice(0, 1);

        service.list.push(text);
        $timeout(function() {
          if (delay < 0) return;
          service.list.splice(0, 1);
        }, (delay || 5) * 1000);
      },
      addNotification: function(text) {
        service.list.splice(0, 1);
        service.list.push(text);
      },
      del: function() {
        service.list.splice(0, 1);
      }
    };
    return service;
  }).name;
