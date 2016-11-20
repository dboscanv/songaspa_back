/**
 * Created by EddieMaster on 12/11/2016.
 */
(function () {
    'use strict';
    angular
        .module('app')
        .config(config);


    function config($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('main',home())

    }
    function home() {
        return{
            url:'/',
            name:'main',
            views:{
                '':{
                    templateUrl:'views/main/main.html',
                    controller:'main'
                },
                'header@main':{
                    templateUrl:'views/commun/header.html',
                    controller:'main'
                },
                'content@main':{
                    templateUrl:'views/home/content.html',
                    controller:'main'
                },
                'footer@main':{
                    templateUrl:'views/commun/footer.html',
                    controller:'main'
                }
            }
        }
    }

    config.$inject = ['$stateProvider','$urlRouterProvider'];

})();