/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    "use strict";
    angular
        .module('app')
        .config(leng);
    
    function leng($translateProvider) {
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
            menu_inicio:'Inicio',
            menu_acerca:'Acerca de',
            menu_habilidades:'Habilidades',
            menu_experiencias:'Experiencias',
            menu_educacion:'Educacion',
            menu_trabajos:'Proyectos',
            menu_boton_cv:'Descargar CV'
        }
    }
    function english() {
        return {
            menu_inicio:'Home',
            menu_acerca:'About',
            menu_habilidades:'Skills',
            menu_experiencias:'Experience',
            menu_educacion:'Education',
            menu_trabajos:'Works',
            menu_boton_cv:'Download CV'
        }
        
    }

})();
