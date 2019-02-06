angular.module(module).controller('homeCtrl', function ($rootScope, $scope, authenticationAPI, genericAPI, $location, $uibModal, $timeout) {
    //Verifica Sessao e permissão de acesso
    if (!$rootScope.usuario) { $location.path("/login"); return false; }

    $scope.title = 'Home';

    $scope.agendas = [];
    $scope.listarAgendas = function () {
        var dataRequest = {
            idusuario: $rootScope.usuario.idusuario
        };

        // verificando se o filtro está preenchido
        var data = { "metodo": "listarOrdenadoPorData", "data": dataRequest, "class": "agenda", request: 'GET' };

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $scope.agendas = response.data.data;
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            });
    }
    $scope.listarAgendas();
    
});