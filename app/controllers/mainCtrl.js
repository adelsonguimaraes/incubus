angular.module(module).controller('mainCtrl', function ($rootScope, $scope, authenticationAPI, genericAPI, $location, $uibModal, $timeout) {
    authenticationAPI.sessionCtrl();

    $rootScope.api = api;
    
    $rootScope.loading = 'none';
    $scope.title = 'Incubus';

    $rootScope.loadon = function () {
        var load = document.getElementById('loading');
        load.style.display = 'block';
    }
    $rootScope.loadoff = function () {
        var load = document.getElementById('loading');
        load.style.display = 'none';
    }

    $rootScope.rotinas = [
        {
            'nome': 'Home',
            'icon': 'fa fa-home',
            'url': 'home'
        },
        {
            'nome': 'Clientes',
            'icon': 'fa fa-user',
            'url': 'cliente'
        },
        {
            'nome': 'Agenda',
            'icon': 'fa fa-calendar',
            'url': 'agenda'
        },
        {
            'nome': 'Cartas de Crédito',
            'icon': 'fa fa-credit-card',
            'url': 'cartacredito'
        },
    ];

    $scope.meusDados = function () {
        setTimeout(function(){
            var mh = document.querySelector("#mymenu #menu-header")
            mh.addEventListener("click", function (e) {
                // chama tela de meus dados
                window.location.replace('#meusdados');
                MyMenu.close();
            });
        },300);
    }
    $scope.meusDados();


    $rootScope.setValuesMyMenu = function () {
        if ($rootScope.usuario) {
            // getando menu usuário
            $rootScope.getMenu();
        }    
    }
    $rootScope.setValuesMyMenu();
});