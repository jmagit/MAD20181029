xdescribe("Pruebas MyApp", function() {
  it("Demo funciona", function() {
    expect(true).toBeTruthy();
  });

  describe("Probar Controlador: myController", function() {
    beforeEach(module("MyApp"));

    var ctrl;
    beforeEach(inject(function($controller, auth) {
      ctrl = $controller("PrincipalController", { srv: auth });
    }));
    it("debe estar definida un model nombre con valor 'mundo'", function() {
      expect(ctrl.nombre).toBeDefined();
      expect(ctrl.nombre).toBe("mundo");
      expect(ctrl.auth.usuario).toBe("(vacio)");
    });
    it("Hola Mundo", function() {
      ctrl.saluda();
      expect(ctrl.resultado).toBe("Hola mundo");
    });
    it("prueba el método saluda", function() {
      ctrl.nombre = "javi";
      ctrl.saluda();
      expect(ctrl.resultado).toBe("Hola javi");
    });
    it("Adios Mundo", function() {
      ctrl.despide();
      expect(ctrl.resultado).toBe("Adios mundo");
      ctrl.nombre = "javi";
      ctrl.despide();
      expect(ctrl.resultado).toBe("Adios javi");
      ctrl.nombre = null;
      ctrl.despide();
      expect(ctrl.resultado).toBe("Adios null");
    });
  });
  describe("Pruebas de servicios", function() {
    beforeEach(module("MyApp"));

    var srv;
    beforeEach(inject(function(auth) {
      srv = auth;
    }));
    it("Sin roles", function() {
      expect(srv.roles).toBeDefined();
      expect(srv.roles.length).toBe(0);
    });
    it("Sin usuario", function() {
      expect(srv.usuario).toBe("(vacio)");
    });
    it("Sin usuario", function() {
      srv.login("pepito", "admin");
      expect(srv.usuario).toBe("pepito");
      expect(srv.nivel).toBe("admin");
    });
  });
});

xdescribe("Pruebas MyCore", function() {
  describe("Pruebas de filtros", function() {
    describe("Filtro: capitalice", function() {
      beforeEach(module("MyCore"));

      var filtro;
      beforeEach(inject(function($filter) {
        filtro = $filter("capitalice");
      }));
      it("Sin valor", function() {
        expect(filtro("")).toBe("");
        expect(filtro()).toBeUndefined();
      });
      it("Con todo en mayúsculas", function() {
        expect(filtro("HOLA MUNDO")).toBe("Hola mundo");
      });
      it("Con todo en minúsculas", function() {
        expect(filtro("hola mundo")).toBe("Hola mundo");
      });
      it("Una letra", function() {
        expect(filtro("a")).toBe("A");
      });
      it("Un numero", function() {
        expect(filtro("1234")).toBe("1234");
      });
    });
  });
});
fdescribe('Pruebas de directivas', function () {
  var $compile, $rootScope;

  beforeEach(module('MyCore'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
  }));

  it('Reemplaza el elemento con el contenido apropiado', function () {
      var scope = $rootScope.$new();
      var element = $compile('<div><input type="text" lbl-title="Nombre"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toContain('<label>Nombre: <input type="text"></label>');
  });
});

fdescribe("Pruebas de validaciones", function() {
  var $compile, $rootScope;
  beforeEach(module("MyCore"));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  function getCompiledElement(template, scope) {
    var compiledDirective = $compile(angular.element(template))(scope);
    scope.$digest();
    return compiledDirective;
  }
  describe("Directiva: valInteger", function() {
    var scope, input;
    beforeEach(inject(function() {
      scope = $rootScope.$new();
      scope.test = "123456";
      var directiveElem = getCompiledElement(
        '<form name="miForm"><input type="text" name="test" ng-model="test" val-integer /></form>',
        scope
      );
      input = scope.miForm.test;
    }));
    it("valido", function() {
      var esValido = function(value) {
        input.$setViewValue(value);
        scope.$digest();
        expect(scope.miForm.$valid).toBeTruthy();
        expect(input.$valid).toBeTruthy();
        expect(input.$error.valInteger).toBeUndefined();
      };
      esValido("");
      esValido("0");
      esValido("-12");
      esValido("1234");
    });
    it("invalido", function() {
      var noEsValido = function(value) {
        input.$setViewValue(value);
        scope.$digest();
        expect(scope.miForm.$valid).toBeFalsy();
        expect(input.$valid).toBeFalsy();
        expect(input.$error.valInteger).toBeTruthy();
      };
      noEsValido("abc");
      noEsValido("1,5");
      noEsValido("1.5");
      noEsValido("1+1");
      //expect(function() { noEsValido(1234); }).toThrow();
    });
  });
  describe("Directiva: valNif", function() {
    var scope, input;
    beforeEach(inject(function() {
      scope = $rootScope.$new();
      scope.test = "123456";
      var directiveElem = getCompiledElement(
        '<form name="miForm"><input type="text" name="test" ng-model="test" val-nif /></form>',
        scope
      );
      input = scope.miForm.test;
    }));
    it("valido", function() {
      var esValido = function(value) {
        input.$setViewValue(value);
        scope.$digest();
        expect(scope.miForm.$valid).toBeTruthy();
        expect(input.$valid).toBeTruthy();
        expect(input.$error.valNif).toBeUndefined();
      };
      esValido("");
      esValido("12345678Z");
      esValido("12345678z");
    });
    it("invalido", function() {
      var noEsValido = function(value) {
        input.$setViewValue(value);
        scope.$digest();
        expect(scope.miForm.$valid).toBeFalsy();
        expect(input.$valid).toBeFalsy();
        expect(input.$error.valNif).toBeTruthy();
      };
      noEsValido("Z12345678");
      noEsValido("12345678A");
      noEsValido("1234");
      noEsValido("A");
     });
  });
});
