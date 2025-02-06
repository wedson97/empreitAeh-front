import React, { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TabelaObras from "./components/TabelaObras";
import GerenciarObra from "./components/GerenciarObra";
import { useUser } from "context/UseContext";
export default function Obra() {
  const navigate = useNavigate();
  const [mostrarTabela, setMostrarTabela] = useState(false);
  const [mostrarBotoesTabela, setMostrarBotoesTabela] = useState(false);
  const [mostrarAtividades, setMostrarAtividades] = useState(false);
  const [gerenciarObra, setGerenciarObra] = useState(0);
  const {setAtividades} = useUser();

  const handleGerenciar=(row)=>{
    setMostrarTabela(!mostrarTabela)
    setGerenciarObra(row)
    setMostrarBotoesTabela(true)
  }

  const handleAtividades=()=>{
    setMostrarAtividades(!mostrarAtividades);
    setMostrarBotoesTabela(!mostrarTabela)
    setMostrarBotoesTabela(!mostrarBotoesTabela)
  }

  const handleVoltarTabela = () => {
    setMostrarTabela(!mostrarTabela);
    setMostrarBotoesTabela(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const tipo_usuario = localStorage.getItem("tipo_usuario")
	  const id = localStorage.getItem("id")
    if (tipo_usuario === null && id === null) {
      navigate("/");
    }
    
  }, [navigate]);


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {mostrarBotoesTabela===false?
       null:<>
       <Button
         onClick={handleVoltarTabela}
         mb={4}
         backgroundColor={"#e8661e"}
         color={"white"}
       >
         Voltar
       </Button>
       <Button
         onClick={handleAtividades}
         mb={4}
         backgroundColor={"#e8661e"}
         color={"white"}
         ml={"1"}
       >
         Novas atividades
       </Button>
     </>}
       {mostrarTabela ? <GerenciarObra mostrarBotoesTabela={mostrarBotoesTabela} setMostrarBotoesTabela={setMostrarBotoesTabela} mostrarAtividades={mostrarAtividades} handleAtividades={handleAtividades} gerenciarObra={gerenciarObra} />: <TabelaObras handleGerenciar={handleGerenciar} />} 
       
    </Box>
  );
}
