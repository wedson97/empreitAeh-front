import React, { useState } from "react";
import TabelaPagamentos from "./components/TabelaPagamentos";
import { Box } from "@chakra-ui/react";
import PagarDispesas from "./components/PagarDispesas";

export default function Pagamentos() {
  const [pagarDispesas, setPagarDispesas] = useState(false)
  const [obraSelecionada, setObraSelecionada] = useState(null);

  return (
    <Box>
      {pagarDispesas? <PagarDispesas setPagarDispesas={setPagarDispesas} obraSelecionada={obraSelecionada}/> : <TabelaPagamentos obraSelecionada={obraSelecionada} setPagarDispesas={setPagarDispesas} setObraSelecionada={setObraSelecionada}/>}
      
      
    </Box>
  );
}
