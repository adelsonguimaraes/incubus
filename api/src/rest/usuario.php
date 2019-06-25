<?php
// rest : usuario

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
	$obj = new Usuario(
		NULL,
		$data['perfil'],
		$data['nome'],
		$data['celular'],
		$data['email']
	);
	$control = new UsuarioControl($obj);
	$response = $control->cadastrar();
	echo json_encode($response);
}
function buscarPorId () {
	$data = $_POST['data'];
	$control = new UsuarioControl(new Usuario($data['id']));
	$response = $control->buscarPorId();
	echo json_encode($response);
}
function listar () {
	$control = new UsuarioControl(new Usuario);
	$response = $control->listar();
	echo json_encode($response);
}
function listarPorSuperior () {
	$usuario = $_POST["usuario"];
	$usuarioControl = new UsuarioControl();
	echo json_encode($usuarioControl->listarPorSuperior($usuario["idusuario"]));
}
function atualizar () {
	$data = $_POST['data'];
	$obj = new Usuario(
		$data['id'],
		$data['perfil'],
		$data['nome'],
		$data['celular'],
		$data['email']
	);
	$control = new UsuarioControl($obj);
	$response = $control->atualizar();
	echo json_encode($response);
}
function deletar () {
	$data = $_POST['data'];
	$banco = new Usuario();
	$banco->setId($data['id']);
	$control = new UsuarioControl($banco);
	echo json_encode($control->deletar());
}


// Classe gerada com BlackCoffeePHP 2.0 - by Adelson Guimarães
?>