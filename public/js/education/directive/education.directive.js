/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    angular
        .module('app.education')
        .directive('educationdirective',education);

    function education() {
        return{
            restrict:'E',
            templateUrl:'js/education/template/education.template.html'
        }
    }
})();