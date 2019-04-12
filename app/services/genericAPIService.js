angular.module(module).service("genericAPI", function ($http, $rootScope, authenticationAPI) {

    function _generic (data, scope) {
        // autenticando o acesso
        if (!authenticationAPI.auth()) return false;
        return $http({
            method: 'POST',
            url: api + "src/rest/autoload.php",
            timeout: (data.timeout!==undefined) ? data.timeout : 60,
            data: {
                metodo: data.metodo,
                data: data.data,
                class: data.class,
                usuario: $rootScope.usuario
            }
        });
    };

    return {
        generic: _generic
    };
});