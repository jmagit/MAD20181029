angular.module("MyApp").factory("PersonasDAO", [
  "$http",
  function($http) {
    var baseUrl = "http://localhost:4321/ws/personas";
    var config = { withCredentials: true };
    return {
      query: function() {
        return $http.get(baseUrl, config);
      },
      get: function(id) {
        return $http.get(baseUrl + "/" + id, config);
      },
      add: function(item) {
        return $http.post(baseUrl, item, config);
      },
      change: function(id, item) {
        return $http.put(baseUrl + "/" + id, item, config);
      },
      remove: function(id) {
        return $http.delete(baseUrl + "/" + id, config);
      }
    };
  }
]);

angular.module("MyApp").controller("PersonasController", [
  "NotificationService",
  "$window",
  "$route",
  "$routeParams",
  "$location",
  "PersonasDAO",
  function(notify, $window, $route, $routeParams, $location, dao) {
    var vm = this;

    vm.modo = "list";
    vm.listado = [];
    vm.elemento = {};
    var idOriginal = null;
    var urlList = "/personas";

    vm.list = function() {
      dao.query().then(
        function(resp) {
          vm.listado = resp.data;
          vm.modo = "list";
        },
        function(err) {
          notify.add(err.statusText);
        }
      );
    };

    vm.add = function() {
      vm.elemento = {};
      vm.modo = "add";
    };
    vm.edit = function(key) {
      dao.get(key).then(
        function(resp) {
          vm.elemento = resp.data;
          idOriginal = key;
          vm.modo = "edit";
        },
        function(err) {
          notify.add(err.statusText);
        }
      );
    };
    vm.view = function(key) {
      dao.get(key).then(
        function(resp) {
          vm.elemento = resp.data;
          vm.modo = "view";
        },
        function(err) {
          notify.add(err.statusText);
        }
      );
    };
    vm.delete = function(key) {
      if (!$window.confirm("¿Seguro?")) return;
      dao.remove(key).then(
        function(resp) {
          vm.list();
        },
        function(err) {
          notify.add(err.statusText);
        }
      );
    };

    vm.cancel = function() {
      vm.elemento = {};
      idOriginal = null;
      $location.url(urlList);
    };
    vm.send = function() {
      switch (vm.modo) {
        case "add":
          dao.add(vm.elemento).then(
            function(resp) {
              vm.cancel();
            },
            function(err) {
              notify.add(err.statusText);
            }
          );
          break;
        case "edit":
          dao.change(idOriginal, vm.elemento).then(
            function(resp) {
              vm.cancel();
            },
            function(err) {
              notify.add(err.statusText);
            }
          );
          break;
        case "view":
          vm.cancel();
          break;
      }
    };

    if ($routeParams.id) {
      if ($location.url().endsWith("/edit")) {
        vm.edit($routeParams.id);
      } else {
        vm.view($routeParams.id);
      }
    } else {
      if ($location.url().endsWith("/add")) {
        vm.add();
      } else {
        vm.list();
      }
    }
  }
]);
angular.module("MyApp").factory("PersonasService", [
  function() {
    return {
      listado: [
        { id: 1, nombre: "Carmelo", apellidos: "Coton", edad: 34 },
        { id: 2, nombre: "Pepito", apellidos: "Grillo", edad: 155 },
        { id: 3, nombre: "Pedro", apellidos: "Pica Piedra", edad: 50 },
        { id: 4, nombre: "Pablo", apellidos: "Marmol", edad: 47 }
      ]
    };
  }
]);
