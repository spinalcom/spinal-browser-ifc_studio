var angular = require("angular");

angular.module("app.route").config([
  "$routeProvider",
  function($routeProvider) {
    $routeProvider
      .when("/home/:filepath", {
        templateUrl: "app/templates/main.html",
        authenticate: true,
        controller: "mainCtrl"
      })
      .when("/404", {
        authenticate: false,
        controller: [
          "$location",
          function($location) {
            $location.replace("/drive/");
          }
        ]
      })
      .otherwise({
        redirectTo: "/404"
      });
  }
]);
