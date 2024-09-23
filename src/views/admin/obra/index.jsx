import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TabelaObras from "./components/TabelaObras";
import NovoObra from "./components/NovoObra";
export default function Obra() {
  const [showTabela, setShowTabela] = useState(false);
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
      <Button onClick={handleButtonClick} mb={4} backgroundColor={"#e8661e"} color={"white"}>
        {showTabela ?"Mostrar Tabela":  "Nova obra" }
      </Button>
      {showTabela ? <NovoObra setShowTabela={setShowTabela}/>: <TabelaObras /> }
    </Box>
  );
}
