<?php
// model : logemail

/*
	Projeto: INCUBUS - Gestão de Consultoria de Vendas.
	Project Owner: Raquel Queiroz.
	Desenvolvedor: Adelson Guimaraes Monteiro.
	Data de início: 2019-08-07T21:19:55.838Z.
	Data Atual: 07/08/2019.
*/

Class Logemail implements JsonSerializable {
	//atributos
	private $id;
	private $idclasse;
	private $classe;
	private $destinatario;
	private $status;
	private $observacao;
	private $datacadastro;

	//constutor
	public function __construct
	(
		$id = NULL,
		$idclasse = NULL,
		$classe = NULL,
		$destinatario = NULL,
		$status = NULL,
		$observacao = NULL,
		$datacadastro = NULL
	)
	{
		$this->id	= $id;
		$this->idclasse	= $idclasse;
		$this->classe	= $classe;
		$this->destinatario	= $destinatario;
		$this->status	= $status;
		$this->observacao	= $observacao;
		$this->datacadastro	= $datacadastro;
	}

	//Getters e Setters
	public function getId() {
		return $this->id;
	}
	public function setId($id) {
		$this->id = $id;
		return $this;
	}
	public function getIdclasse() {
		return $this->idclasse;
	}
	public function setIdclasse($idclasse) {
		$this->idclasse = $idclasse;
		return $this;
	}
	public function getClasse() {
		return $this->classe;
	}
	public function setClasse($classe) {
		$this->classe = $classe;
		return $this;
	}
	public function getDestinatario() {
		return $this->destinatario;
	}
	public function setDestinatario($destinatario) {
		$this->destinatario = $destinatario;
		return $this;
	}
	public function getStatus() {
		return $this->status;
	}
	public function setStatus($status) {
		$this->status = $status;
		return $this;
	}
	public function getObservacao() {
		return $this->observacao;
	}
	public function setObservacao($observacao) {
		$this->observacao = $observacao;
		return $this;
	}
	public function getDatacadastro() {
		return $this->datacadastro;
	}
	public function setDatacadastro($datacadastro) {
		$this->datacadastro = $datacadastro;
		return $this;
	}

	//Json Serializable
	public function JsonSerialize () {
		return [
			"id"	=> $this->id,
			"idclasse"	=> $this->idclasse,
			"classe"	=> $this->classe,
			"destinatario"	=> $this->destinatario,
			"status"	=> $this->status,
			"observacao"	=> $this->observacao,
			"datacadastro"	=> $this->datacadastro
		];
	}
}

// Classe gerada com BlackCoffeePHP 2.0 - by Adelson Guimarães
?>