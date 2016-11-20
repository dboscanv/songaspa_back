/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    angular
        .module('app.jobs')
        .directive('jobsdirective',jobs);

    function jobs() {
        return {
            restrict:'E',
            templateUrl:'js/jobs/template/jobs.template.html'
        }
    }
})();