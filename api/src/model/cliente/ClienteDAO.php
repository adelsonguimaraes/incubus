<?php
// dao : cliente

/*
	Projeto: INCUBUS - Controle de Consultoria.
	Project Owner: Raquel Araújo Queiroz.
	Desenvolvedor: Adelson Guimarães Monteiro.
	Data de início: 2019-02-02T18:48:29.166Z.
	Data Atual: 02/02/2019.
*/

Class ClienteDAO {
	//atributos
	private $con;
	private $sql;
	private $obj;
	private $lista = array();
	private $superdao;

	//construtor
	public function __construct($con) {
		$this->con = $con;
		$this->superdao = new SuperDAO('cliente');
	}

	//cadastrar
	function cadastrar (cliente $obj) {
		$this->sql = sprintf("INSERT INTO cliente(idusuario, nome, celular, email, interesse, valor, entrada, parcela, observacao, status)
		VALUES(%d, '%s', '%s', '%s', '%s', %f, %f, %f, '%s', '%s')",
			mysqli_real_escape_string($this->con, $obj->getObjusuario()->getId()),
			mysqli_real_escape_string($this->con, $obj->getNome()),
			mysqli_real_escape_string($this->con, $obj->getCelular()),
			mysqli_real_escape_string($this->con, $obj->getEmail()),
			mysqli_real_escape_string($this->con, $obj->getInteresse()),
			mysqli_real_escape_string($this->con, $obj->getValor()),
			mysqli_real_escape_string($this->con, $obj->getEntrada()),
			mysqli_real_escape_string($this->con, $obj->getParcela()),
			mysqli_real_escape_string($this->con, $obj->getObservacao()),
			mysqli_real_escape_string($this->con, $obj->getStatus()));

		$this->superdao->resetResponse();

		if(!mysqli_query($this->con, $this->sql)) {
			$this->superdao->setMsg( resolve( mysqli_errno( $this->con ), mysqli_error( $this->con ), get_class( $obj ), 'Cadastrar' ) );
		}else{
			$id = mysqli_insert_id( $this->con );

			$this->superdao->setSuccess( true );
			$this->superdao->setData( $id );
		}
		return $this->superdao->getResponse();
	}

	//atualizar
	function atualizar (Cliente $obj) {
		$this->sql = sprintf("UPDATE cliente SET idusuario = %d, nome = '%s', celular = '%s', email = '%s', interesse = '%s', valor = %f, entrada = %f, parcela = %f, observacao = '%s', status = '%s', dataedicao = '%s' WHERE id = %d ",
			mysqli_real_escape_string($this->con, $obj->getObjusuario()->getId()),
			mysqli_real_escape_string($this->con, $obj->getNome()),
			mysqli_real_escape_string($this->con, $obj->getCelular()),
			mysqli_real_escape_string($this->con, $obj->getEmail()),
			mysqli_real_escape_string($this->con, $obj->getInteresse()),
			mysqli_real_escape_string($this->con, $obj->getValor()),
			mysqli_real_escape_string($this->con, $obj->getEntrada()),
			mysqli_real_escape_string($this->con, $obj->getParcela()),
			mysqli_real_escape_string($this->con, $obj->getObservacao()),
			mysqli_real_escape_string($this->con, $obj->getStatus()),
			mysqli_real_escape_string($this->con, date('Y-m-d H:i:s')),
			mysqli_real_escape_string($this->con, $obj->getId()));
		$this->superdao->resetResponse();

		if(!mysqli_query($this->con, $this->sql)) {
			$this->superdao->setMsg( resolve( mysqli_errno( $this->con ), mysqli_error( $this->con ), get_class( $obj ), 'Atualizar' ) );
		}else{
			$this->superdao->setSuccess( true );
			$this->superdao->setData( true );
		}
		return $this->superdao->getResponse();
	}

	//buscarPorId
	function buscarPorId (Cliente $obj) {
		$this->sql = sprintf("SELECT * FROM cliente WHERE id = %d",
			mysqli_real_escape_string($this->con, $obj->getId()));
		$result = mysqli_query($this->con, $this->sql);

		$this->superdao->resetResponse();

		if(!$result) {
			$this->superdao->setMsg( resolve( mysqli_errno( $this->con ), mysqli_error( $this->con ), get_class( $obj ), 'BuscarPorId' ) );
		}else{
			while($row = mysqli_fetch_object($result)) {
				$this->obj = $row;
			}
			$this->superdao->setSuccess( true );
			$this->superdao->setData( $this->obj );
		}
		return $this->superdao->getResponse();
	}

	//listar
	function listar ($idusuario) {
		$this->sql = "SELECT * FROM cliente where idusuario = $idusuario";
		$result = mysqli_query($this->con, $this->sql);

		$this->superdao->resetResponse();

		if(!$result) {
			$this->superdao->setMsg( resolve( mysqli_errno( $this->con ), mysqli_error( $this->con ), 'Cliente' , 'Listar' ) );
		}else{
			while($row = mysqli_fetch_object($result)) {
				array_push($this->lista, $row);
			}
			$this->superdao->setSuccess( true );
			$this->superdao->setData( $this->lista );
		}
		return $this->superdao->getResponse();
	}

	//listar paginado
	function listarPaginado($start, $limit) {
		$this->sql = "SELECT * FROM cliente limit " . $start . ", " . $limit;
		$result = mysqli_query ( $this->con, $this->sql );

		$this->superdao->resetResponse();

		if ( !$result ) {
			$this->superdao->setMsg( resolve( mysqli_errno( $this->con ), mysqli_error( $this->con ), 'Cliente' , 'ListarPaginado' ) );
		}else{
			while ( $row = mysqli_fetch_assoc ( $result ) ) {				array_push( $this->lista, $row);
			}

			$this->superdao->setSuccess( true );			$this->superdao->setData( $this->lista );
			$this->superdao->setTotal( $this->qtdTotal() );
		}

		return $this->superdao->getResponse();
	}
	//deletar
	function deletar (Cliente $obj) {
		$this->superdao->resetResponse();

		// buscando por dependentes
		$dependentes = $this->superdao->verificaDependentes($obj->getId());
		if ( $dependentes > 0 ) {
			$this->superdao->setMsg( resolve( '0001', $dependentes, get_class( $obj ), 'Deletar' ));
			return $this->superdao->getResponse();
		}

		$this->sql = sprintf("DELETE FROM cliente WHERE id = %d",
			mysqli_real_escape_string($this->con, $obj->getId()));
		$result = mysqli_query($this->con, $this->sql);

		if ( !$result ) {
			$this->superdao->setMsg( resolve( mysqli_errno( $this->con ), mysqli_error( $this->con ), get_class( $obj ), 'Deletar' ));
			return $this->superdao->getResponse();
		}

		$this->superdao->setSuccess( true );
		$this->superdao->setData( true );

		return $this->superdao->getResponse();
	}

	//quantidade total
	function qtdTotal() {
		$this->sql = "SELECT count(*) as quantidade FROM cliente";
		$result = mysqli_query ( $this->con, $this->sql );
		if (! $result) {
			die ( '[ERRO]: ' . mysqli_error ( $this->con ) );
		}
		$total = 0;
		while ( $row = mysqli_fetch_object ( $result ) ) {
			$total = $row->quantidade;
		}
		return $total;
	}
}

// Classe gerada com BlackCoffeePHP 2.0 - by Adelson Guimarães
?>