angular.module(module).controller('homeCtrl', function ($rootScope, $scope, authenticationAPI, genericAPI, $location, SweetAlert, $uibModal, $timeout) {
    //Verifica Sessao e permissão de acesso
    if (!$rootScope.usuario) { $location.path("/login"); return false; }

    $scope.title = 'Home';

    $scope.groups = {
        agenda: true,
        cliente: true
    };

    $scope.toggle = function (grupo) {
        $scope.groups[grupo] = !$scope.groups[grupo];
        MyToast.show($scope.groups[grupo] ? 'Grupo Maximizado' : 'Grupo Minimizado', 3);
    }

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

    $scope.itemClickAgenda = function (obj) {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/views/modal/detalhesAgenda.html',
            controller: detalhesAgendaCtrl,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                agenda: function () {
                    return obj;
                },
                parentScope: $scope
            }
        });

        function detalhesAgendaCtrl($scope, $uibModalInstance, agenda, parentScope) {
            $scope.obj = agenda;
            
            $scope.ok = function (obj) {
                $uibModalInstance.dismiss('cancel');
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
        } 
    }

    $scope.clientes = [];
    $scope.listarClientes = function () {
        var dataRequest = {
            idusuario: $rootScope.usuario.idusuario
        };

        // verificando se o filtro está preenchido
        var data = { "metodo": "listarVerNaHome", "data": dataRequest, "class": "cliente", request: 'GET' };

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $scope.clientes = response.data.data;
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            });
    }
    $scope.listarClientes();
    
});