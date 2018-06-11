var angular = require("angular");

angular.module("app.route", ["ngRoute"]);
angular.module("app.services", []);
angular.module("app.directives", []);
angular.module("app.controllers", []);
angular.module("app.spinalcom", ["settings", "ngMaterial"]);
angular.module("app.spinal-panel", []);
angular.module("app.FileExplorer", [
  "app.services",
  "app.spinalcom",
  "ngMaterial"
]);

angular
  .module("SpinalApp", [
    "ngAnimate",
    "ngMaterial",
    "app.directives",
    "app.route",
    "app.FileExplorer",
    "app.services",
    "app.controllers",
    "ngMdIcons",
    "settings",
    "app.spinalcom",
    "app.spinal-panel"
  ])
  .run([
    "$rootScope",
    "$location",
    "authService",
    function($rootScope, $location, authService) {
      let user = authService.get_user();
      $rootScope.$on("$routeChangeStart", function(event, next) {
        try {
          if (next.$$route && next.$$route.authenticate) {
            if (!authService.is_Connected()) {
              authService.login(user.username, user.password).then(
                function() {},
                function() {
                  $location.path("/login");
                }
              );
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  ])

  .config([
    "$mdThemingProvider",
    function($mdThemingProvider) {
      $mdThemingProvider
        .theme("altTheme")
        .primaryPalette("grey", {
          default: "200"
        })
        .accentPalette("grey", {
          default: "700"
        })
        .dark();
      $mdThemingProvider.theme("default").dark();

      $mdThemingProvider.setDefaultTheme("altTheme");
      $mdThemingProvider.theme("error-toast");
      $mdThemingProvider.alwaysWatchTheme(true);
    }
  ])
  .run([
    "$templateCache",
    "$http",
    function($templateCache, $http) {
      let load_template = (uri, name) => {
        $http.get(uri).then(
          response => {
            $templateCache.put(name, response.data);
          },
          () => {
            console.log("Cannot load the file " + uri);
          }
        );
      };
      let toload = [
        {
          uri: "app/templates/inspector.html",
          name: "inspector.html"
        }
      ];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }
    }
  ]);
