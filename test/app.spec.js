describe("Pruebas MyApp", function() {
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
        srv.login('pepito', 'admin');
        expect(srv.usuario).toBe("pepito");
        expect(srv.nivel).toBe("admin");
      });
    });
});

describe("Pruebas MyCore", function() {
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
