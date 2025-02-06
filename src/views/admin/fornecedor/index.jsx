import React, { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import NovoFuncionario from "./components/NovoFornecedor";
import { useNavigate } from "react-router-dom";
import TabelaFornecedor from "./components/TabelaFornecedor";
import NovoFornecedor from "./components/NovoFornecedor";

export default function Fornecedor() {
  const navegate = useNavigate();
  const [mostrarTabela, setMostrarTabela] = useState(true);
  const [mostrarBotaoTabela, setMostrarBotaoTabela] = useState(true);
  const [mostrarBotaoVoltarEditar, setMostrarBotaoVoltarEditar] = useState(false);
  const handleMostrar=()=>{
    setMostrarTabela(!mostrarTabela)
    setMostrarBotaoTabela(!mostrarBotaoTabela)
  }
  useEffect( () => {
    window.scrollTo(0, 0);
    const tipo_usuario = localStorage.getItem("tipo_usuario")
	  const id = localStorage.getItem("id")
    if( tipo_usuario===null && id===null){
      navegate("/")
    }
  },[] );

  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {mostrarBotaoVoltarEditar?<></>:<Button
        onClick={handleMostrar}
        mb={4}
        backgroundColor={"#e8661e"}
        color={"white"}
      >
        {mostrarBotaoTabela ? "Cadastrar fornecedor" : "Voltar"}
      </Button>}
      {mostrarTabela ?<TabelaFornecedor handleMostrar={handleMostrar} mostrarTabela={mostrarTabela} setMostrarBotaoVoltarEditar={setMostrarBotaoVoltarEditar} mostrarBotaoVoltarEditar={mostrarBotaoVoltarEditar}/>: <NovoFornecedor handleMostrar={handleMostrar} /> }
      
    </Box>
  );
}
