angular.module(module).controller('clienteCtrl', function ($rootScope, $scope, $location, genericAPI, $uibModal, SweetAlert, $timeout, especialCharMask) {
    //Verifica Sessao e permissão de acesso
    if (!$rootScope.usuario) { $location.path("/login"); return false; }

    $scope.title = 'Clientes';

    $scope.obj = {
        id: 0,
        idusuario: 0,
        nome: '',
        celular: '',
        email: '',
        interesse: '',
        observacao: '',
        status: 'PROSPECTO'
    }

    $scope.clientes = [];
    $scope.listarClientes = function () {
        var dataRequest = {
            idusuario: $rootScope.usuario.idusuario
        };
        
        // verificando se o filtro está preenchido
        var data = { "metodo": "listar", "data": dataRequest, "class": "cliente", request: 'GET' };

        $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $scope.clientes = response.data.data;
                    $rootScope.loadoff();
                } else {
                    SweetAlert.swal({ html: true, title: "Atenção", text: response.data.msg, type: "error" });
                }
            }, function errorCallback(response) {
                //error
            });	
    }
    $scope.listarClientes();

    $scope.novo = false;
    $scope.cadNovo = function () {
        $scope.novo = true;
    }
    $scope.cancelaNovo = function () {
        $scope.novo = false;
        $scope.obj = {
            id: 0,
            idusuario: 0,
            nome: '',
            celular: '',
            email: '',
            interesse: '',
            observacao: '',
            status: 'PROSPECTO'
        }
    }
    $scope.salvarNovo = function (obj) {
        var copy = angular.copy(obj);
        copy.celular = obj.celular.replace(/[^\d]+/g,'');
        
        var metodo = "cadastrar";
        if (copy.id>0) metodo = "atualizar";

        var data = { "metodo": metodo, "data": copy, "class": "cliente", request: 'POST' };

        $rootScope.loadon();

        genericAPI.generic(data)
            .then(function successCallback(response) {
                //se o sucesso === true
                if (response.data.success == true) {
                    $rootScope.loadoff();
                    SweetAlert.swal({ html: true, title: "Sucesso", text: 'Cliente salvo com sucesso!', type: "success" });

                    $scope.cancelaNovo();
                    $scope.listarClientes();
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
            idusuario: obj.idusuario,
            nome: obj.nome,
            celular: obj.celular,
            email: obj.email,
            interesse: obj.interesse,
            observacao: obj.observacao,
            status: obj.status
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
                carta: function () {
                    return obj;
                },
                parentScope: $scope
            }
        });

        function simulacaoCartaCreditoCtrl($scope, $uibModalInstance, carta, parentScope) {
            $scope.obj = {
                modalidade: carta.modalidade,
                valor: formataValor(carta.valor),
                entrada: formataValor(carta.entrada),
                parcela: formataValor(carta.parcela),
                // negociado
                valornegociado: formataValor(carta.valor),
                taxa: carta.taxa+'%',
                valorcomtaxa: calculaValorComTaxa(carta.valor, carta.taxa),
                valorfinal: calculaValorFinal(carta.valor, carta.entrada),
                parcelamento: calculaParcelamento(
                    calculaValorFinal(carta.valor, carta.entrada), 
                    carta.parcela
                ),
                valorconsultor: calculaValorConsultor(carta.valor)
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
            function calculaValorConsultor (valor) {
                valor = desformataValor(valor);
                return formataValor(Math.round(0.7/100*+valor));
            }

            $scope.alteraValor = function (item, $event) {
                // if (+desformataValor(item.valornegociado) < +obj.entrada) {
                //     item.valornegociado = formataValor(obj.entrada);
                //     SweetAlert.swal({ html: true, title: "Atenção", text: "Valor Negociado não pode ser abaixo do valor da Entrada!", type: "error" });
                //     return false;
                // }

                // if (($event.keyCode>=48 && $event.keyCode<=57) || ($event.keyCode>=96 && $event.keyCode<=105)) {
                    item.valorcomtaxa = calculaValorComTaxa(item.valornegociado, carta.taxa);
                    item.valorfinal = calculaValorFinal(item.valornegociado, carta.entrada);
                    item.parcelamento = calculaParcelamento(
                        item.valorfinal, 
                        carta.parcela
                    );
                // }
            }

            $scope.ok = function (obj) {

                return false;

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

                var copy = angular.copy(obj);
                copy.valoracima = desformataValor(obj.valoracima);
                copy.valorabaixo = desformataValor(obj.valorabaixo);
                copy.entradaacima = desformataValor(obj.entradaacima);
                copy.entradaabaixo = desformataValor(obj.entradaabaixo);
                copy.parcelaacima = desformataValor(obj.parcelaacima);
                copy.parecelaabaixo = desformataValor(obj.parecelaabaixo);
           
                var data = { "metodo": "filtrar", "data": copy, "class": "cartacredito", request: 'GET' };

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