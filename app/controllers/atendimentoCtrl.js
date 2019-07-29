angular.module(module).controller('atendimentoCtrl', function ($rootScope, $scope, $location, genericAPI, $uibModal, SweetAlert, $timeout, especialCharMask, $stateParams) {
    $scope.title = 'Atendimento';

    // listando consultores
    $scope.consultor = [];
    $scope.buscarInfoPageConsultor = function () {
        // verificando se o filtro está preenchido
        var data = { "metodo": "buscarInfoPageConsultor", "data": $stateParams.consultor.substring($stateParams.consultor.length-1), "class": "usuario", request: 'POST' };

        $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $scope.consultor = response.data.data;
                    $rootScope.loadoff();
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            });	
    }
    $scope.buscarInfoPageConsultor();

});