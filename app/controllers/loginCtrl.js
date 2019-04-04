angular.module(module).controller('loginCtrl', function ($rootScope, $scope, $location, authenticationAPI, genericAPI, SweetAlert, $uibModal, $timeout) {
    //Verifica Sessao e permissão de acesso
    if ($rootScope.usuario) { $location.path("/home"); return false; }

    $scope.obj = {
        email: null,
        senha: null,
        remember: null
    }

    $scope.logar = function(obj) {

        if (obj.email === null || obj.senha === null) {
            SweetAlert.swal({ html: true, title: "Atenção", text: 'Preencha corretamente os campos.', type: "error" });
            return false;
        }

        $rootScope.loadon();
        
        var dataRequest = {
            email: obj.email,
            senha: MD5(obj.senha),
            remember: obj.remember || false
        }

        var data = { "metodo": "logar", "data": dataRequest, "class": "authentication", request: 'POST' };

        authenticationAPI.genericAuthentication(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    //criamos a session

                    authenticationAPI.createSession(response.data.data, dataRequest.remember);
                    $rootScope.loadoff();
                    $location.path("/home");
                    $rootScope.setValuesMyMenu();
                } else {
                    $rootScope.loadoff();
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            });	
    }

    // $scope.startLoop = function () {
    //     // verificando se o filtro está preenchido
    //     var data = { "metodo": "loopExecution", "data": '', "class": "simulacao", request: 'GET', timeout: 10 };

    //     genericAPI.generic(data)
    //         .then(function successCallback(response) {
    //             //se o sucesso === true
    //             console.log('sucesso', response);
    //         }, function errorCallback(response) {
    //             console.log(response);
    //             //error
    //         });
    // }
    // $scope.startLoop();
});