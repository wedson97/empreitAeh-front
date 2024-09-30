import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TabelaOrcamento from "./components/TabelaOrcamento";
import NovoOrcamento from "./components/NovoOrcamento";
import { useUser } from "context/UseContext";
export default function Orcamento() {
  const [showTabela, setShowTabela] = useState(false);
  const {empreiteiro, setEmpreiteiro, donoObra, setDonoObra} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const email = localStorage.getItem("email");
    const usuario = localStorage.getItem("usuario");
    if (email === null && usuario === null) {
      navigate("/");
    }
    
  }, [navigate]);

  const handleButtonClick = () => {
    setShowTabela(!showTabela);
  };
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {empreiteiro && (
        <Button
          onClick={handleButtonClick}
          mb={4}
          backgroundColor={"#e8661e"}
          color={"white"}
        >
          {showTabela ? "Mostrar Tabela" : "Novo orçamento"}
        </Button>
      )}
      {showTabela ? <NovoOrcamento setShowTabela={setShowTabela} /> : <TabelaOrcamento />}
    </Box>
  );
}
