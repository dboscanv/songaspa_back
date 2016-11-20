/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    angular
        .module('app.work')
        .directive('workdirective',work);
    
    function work() {
        return{
            restrict:'E',
            templateUrl:'js/work/template/work.template.html'
        }
    }
})();