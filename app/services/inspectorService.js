var angular = require("angular");

angular.module("app.spinalcom").factory("inspectorService", [
  "$q",
  "ngSpinalCore",
  "spinalModelDictionary",
  "$routeParams",
  function($q, ngSpinalCore, spinalModelDictionary, $routeParams) {
    var next = null;
    let factory = {};
    let path = null;

    factory.init = () => {
      return spinalModelDictionary.init().then(model => {
        path = $routeParams.filepath;
        if (path) {
          path = atob(path);
        }

        console.log(model);
        return model;
      });
    };
    factory.setNext = _next => {
      next = _next;
    };

    factory.getPath = () => {
      return factory.init().then(() => {
        return path;
      });
    };

    factory.getModel = () => {
      return factory.init().then(m => {
        if (next !== null) {
          let tmp = next;
          next = null;
          return tmp;
        }
        return m;
      });
    };

    return factory;
  }
]);
