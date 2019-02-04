angular.module(module).controller('cartacreditoCtrl', function ($rootScope, $scope, $location, genericAPI, $uibModal, SweetAlert, $timeout, especialCharMask) {
    //Verifica Sessao e permissão de acesso
    // if (!$rootScope.usuario) { $location.path("/login"); return false; }

    $scope.title = 'Cartas de Crédito';

    $scope.obj = {
        id: 0,
        idtaxaadministrativa: '',
        valor: '',
        entrada: '',
        parcela: ''
    }

    $scope.modalidades = [];
    $scope.listarModalidades = function () {
        // verificando se o filtro está preenchido
        var data = { "metodo": "listar", "data": '', "class": "tipotaxa", request: 'GET' };

        // $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    response.data.data.unshift({
                        descricao: "Todos",
                        id: 0
                    });
                    $scope.modalidades = response.data.data;
                    // $rootScope.loadoff();
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            }); 
    }
    $scope.listarModalidades();

    $scope.taxas = [];
    $scope.listartaxas = function () {
        // verificando se o filtro está preenchido
        var data = { "metodo": "listar", "data": '', "class": "taxaadministrativa", request: 'GET' };

        // $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $scope.taxas = response.data.data;
                    $scope.obj.idtaxaadministrativa = $scope.taxas[0].id;
                    // $rootScope.loadoff();
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            }); 
    }
    $scope.listartaxas();

    $scope.listarCartas = function () {
        // verificando se o filtro está preenchido
        var data = { "metodo": "listar", "data": '', "class": "cartacredito", request: 'GET' };

        $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $scope.cartas = response.data.data;
                    $rootScope.loadoff();
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            });	
    }
    $scope.listarCartas();

    $scope.novo = false;
    $scope.cadNovo = function () {
        $scope.novo = true;
    }
    $scope.cancelaNovo = function () {
        $scope.novo = false;
        $scope.obj = {
            id: 0,
            idtaxaadministrativa: '',
            valor: '',
            entrada: '',
            parcela: ''
        }
    }
    $scope.salvarNovo = function (obj) {
        var copy = angular.copy(obj);
        copy.valor = desformataValor(obj.valor);
        copy.entrada = desformataValor(obj.entrada);
        copy.parcela = desformataValor(obj.parcela);

        var metodo = "cadastrar";
        if (copy.id>0) metodo = "atualizar";

        var data = { "metodo": metodo, "data": copy, "class": "cartacredito", request: 'POST' };

        $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $rootScope.loadoff();
                    SweetAlert.swal({ html: true, title: "Sucesso", text: 'Carta cadastrada com sucesso!', type: "success" });

                    $scope.cancelaNovo();
                    $scope.listarCartas();
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            }); 
    }

    $scope.editar = function (obj) {
        $scope.novo = true;
        $scope.obj = {
            id: obj.id,
            idtaxaadministrativa: obj.idtaxaadministrativa,
            valor: formataValor(obj.valor),
            entrada: formataValor(obj.entrada),
            parcela: formataValor(obj.parcela)
        }
    }


    // $scope.cadastrar = function (obj) {
        
    //     var data = { 
    //         "metodo": "cadastrar", 
    //         "data": obj,
    //         "class": "visitante", 
    //         request: 'POST' 
    //     };

    //     $rootScope.loadon();

    //     genericAPI.generic(data)
    //         .then(function successCallback(response) {
    //             //se o sucesso === true
    //             if (response.data.success == true) {
    //                 $rootScope.loadoff();
    //                 SweetAlert.swal({ html: true, title: "Sucesso", text: 'Visita cadastrada com sucesso!', type: "success" });

    //                 $scope.obj = {
    //                     idvisitante: 0,
    //                     nome: '',
    //                     cpfcnpj: '',
    //                     data: '',
    //                     horario: '',
    //                 }
    //             } else {
    //                 SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
    //             }
    //         }, function errorCallback(response) {
    //             //error
    //         });	
    // }

    $scope.simular = function (obj) {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/views/modal/simulacao.html',
            controller: simulacaoCartaCreditoCtrl,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                obj: function () {
                    return obj;
                },
                parentScope: $scope
            }
        });

        function simulacaoCartaCreditoCtrl($scope, $uibModalInstance, obj, parentScope) {
            $scope.obj = {
                modalidade: obj.modalidade,
                valor: formataValor(obj.valor),
                entrada: formataValor(obj.entrada),
                parcela: formataValor(obj.parcela),
                // negociado
                valornegociado: formataValor(obj.valor),
                taxa: obj.taxa+'%',
                valorcomtaxa: calculaValorComTaxa(obj.valor, obj.taxa),
                valorfinal: calculaValorFinal(obj.valor, obj.entrada),
                parcelamento: calculaParcelamento(
                    calculaValorFinal(obj.valor, obj.entrada), 
                    obj.parcela
                )
            };
            $scope.modalidades = parentScope.modalidades;
            $scope.cartas = parentScope.cartas;
           
            function calculaValorComTaxa (valor, taxa) {
                valor = desformataValor(valor);
                return formataValor(+valor+(+taxa/100*+valor));
            }
            function calculaValorFinal (valor, entrada) {
                valor = desformataValor(valor);
                entrada = desformataValor(entrada);
                return formataValor(+valor-entrada);
            }
            function calculaParcelamento (valor, parcela) {
                valor = desformataValor(valor);
                return (+valor/parcela).toFixed(0) + 'x de ' + formataValor(parcela);
            }

            $scope.alteraValor = function (item, $event) {
                // if (+desformataValor(item.valornegociado) < +obj.entrada) {
                //     item.valornegociado = formataValor(obj.entrada);
                //     SweetAlert.swal({ html: true, title: "Atenção", text: "Valor Negociado não pode ser abaixo do valor da Entrada!", type: "error" });
                //     return false;
                // }

                // if (($event.keyCode>=48 && $event.keyCode<=57) || ($event.keyCode>=96 && $event.keyCode<=105)) {
                    item.valorcomtaxa = calculaValorComTaxa(item.valornegociado, obj.taxa);
                    item.valorfinal = calculaValorFinal(item.valornegociado, obj.entrada);
                    item.parcelamento = calculaParcelamento(
                        item.valorfinal, 
                        obj.parcela
                    );
                // }
            }

            $scope.ok = function (obj) {

                if (obj === undefined) {
                    SweetAlert.swal({ html: true, title: "Atenção", text: "Informe pelo menos um campo para filtrar", type: "error" });
                    return false;
                }

                var data = { "metodo": "filtrar", "data": obj, "class": "cartacredito", request: 'GET' };

                $rootScope.loadon();

                genericAPI.generic(data)
                    .then(function successCallback(response) {
                        //se o sucesso === true
                        if (response.data.success == true) {
                            parentScope.cartas = response.data.data;
                            $rootScope.loadoff();
                            $uibModalInstance.dismiss('cancel');
                        } else {
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

    $scope.filtrar = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/views/modal/filtroCartaCredito.html',
            controller: filtroCartaCreditoCtrl,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                // obj: function () {
                //     return obj;
                // }
                parentScope: $scope
            }
        });

        function filtroCartaCreditoCtrl($scope, $uibModalInstance, parentScope) {
           $scope.obj = {
                modalidade: '',
                valoracima:'',
                valorabaixo:'',
                entradaacima:'',
                entradaabaixo:'',
                parcelaacima:'',
                parecelaabaixo:''
           };
           $scope.modalidades = parentScope.modalidades;
           $scope.obj.modalidade = $scope.modalidades[0].id;

            $scope.ok = function (obj) {

                if (obj === undefined) {
                    SweetAlert.swal({ html: true, title: "Atenção", text: "Informe pelo menos um campo para filtrar", type: "error" });
                    return false;
                }

                var data = { "metodo": "filtrar", "data": obj, "class": "cartacredito", request: 'GET' };

                $rootScope.loadon();

                genericAPI.generic(data)
                    .then(function successCallback(response) {
                        //se o sucesso === true
                        if (response.data.success == true) {
                            parentScope.cartas = response.data.data;
                            $rootScope.loadoff();
                            $uibModalInstance.dismiss('cancel');
                        } else {
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