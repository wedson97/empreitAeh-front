import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { useUser } from "context/UseContext";

const AlertaCadastro = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const {alertaCadastro, setAlertaCadastro} = useUser();

  useEffect(() => {
    if (alertaCadastro.visivel) {
      setMostrarAlerta(true);
      const timer = setTimeout(() => {
        setMostrarAlerta(false);
      }, alertaCadastro.duracao);

      return () => clearTimeout(timer);
    } else {
      setMostrarAlerta(false);
    }
  }, [alertaCadastro.visivel, alertaCadastro.duracao]);

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
      <Alert status={alertaCadastro.status} variant="solid">
        <AlertIcon />
        {alertaCadastro.titulo && <AlertTitle>{alertaCadastro.titulo}</AlertTitle>}
        {alertaCadastro.descricao && <AlertDescription>{alertaCadastro.descricao}</AlertDescription>}
      </Alert>
    </Box>
  );
};

export default AlertaCadastro;
