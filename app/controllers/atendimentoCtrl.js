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

    var coord = { lat: '-3.0889928', lon: '-60.0228449' };
    var carregaMapa = function (coord) {
        if (coord) {
            setTimeout(function () {
                var container = L.DomUtil.get('map');
                if (container != null) {
                    container._leaflet_id = null;
                }

                var map = L.map('map').setView([coord.lat, coord.lon], 16);

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoibnV2aW9zb2x1Y29lcyIsImEiOiJjamp1OXYyNjU4d3F2M3FyNThlM3NqNjN0In0.2PBDsYj0P2Slvf_ybDqWKQ' // api key nuvio
                }).addTo(map);

                map.removeControl(map.zoomControl);
                map.scrollWheelZoom.disable();
                map.dragging.disable();
                
                L.marker([coord.lat, coord.lon]).addTo(map)
                    .bindPopup('A/Santos Representaçoes/ Newbens</small>')
                    .openPopup();
            }, 100);
        }
    }
    carregaMapa(coord);

    $scope.rota = function () {
        window.open("https://www.google.com/maps/dir/?api=1&origin=my+location&destination=" + coord.lat + "," + coord.lon, "_blank");
    }

    $scope.simulacao = function (interesse) {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/views/modal/simulacaoAtendimento.html',
            controller: simulacaoAtendimentoCtrl,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                interesse: function () {
                    return interesse;
                },
                parentScope: $scope
            }
        });

        function simulacaoAtendimentoCtrl($scope, $uibModalInstance, interesse, parentScope) {
            $scope.someNumber = 50000;

            $scope.obj = {
                idusuario: parentScope.consultor.id,
                interesse: interesse,
                valor: 0,
                entrada: 0,
                parcela: 0,
                nome: '',
                celular: '',
                email: ''
            }

            $scope.ok = function (obj) {
                $scope.obj.valor = document.querySelector('#valor').value;
                $scope.obj.entrada = document.querySelector('#entrada').value;
                $scope.obj.parcela = document.querySelector('#parcela').value;
                
                // verificando se o filtro está preenchido
                var data = { "metodo": "cadastroViaAtendimento", "data": $scope.obj, "class": "cliente", request: 'POST' };

                $rootScope.loadon();

                genericAPI.public(data)
                    .then(function successCallback(response) {
                        //se o sucesso === true
                        if (response.data.success == true) {
                            $rootScope.loadoff();
                            $uibModalInstance.dismiss('cancel');
                            SweetAlert.swal({ html: true, title: "Sucesso", text: 'Sua solicitação foi enviada, em breve entraremos em contato!', type: "success" });
                        } else {
                            $rootScope.loadoff();
                            SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                        }
                    }, function errorCallback(response) {
                        //error
                    });
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
        }
    }

});