angular.module(module).controller('atendimentoCtrl', function ($rootScope, $scope, $location, genericAPI, $uibModal, SweetAlert, $timeout, especialCharMask, $stateParams) {
    $scope.title = 'Atendimento';

    // listando consultores
    $scope.consultor = [];
    $scope.buscarInfoPageConsultor = function () {
        var posA = $stateParams.consultor.indexOf('@');
        var posE = $stateParams.consultor.indexOf('&');
        var dataRequest = {
            usuario: $stateParams.consultor.substring(posA, posE),
            identificador: $stateParams.consultor.substring(posE)
        };
    
        // verificando se o filtro está preenchido
        var data = { "metodo": "buscarInfoPageConsultor", "data": dataRequest, "class": "usuario", request: 'POST' };

        $rootScope.loadon();

        genericAPI.public(data)
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
    if ($stateParams.consultor.length>0) $scope.buscarInfoPageConsultor();

});