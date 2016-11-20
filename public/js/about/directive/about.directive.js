/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    angular
        .module('app.about')
        .directive('aboutdirective',about);
    
    function about() {
        return {
            restrict:'E',
            templateUrl:'js/about/template/about.html'
        }
    }
})();