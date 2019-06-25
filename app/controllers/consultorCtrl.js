angular.module(module).controller('consultorCtrl', function ($rootScope, $scope, $location, genericAPI, $uibModal, SweetAlert, $timeout, especialCharMask) {
    //Verifica Sessao e permissão de acesso
    if (!$rootScope.usuario) { $location.path("/login"); return false; }

    $scope.title = 'Consultores';

    $scope.obj = {
        idconsultor: "",
        alvo: "cliente"
    }

    $scope.view = "";

    // listando consultores
    $scope.consultores = [];
    $scope.listarConsultores = function () {
        // verificando se o filtro está preenchido
        var data = { "metodo": "listarPorSuperior", "data": "", "class": "usuario", request: 'GET' };

        $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $scope.consultores = response.data.data;
                    if ($scope.consultores.length) $scope.obj.idconsultor = $scope.consultores[0].id;
                    $rootScope.loadoff();
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            });	
    }
    $scope.listarConsultores();

    $scope.filtrar = function (obj) {
        sessionStorage.setItem("consultor_criterios", JSON.stringify(obj));
        $scope.view = `app/views/consultor_${obj.alvo}.html`;
    }
    $scope.limparFiltro = function (obj) {
        sessionStorage.removeItem("consultor_criterios");
        $scope.view = "";
    }
});