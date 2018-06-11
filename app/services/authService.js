var angular = require("angular");

angular.module("app.spinalcom").factory("authService", [
  "$q",
  "ngSpinalCore",
  "config",
  "$http",
  function($q, ngSpinalCore, config, $http) {
    let factory = {};
    let user = {
      username: "",
      password: ""
    };
    let is_Connected = false;
    factory.save_user = (username, password) => {
      user.username = username;
      user.password = password;
      window.localStorage.setItem("spinalhome_cfg", btoa(JSON.stringify(user)));
    };
    factory.get_user = () => {
      let _user = window.localStorage.getItem("spinalhome_cfg");
      if (_user) {
        user = JSON.parse(atob(_user));
      }
      return user;
    };
    factory.logout = () => {
      if (user.username != "") {
        factory.save_user("", "");
        location.reload();
      }
    };

    factory.login = (username, password) => {
      let deferred = $q.defer();
      let url = "/get_user_id";
      $http.get(url + "?u=" + username + "&p=" + password).then(
        function(data) {
          var u = parseInt(data.data);
          // var i = 0;
          if (u == -1) {
            let msg = "Login Error: username / password pair not found.";
            // $mdToast.show(loginError_toast)
            deferred.reject(msg);
            return;
          }
          ngSpinalCore.connect(
            "http://" +
              u +
              ":" +
              password +
              "@" +
              config.spinalhub_url +
              ":" +
              config.spinalhub_port +
              "/"
          );
          factory.save_user(username, password);
          is_Connected = true;
          deferred.resolve();
          if (wait_connect_defer) wait_connect_defer.resolve();
        },
        function() {
          let msg = "Connection Error: Imposible to connect to the server.";
          // $mdToast.show(connectionError_toast)
          deferred.reject(msg);
        }
      );
      return deferred.promise;
    };

    factory.is_Connected = () => {
      return is_Connected;
    };
    let wait_connect_defer = null;
    factory.wait_connect = () => {
      if (wait_connect_defer) return wait_connect_defer.promise;
      wait_connect_defer = $q.defer();
      if (is_Connected == true) {
        wait_connect_defer.resolve();
      }
      // else wait_connectList.push(deferred);
      return wait_connect_defer.promise;
    };

    return factory;
  }
]);
