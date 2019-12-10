angular.module(module).controller('homeCtrl', function ($rootScope, $scope, authenticationAPI, genericAPI, $location, SweetAlert, $uibModal, $timeout, $interval) {
    //Verifica Sessao e permissão de acesso
    // if (!$rootScope.usuario) { $location.path("/login"); return false; }

    function reset () {
        $scope.view = 1; // a tela atual que o jogo se encontra
        $scope.jogo = {
            tempo: 30,
            jogadores: [
                {
                    index: 1,
                    nome: 'Maquina 1',
                    moeda: 5,
                    player: false,
                    jogada: null
                },
                {
                    index: 2,
                    nome: 'Maquina 2',
                    moeda: 5,
                    player: false,
                    jogada: null
                }
            ]
        }
        $scope.jogador = null;
    }
    reset();

    $scope.entrar = function (obj) {
        $scope.jogador = {
            index: $scope.jogo.jogadores.length, 
            nome: obj.nome,
            moeda: 5,
            player: true,
            jogada: null
        };
        $scope.jogo.jogadores.push($scope.jogador);
        if ($scope.jogador!==null) $scope.view = 2;
        tempo();
    }

    var t;
    // contador do tempo
    function tempo () {
        t = $interval(function () {
            $scope.jogo.tempo--;
            if ($scope.jogo.tempo<=0) {
                $interval.cancel(t);
                forcandoJogada();
            }
        }, 1000);
    };

    // butão de jogada que o player usa para escolher a jogada
    $scope.btn = null;
    $scope.setButton = function (b) {
        $scope.btn = b;
    }

    // função qunado o próprio jogador clica no botão de jogar
    $scope.jogando = function () {
        var index = $scope.jogador.index;
        $scope.jogo.jogadores[index].jogada = $scope.btn;
        $interval.cancel(t);
        maquinasJogando();
        console.log("JOGADA PLAYER", $scope.jogo.jogadores);
        $scope.view = 3;
        rodada();
    }

    // função que força jogada do player quando o tempo de jogada acaba
    function forcandoJogada () {
        var index = $scope.jogador.index;
        if ($scope.btn == null && $scope.jogo.jogadores[index].jogada == null) {
            $scope.jogo.jogadores[index].jogada = randomPlay();
        }
        $interval.cancel(t);
        maquinasJogando();
        console.log("JOGADA FORÇADA", $scope.jogo.jogadores);
        $scope.view = 3;
        rodada();
    }

    function randomPlay () {
        var j = null;
        while(j == null ) {
            var r = Math.floor(Math.random() * 20);
            if (r==0) j = 'pedra';
            if (r==1) j = 'papel';
            if (r==2) j = 'tesoura';
        }
        return j;
    }

    // função que simula a jogada das maquinas
    function maquinasJogando () {
        for (f of $scope.jogo.jogadores) {
            if (!f.player) {
                f.jogada = randomPlay();
            }
        }
    }

    $scope.rodada = [];
    function rodada () {
        // var i = $interval(function () {
        //     $scope.rodada.push({
        //         jogador1: $scope.jogo.jogadores[0].nome,
        //         jogada1: $scope.jogo.jogadores[0].jogada,
        //         jogador2: $scope.jogo.jogadores[1].nome,
        //         jogada2: $scope.jogo.jogadores[1].jogada
        //     });
        // }, 5000)
        $scope.rodada = [{
            jogador1: $scope.jogo.jogadores[0].nome,
            jogada1: $scope.jogo.jogadores[0].jogada,
            jogador2: $scope.jogo.jogadores[1].nome,
            jogada2: $scope.jogo.jogadores[1].jogada
        },{
            jogador1: $scope.jogo.jogadores[0].nome,
            jogada1: $scope.jogo.jogadores[0].jogada,
            jogador2: $scope.jogo.jogadores[2].nome,
            jogada2: $scope.jogo.jogadores[2].jogada
        },{
            jogador1: $scope.jogo.jogadores[1].nome,
            jogada1: $scope.jogo.jogadores[1].jogada,
            jogador2: $scope.jogo.jogadores[2].nome,
            jogada2: $scope.jogo.jogadores[2].jogada
        }];
    }

});