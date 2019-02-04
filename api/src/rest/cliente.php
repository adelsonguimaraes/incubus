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
switch ($_POST['metodo']) {
	case 'cadastrar':
		cadastrar();
		break;
	case 'buscarPorId':
		buscarPorId();
		break;
	case 'listar':
		listar();
		break;
	case 'atualizar':
		atualizar();
		break;
	case 'deletar':
		deletar();
		break;
}

function cadastrar () {
	$data = $_POST['data'];
	$usuario = $_POST['usuario'];
	$obj = new Cliente(
		NULL,
		new Usuario($usuario['idusuario']),
		$data['nome'],
		$data['celular'],
		$data['email'],
		$data['status']
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
function listar () {
	$data = $_POST['data'];
	$control = new ClienteControl();
	$response = $control->listar($data['idusuario']);
	echo json_encode($response);
}
function atualizar () {
	$data = $_POST['data'];
	$obj = new Cliente(
		$data['id'],
		new Usuario($data['idusuario']),
		$data['nome'],
		$data['celular'],
		$data['email'],
		$data['status']
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