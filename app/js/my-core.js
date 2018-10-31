angular.module("MyCore", []);

angular.module("MyCore").filter("capitalice", function() {
  return function(s) {
    if (typeof s === "string") {
      return s.charAt(0).toUpperCase() + s.substring(1, s.length).toLowerCase();
    }
    return s;
  };
});
angular.module('MyCore').filter("initcap", function () {
  return function (s) {
      if (typeof (s) === "string") {
          return s.replace(/[^\s]+/g,
                  function (cad) {
                      return cad.charAt(0).toUpperCase() +
                          cad.slice(1).toLowerCase();
                  });
      }
      return s;
  };
});
angular.module('MyCore').filter("elipsis", function () {
  return function (value, maxlen) {
      return (!maxlen || !value || value.length < maxlen || value.length < 4) ?
      value : (value.substr(0, maxlen - 3) + '...');
  };
});

angular.module("MyCore").filter("toComaDecimal", function() {
return function(s) {
  if (typeof(s) === "number") {
      s = s.toString();
  }
  if (typeof(s) === "string") {
      return s.replace(".", ",");
  }
  return s;
};
});

angular.module('MyCore').component('calc', {
  controllerAs: 'ctrl',
  bindings: {
      init: '<',
      onUpdate: '&?'
  },
  //templateUrl: 'views/calc.html',
  template: '<table><tr><th colspan=\"4\" align=\"right\"> {{ctrl.resumen | toComaDecimal}} </th></tr><tr><th colspan=\"4\" align=\"right\" class=\"Pantalla\"> {{ctrl.pantalla | toComaDecimal}} </th></tr><tr><td><input class=\"btnOperar\" type=\"button\" value=\"C\" data-ng-click=\"ctrl.inicia()\"></td><td colspan=\"2\"><input class=\"btnOperar\" type=\"button\" value=\"BORRAR\" data-ng-click=\"ctrl.borrar()\"></td><td><input class=\"btnOperar\" type=\"button\" value=\"+\" data-ng-click=\"ctrl.calcula(\'+\')\"></td></tr><tr><td ng-repeat=\"d in [7,8,9]\"><input class=\"btnDigito\" type=\"button\" value=\"{{d}}\" data-ng-click=\"ctrl.ponDijito(d);\"></td><td><input class=\"btnOperar\" type=\"button\" value=\"-\" data-ng-click=\"ctrl.calcula(\'-\')\"></td></tr><tr><td><input class=\"btnDigito\" type=\"button\" value=\"4\" data-ng-click=\"ctrl.ponDijito(\'4\');\"></td><td><input class=\"btnDigito\" type=\"button\" value=\"5\" data-ng-click=\"ctrl.ponDijito(\'5\');\"></td><td><input class=\"btnDigito\" type=\"button\" value=\"6\" data-ng-click=\"ctrl.ponDijito(\'6\');\"></td><td><input class=\"btnOperar\" type=\"button\" value=\"*\" data-ng-click=\"ctrl.calcula(\'*\');\"></td></tr><tr><td><input class=\"btnDigito\" type=\"button\" value=\"1\" data-ng-click=\"ctrl.ponDijito(\'1\');\"></td><td><input class=\"btnDigito\" type=\"button\" value=\"2\" data-ng-click=\"ctrl.ponDijito(\'2\');\"></td><td><input class=\"btnDigito\" type=\"button\" value=\"3\" data-ng-click=\"ctrl.ponDijito(\'3\');\"></td><td><input class=\"btnOperar\" type=\"button\" value=\"/\" data-ng-click=\"ctrl.calcula(\'/\');\"></td></tr><tr><td width=\"25%\"><input class=\"btnDigito\" type=\"button\" value=\"0\" data-ng-click=\"ctrl.ponDijito(\'0\');\"></td><td width=\"25%\"><input class=\"btnDigito\" type=\"button\" value=\",\" data-ng-click=\"ctrl.ponComa()\"></td><td width=\"25%\"><input class=\"btnDigito\" type=\"button\" value=\"+/-\" data-ng-click=\"ctrl.cambiaSigno()\"></td><td width=\"25%\"><input class=\"btnOperar\" type=\"button\" value=\"=\" data-ng-click=\"ctrl.calcula(\'=\');\"></td></tr></table>',
  controller: function() {
      var vm = this;
      var acumulado = 0;
      var operador = '+';
      var limpiar = true;

      vm.pantalla = vm.init || "0";
      vm.resumen = "";

      vm.inicia = function() {
          acumulado = 0;
          operador = '+';
          vm.pantalla = "0";
          vm.resumen = "";
          limpiar = true;
      };
      vm.ponDijito = function(value) {
          if (typeof(value) !== "string")
              value = value.toString();
          if (value < "0" || value > "9")
              return;
          if (limpiar || vm.pantalla == "0") {
              vm.pantalla = value;
              limpiar = false;
          } else
              vm.pantalla += value;
      };
      vm.ponOperando = function(value) {
          vm.pantalla = value;
      };
      vm.ponComa = function() {
          if (limpiar) {
              vm.pantalla = "0.";
              limpiar = false;
          } else if (vm.pantalla.indexOf(".") === -1)
              vm.pantalla += '.';
      };
      vm.borrar = function() {
          if (limpiar || vm.pantalla.length == 1) {
              vm.pantalla = "0";
              limpiar = true;
          } else
              vm.pantalla = vm.pantalla.substr(0,
                  vm.pantalla.length - 1);
      };
      vm.calcula = function(value) {
          if ("+-*/=".indexOf(value) == -1) return;

          var operando = parseFloat(vm.pantalla);
          switch (operador) {
              case '+':
                  acumulado += operando;
                  break;
              case '-':
                  acumulado -= operando;
                  break;
              case '*':
                  acumulado *= operando;
                  break;
              case '/':
                  acumulado /= operando;
                  break;
              case '=':
                  break;
          }
          vm.resumen = value == "=" ? "" : (vm.resumen + vm.pantalla + value);
          vm.pantalla = acumulado.toString();
          operador = value;
          limpiar = true;
          if(angular.isDefined(vm.onUpdate))
              vm.onUpdate({
                  rslt: vm.pantalla
              });
      };
      vm.cambiaSigno = function() {
          vm.pantalla = (-vm.pantalla).toString();
      };
  }
});

angular.module('MyCore').directive("myCard",[function() {
	return {
    restrict:"E",
    replace : true,
    transclude : true,
    template:'<div class="my-card"><h1 class="my-card-title">{{titulo}}</h1><div class="my-card-body" ng-transclude></div></div>',
    scope:{ titulo:"@" }
  };
}]);
angular.module('MyCore').directive("remarca",[function() {
	return {
    restrict:"A",
    link: function(scope, element, attrs, controller, transcludeFn) {
      var color = element.css( "background-color" );
      var colorTexto = element.css( "color" );
      element.on( "mouseover", function() {
          element.css('background-color', attrs.remarca || 'yellow');
          element.css('color', attrs.colorTexto || 'black');
      });
      element.on( "mouseleave", function() {
          element.css('background-color', color);
          element.css('color', colorTexto);
      });
    }
  };
}]);
angular.module('MyCore').directive('myTabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: ['$scope', function MyTabsController($scope) {
      var panes = $scope.panes = [];
      $scope.select = function(pane) {
        angular.forEach(panes, function(item) {
          item.selected = item == pane;
        });
      };
      this.addPane = function(pane) {
        panes.push(pane);
        if (panes.length === 1) 
          $scope.select(pane);
      };
    }],
    template: '<table><tr><td ng-repeat="pane in panes" ng-click="select(pane)" ' +
        'ng-class="{\'tab-active\':pane.selected,\'tab-inactive\':!pane.selected}">{{pane.title}}</td></tr></table>' +
        '<div class="tab-content" ng-transclude></div>',
  };
});
angular.module('MyCore').directive('myPane', function() {
  return {
    require: '^^myTabs',
    restrict: 'E',
    transclude: true,
    scope: { title: '@' },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    template: '<div class="tab-pane" ng-show="selected" ng-transclude></div>'
  };
});
angular.module('MyCore').directive('valInteger', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.valInteger = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // tratamos los modelos vacíos como correctos
          return true;
        }
        return /^\-?\d+$/.test(viewValue);
      };
    }
  };
});

angular.module("MyCore").directive('valNif', function() {
  return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
          ctrl.$validators.valNif = function(modelValue, viewValue) {
              // tratamos los modelos vacíos como correctos
              if (ctrl.$isEmpty(modelValue)) {
                  return true;
              }
              if (!(/^\d{1,8}\w$/.test(viewValue))) return false;
              var letterValue = viewValue.substr(viewValue.length - 1);
              var numberValue = viewValue.substr(0, viewValue.length - 1);
              return letterValue.toUpperCase() === "TRWAGMYFPDXBNJZSQVHLCKE".charAt(numberValue % 23);
          };
      }
  };
});

angular.module("MyCore").directive("lblTitle", [function() {
  return {
      restrict: "A",
      link: function(scope, element, attrs, controller, transcludeFn) {
          var lbl = "<label" +
              (attrs.class ? (" class='" + attrs.class + "'") : "") +
              ">" + attrs.lblTitle + ": </label>";
          element.removeAttr('lbl-title');
          element.wrap(lbl);
      }
  };
}]);
angular.module("MyCore").directive("confirm", ['$window', '$parse', function($window, $parse) {
  return {
      restrict: "A",
      link: function(scope, element, attrs, controller, transcludeFn) {
          var fn = $parse(attrs.confirm);
          element.on('click', function(event) {
              if($window.confirm(attrs.confirmMsg ? attrs.confirmMsg : '¿Seguro?')) {
                  var callback = function() {
                      fn(scope, {$event: event});
                  };
                  scope.$apply(callback);
              }
          });
      }
  };
}]);

