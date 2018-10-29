// Para descargar los binarios necesarios: webdriver-manager update
// Para poner en marcha el servidor: webdriver-manager start
// Para lanzar las pruebas e2e: protractor e2e.conf.js

describe('Primera prueba con Protractor', function () {
    it('introducir nombre y saludar', function () {
        browser.get('http://localhost:3000/');
        var txt = element(by.model('app.nombre'));
        txt.clear();
        browser.sleep(1000);

        txt.sendKeys('MUNDO');
        browser.sleep(1000);

        element(by.css('input[value="Saluda"]')).click();
        browser.sleep(1000);

        expect(element(by.binding('app.resultado')).getText()).toEqual('Hola MUNDO');
    });
});