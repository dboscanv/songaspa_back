/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    angular
        .module('app.about')
        .config(config);
    
    function config($translateProvider) {
        $translateProvider.preferredLanguage('es');
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider
            .translations('es',spanish());
        $translateProvider
            .translations('en',english());
    }

    function spanish() {
        return {
            about_titulo:'Acerca de',
            about_titulo2:'Informacion Basica',
            about_direccion:'Direccion:',
            about_fecha_nacimiento:'Fecha de nacimiento:',
            about_lugar_nacimiento:'Lugar de nacimiento:',
            about_lenguajes:'Lenguajes:',
            about_genero:'Genero:',
            about_saludo:'Hola, mi nombre es Eddie Mejia',
            about_contenido:'Aenean nonummy hendrerit mauris. Donec sit Phasellus portFusce suscipit varius mium sociis natoque penatibus et magnis dis parturent montes, nascetur ridiculus mus. Nulla dui.Fusce feugiat malesuada odiMorbi nunc odio, gravida at, cursus nec, luctus.',
            about_sexo:'Masculino',
            about_ingles:'Ingles',
            about_sp:'Español',
            about_mes_nacimiento:'Marzo'
        }
    }

    function english() {
        return {
            about_titulo:'About',
            about_titulo2:'Basic Information',
            about_direccion:'Address:',
            about_fecha_nacimiento:'Date of Birth:',
            about_lugar_nacimiento:'Place of Birth:',
            about_lenguajes:'Language:',
            about_genero:'Gender:',
            about_saludo:'Hello, I am Eddie Mejia',
            about_contenido:'Aenean nonummy hendrerit mauris. Donec sit Phasellus portFusce suscipit varius mium sociis natoque penatibus et magnis dis parturent montes, nascetur ridiculus mus. Nulla dui.Fusce feugiat malesuada odiMorbi nunc odio, gravida at, cursus nec, luctus.',
            about_sexo:'Male',
            about_ingles:'English',
            about_sp:'Spanish',
            about_mes_nacimiento:'March'
        }
    }

})();