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
    "AlertManager",
    function(AlertManager) {
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
                try {
                  scope.fileread = YAMLJS.safeLoad(loadEvent.target.result);
                } catch (e) {
                  if (e.reason === "duplicated mapping key") {
                    AlertManager.add({
                      type: "danger",
                      msg: "Duplicate Key"
                    });
                  } else {
                    AlertManager.add({
                      type: "danger",
                      msg: "Unknown error"
                    });
                  }
                }

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
