angular.module("MyApp", ["MyCore"]);

angular.module("MyApp").controller("PrincipalController", [
  "auth",
  function(srv) {
    var vm = this;

    vm.nombre = "mundo";
    vm.resultado = "";
    vm.auth = srv;

    vm.saluda = function() {
      vm.resultado = "Hola " + vm.nombre;
    };
    vm.despide = function() {
      vm.resultado = "Adios " + vm.nombre;
    };
  }
]);

angular.module("MyApp").factory("auth", [
  function() {
    return {
      usuario: "(vacio)",
      nivel: "",
      roles: [],
      login: function(nombre, nivel) {
        this.usuario = nombre;
        this.nivel = nivel;
      }
    };
  }
]);
