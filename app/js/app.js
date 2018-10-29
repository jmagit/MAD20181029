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


angular.module('MyApp').controller('NotificationController', ['NotificationService', function (srv) {
  this.notify = srv;
}]);
angular.module('MyApp').factory('NotificationService', ['$log', function ($log) {
  return {
      listado: [],
      add: function (msg) {
          if (msg) {
              this.listado.push(msg);
          } else {
              $log.error('Falta el mensaje.');
          }
          this.hayMensajes = this.listado.length > 0;
      },
      remove: function (index) {
          if (0 <= index && index < this.listado.length) {
              this.listado.splice(index, 1);
          } else {
              $log.error('Index out of range.');
          }
          this.hayMensajes = this.listado.length > 0;
      },
      clear: function () {
          this.listado = [];
          this.hayMensajes = false;
      },
      hayMensajes: false,
  };
}]);

angular.module('MyApp').factory('AuthService', ['$log', function ($log) {
  var isAuth = true;
  var authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIxaCIsImlhdCI6MTU0MDM5NTc3NH0.aa30kqDjeRzIwV5tPVvR5gMGltFebzAbIpGe693MFnI';
  var name = 'admin';

  if (localStorage && localStorage.AuthService) {
      rslt = JSON.parse(localStorage.AuthService);
      isAuth = rslt.isAuth;
      authToken = rslt.authToken;
      name = rslt.name;
  }

  return {
      AuthorizationHeader: function () {
          return authToken;
      },
      isAutenticated: function () {
          return isAuth;
      },
      Name: function () {
          return name;
      },
      login: function (token, nombre) {
          isAuth = true;
          authToken = token;
          name = nombre;
          if (localStorage) {
              localStorage.AuthService = JSON.stringify({
                  isAuth: isAuth,
                  authToken: authToken,
                  name: name
              });
          }
      },
      logout: function () {
          isAuth = false;
          authToken = '';
          name = '';
          if (localStorage) {
              localStorage.removeItem('AuthService');
          }
      },
  };
}]);

