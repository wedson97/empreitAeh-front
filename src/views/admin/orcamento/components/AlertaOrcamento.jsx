import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { useUser } from "context/UseContext";

const AlertaOrcamento = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const {alertaOrcamento, setAlertaOrcamento} = useUser();

  useEffect(() => {
    if (alertaOrcamento.visivel) {
      setMostrarAlerta(true);
      const timer = setTimeout(() => {
        setMostrarAlerta(false);
      }, alertaOrcamento.duracao);

      return () => clearTimeout(timer);
    } else {
      setMostrarAlerta(false);
    }
  }, [alertaOrcamento.visivel, alertaOrcamento.duracao]);

  if (!mostrarAlerta) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top="20px"
      left="50%"
      transform="translateX(-50%)"
      zIndex="9999"
      width="auto"
      maxW="90%"
    >
      <Alert status={alertaOrcamento.status} variant="solid">
        <AlertIcon />
        {alertaOrcamento.titulo && <AlertTitle>{alertaOrcamento.titulo}</AlertTitle>}
        {alertaOrcamento.descricao && <AlertDescription>{alertaOrcamento.descricao}</AlertDescription>}
      </Alert>
    </Box>
  );
};

export default AlertaOrcamento;
