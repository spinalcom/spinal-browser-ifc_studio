window.angular.module("app.spinalcom").factory("spinalModelDictionary", [
  "$q",
  "ngSpinalCore",
  "config",
  "authService",
  "$routeParams",
  "$location",
  function($q, ngSpinalCore, config, authService, $routeParams, $location) {
    let factory = {};
    factory.model = 0;
    var deferred = null;

    factory.init = () => {
      if (deferred) return deferred.promise;
      deferred = $q.defer();
      authService.wait_connect().then(
        () => {
          let path = $routeParams.filepath;
          if (path) {
            path = atob(path);
            console.log(path);
            ngSpinalCore.load(path).then(
              m => {
                factory.model = m;
                console.log(m);
                deferred.resolve(m);
              },
              () => {
                let msg = "not able to load : " + path;
                console.error(msg);
                $location.replace("/drive/");
                deferred.reject(msg);
              }
            );
          } else {
            $location.replace("/drive/");
          }
        },
        () => {
          console.log(path);
          let path = $routeParams.filepath;
          if (path) {
            path = atob(path);
            let msg = "not able to load : " + path;
            console.error(msg);
            deferred.reject(msg);
          }
          $location.replace("/drive/");
        }
      );
      return deferred.promise;
    };
    return factory;
  }
]);
