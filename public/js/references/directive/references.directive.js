/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    angular
        .module('app.references')
        .directive('referencesdirective',references);
    function references() {
        return {
            restrict:'E',
            templateUrl:'js/references/template/references.template.html'
        }

    }
})();