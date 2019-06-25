<?php
// rest : cliente

/*
	Projeto: INCUBUS - Controle de Consultoria.
	Project Owner: Raquel Araújo Queiroz.
	Desenvolvedor: Adelson Guimarães Monteiro.
	Data de início: 2019-02-02T18:48:29.166Z.
	Data Atual: 02/02/2019.
*/

//inclui autoload
require_once 'autoload.php';

//verifica requisição
$_POST['metodo']();

function cadastrar () {
	$data = $_POST['data'];
	$usuario = $_POST['usuario'];
	$obj = new Cliente(
		NULL,
		new Usuario($usuario['idusuario']),
		stripslashes(strip_tags(trim($data['nome']))),
		stripslashes(strip_tags(trim($data['celular']))),
		stripslashes(strip_tags(trim($data['email']))),
		stripslashes(strip_tags(trim($data['interesse']))),
		stripslashes(strip_tags(trim($data['valor']))),
		stripslashes(strip_tags(trim($data['entrada']))),
		stripslashes(strip_tags(trim($data['parcela']))),
		stripslashes(strip_tags(trim($data['observacao']))),
		stripslashes(strip_tags(trim($data['status'])))
	);
	$control = new ClienteControl($obj);
	$response = $control->cadastrar();
	echo json_encode($response);
}
function buscarPorId () {
	$data = $_POST['data'];
	$control = new ClienteControl(new Cliente($data['id']));
	$response = $control->buscarPorId();
	echo json_encode($response);
}
function listarTudo () {
	$data = $_POST["data"];
	$usuario = $_POST['usuario'];
	$idusuario = $usuario["idusuario"];
	if (!empty($data["idusuario"])) $idusuario = $data["idusuario"];
	$control = new ClienteControl();
	$response = $control->listarTudo($idusuario);
	echo json_encode($response);
}
function listarPaginado () {
	$data = $_POST["data"];
	$usuario = $_POST['usuario'];
	$idusuario = $usuario["idusuario"];
	if (!empty($data["idusuario"])) $idusuario = $data["idusuario"];
	$control = new ClienteControl();
	$response = $control->listarPaginado($idusuario, $data["start"], $data["limit"]);
	echo json_encode($response);
}
function listarVerNaHome () {
	$data = $_POST['data'];
	$control = new ClienteControl();
	$response = $control->listarVerNaHome($data['idusuario']);
	echo json_encode($response);
}
function filtrar () {
	$data = $_POST['data'];
	$usuario = $_POST['usuario'];
	$control = new ClienteControl();
	$response = $control->filtrar($usuario['idusuario'], $data);
	echo json_encode($response);
}
function atualizar () {
	$data = $_POST['data'];
	$obj = new Cliente(
		$data['id'],
		new Usuario($data['idusuario']),
		stripslashes(strip_tags(trim($data['nome']))),
		stripslashes(strip_tags(trim($data['celular']))),
		stripslashes(strip_tags(trim($data['email']))),
		stripslashes(strip_tags(trim($data['interesse']))),
		stripslashes(strip_tags(trim($data['valor']))),
		stripslashes(strip_tags(trim($data['entrada']))),
		stripslashes(strip_tags(trim($data['parcela']))),
		stripslashes(strip_tags(trim($data['observacao']))),
		stripslashes(strip_tags(trim($data['status']))),
		($data['verhome'] ? 'SIM' : 'NAO')
	);
	$control = new ClienteControl($obj);
	$response = $control->atualizar();
	echo json_encode($response);
}
function deletar () {
	$data = $_POST['data'];
	$banco = new Cliente();
	$banco->setId($data['id']);
	$control = new ClienteControl($banco);
	echo json_encode($control->deletar());
}


// Classe gerada com BlackCoffeePHP 2.0 - by Adelson Guimarães
?>