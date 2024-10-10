import React, { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import TabelaFuncionario from "./components/TabelaFuncionario";
import NovoFuncionario from "./components/NovoFuncionario";
import { useNavigate } from "react-router-dom";
export default function Funcionario() {
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
    const email = localStorage.getItem("email")
    const usuario = localStorage.getItem("usuario")
    if( email===null && usuario===null){
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
        {mostrarBotaoTabela ? "Cadastrar funcionário" : "Voltar"}
      </Button>}
      {mostrarTabela ?<TabelaFuncionario handleMostrar={handleMostrar} mostrarTabela={mostrarTabela} setMostrarBotaoVoltarEditar={setMostrarBotaoVoltarEditar} mostrarBotaoVoltarEditar={mostrarBotaoVoltarEditar}/>: <NovoFuncionario handleMostrar={handleMostrar} /> }
      
    </Box>
  );
}
