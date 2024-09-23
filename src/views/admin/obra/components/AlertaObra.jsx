import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { useUser } from "context/UseContext";

const AlertaObra = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const {alertaObra, setAlertaObra} = useUser();

  useEffect(() => {
    if (alertaObra.visivel) {
      setMostrarAlerta(true);
      const timer = setTimeout(() => {
        setMostrarAlerta(false);
      }, alertaObra.duracao);

      return () => clearTimeout(timer);
    } else {
      setMostrarAlerta(false);
    }
  }, [alertaObra.visivel, alertaObra.duracao]);

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
      <Alert status={alertaObra.status} variant="solid">
        <AlertIcon />
        {alertaObra.titulo && <AlertTitle>{alertaObra.titulo}</AlertTitle>}
        {alertaObra.descricao && <AlertDescription>{alertaObra.descricao}</AlertDescription>}
      </Alert>
    </Box>
  );
};

export default AlertaObra;
