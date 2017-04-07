'use strict';

require('angular-mocks');

module.exports = angular.module('mocks', ['ngMockE2E'])
  .config(function($provide) {
    var proxyDelay = 10;
    $provide.decorator('$httpBackend', function($delegate) {
        var proxy = function(method, url, data, callback, headers) {
            var interceptor = function() {
                var self = this,
                    _arguments = arguments;
                setTimeout(function() {
                    callback.apply(self, _arguments);
                }, proxyDelay);
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for(var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });
  })

  .config(function ($httpProvider) {
    //$httpProvider.interceptors.push(require('./REST.mock'));
  })
  .run(function ($httpBackend) {
    $httpBackend.whenGET('/api/').respond(require('./api')());
    $httpBackend.whenGET(/^.*\//).passThrough();
  })
  .name;
