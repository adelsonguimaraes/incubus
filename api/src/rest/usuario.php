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
	$usuario = $_POST["usuario"];

	// verificando se o email já está cadastrado
	$control = new UsuarioControl();
	$resp = $control->buscarPorEmail($data['email']);
	if ($resp['success']===false) die (json_encode($resp));
	if (!empty($resp['data'])) {
		$resp['success'] = false;
		$resp['msg'] = "Este email já está uso no sistema";
		die (json_encode($resp));
	}
	
	$obj = new Usuario();
	$obj->setObjusuario($usuario["idusuario"])
		->setNome($data['nome'])
		->setEmail($data['email'])
		->setSenha("incubus@123")
		->setPorcentagem($data['porcentagem']);
	$control = new UsuarioControl($obj);
	$response = $control->cadastrar();
	if ($response["success"]===false) die (json_encode($response));
	$idconsultor = $response['data'];

	// cadastrando os menus do consultor
	$control = new UsuarioControl();
	$resp = $control->setMenuConsultor($idconsultor);
	if ($resp["success"]===false) die (json_decode($resp));

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
	$obj = new Usuario();
	$obj->setId($data['id'])
		->setNome($data['nome'])
		->setEmail($data['email'])
		->setSenha("incubus@123")
		->setPorcentagem($data['porcentagem']);
	$control = new UsuarioControl($obj);
	$response = $control->atualizar();
	echo json_encode($response);
}

function atualizarMeusDados () {
	$files = null;
	if (!empty($_POST['files'])) $files = json_decode($_POST['files']);

	$data = (array) json_decode($_POST['data']);

	// função responsável por upload de arquivos
	$uploadFiles = new uploadFiles();
	if ($files === NULL) {
		// upload fia $_files
		$resp = $uploadFiles->upload();
	}else{
		// upload via base64
		$resp = $uploadFiles->upload2($files, $data['email']);
	}
	
	// $resp = $uploadFiles->upload();
	$filesFeed = $resp['data']; // getando o retorno de arquivos enviados
	$foto = empty($filesFeed) ? "" : $filesFeed[0]; // verifica se houve fotos enviadas

	$obj = new Usuario();
	$obj->setId($data['id'])
		->setNome($data['nome'])
		->setEmail($data['email'])
		->setCelular($data['celular'])
		->setSenha($data['senha'])
		->setFoto($foto);
	
	$control = new UsuarioControl($obj);
	$resp = $control->atualizarMeusDados();
	echo json_encode($resp);
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