/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    'use-strict';
    angular
        .module('app.skills')
        .directive('skillsdirective',skills);
    
    function skills() {
        return {
            restrict:'E',
            templateUrl:'js/skills/template/skills.template.html'
        }
    }
})();