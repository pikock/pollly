var YAMLJS = require("js-yaml");

module.exports = angular
  .module("directives", [])
  .directive("orAlert", function() {
    "ngInject";
    "use strict";
    return {
      template: require("../alerts/index.html"),
      scope: {
        alerts: "=orAlert"
      },
      controller: require("../alerts/alert.controller.js"),
      link: function(scope, element, attr) {}
    };
  })
  .directive("fileread", [
    function() {
      return {
        link: function(scope, element, attributes) {
          element.bind("change", function(changeEvent) {
            console.log(
              "Changevent filename",
              changeEvent.target.files[0].name
            );
            var reader = new FileReader();
            reader.onload = function(loadEvent) {
              scope.$apply(function() {
                scope.fileread = YAMLJS.safeLoad(loadEvent.target.result);
                scope.$emit("filereaded", {
                  datas: scope.fileread,
                  state: attributes.fileread,
                  filename: changeEvent.target.files[0].name
                });
              });
            };
            reader.readAsText(changeEvent.target.files[0]);
          });
        }
      };
    }
  ]).name;
