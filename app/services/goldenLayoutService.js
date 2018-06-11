var angular = require("angular");
var GoldenLayout = require("golden-layout");
var $ = require("jquery");

angular
  .module("app.services")
  .factory("goldenLayoutService", [
    "$q",
    "$window",
    "$templateCache",
    "$rootScope",
    "$compile",
    function($q, $window, $templateCache, $rootScope, $compile) {
      var config = {
        content: [
          {
            type: "row",
            content: [
              {
                isClosable: false,
                title: "Inspector",
                type: "component",
                componentName: "SpinalHome",
                componentState: {
                  template: "inspector.html",
                  controller: "InspectorCtrl"
                }
              }
            ]
          }
        ]
      };

      function wait_template(element, state, count = 0) {
        if (count > 50)
          console.error(
            "Error: imposible to retrive the template : " + state.template
          );
        let template = $templateCache.get(state.template);
        if (template) {
          element.html(
            '<div class="gpanel-content" ng-controller="' +
              state.controller +
              '" ng-cloak>' +
              $templateCache.get(state.template) +
              "</div>"
          );
          $compile(element.contents())($rootScope);
        } else {
          setTimeout(() => {
            wait_template(element, state, ++count);
          }, 100);
        }
      }

      let myLayout = 0;
      let factory = {};
      factory.init = () => {
        if (myLayout == 0) {
          myLayout = new GoldenLayout(config, $("#g-layout"));
          myLayout.registerComponent("SpinalHome", function(container, state) {
            var element = container.getElement();
            if (state.template == "") {
              element.html();
              $compile(element.contents())($rootScope);
            } else {
              wait_template(element, state);
            }
          });

          myLayout.init();
          angular.element($window).bind("resize", function() {
            myLayout.updateSize();
          });
          $rootScope.$emit("GoldenLayout_READY");
        }
      };

      factory.wait_ready = () => {
        return $q(function(resolve) {
          $rootScope.$on("GoldenLayout_READY", () => {
            resolve();
          });
        });
      };

      factory.createChild = config => {
        myLayout.root.contentItems[0].addChild(config);
      };

      factory.createDragSource = (element, config) => {
        myLayout.createDragSource(element, config);
      };

      factory.panels = [];
      factory.panels_watchers = [];
      factory.registerPanel = panel => {
        factory.panels.push(panel);
        for (var i = 0; i < factory.panels_watchers.length; i++) {
          factory.panels_watchers[i](factory.panels);
        }
      };
      factory.getPanels = () => {
        return factory.panels;
      };
      factory.watch_panel = fn => {
        if (factory.panels_watchers.length === 0) {
          factory.panels_watchers.push(fn);
          if (factory.panels.length != 0) {
            fn(factory.panels);
          }
          return;
        }
        let found = false;
        for (var i = 0; i < factory.panels_watchers.length; i++) {
          if (factory.panels_watchers[i] === fn) {
            found = true;
            break;
          }
        }
        if (found === false) factory.panels_watchers.push(fn);
      };

      return factory;
    }
  ])
  .factory("layout_uid", function() {
    let uid = 0;
    return {
      get: () => {
        let id = uid++;
        return id;
      }
    };
  });
