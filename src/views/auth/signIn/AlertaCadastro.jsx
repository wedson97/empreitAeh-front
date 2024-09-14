import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";

const AlertaCadastro = ({ status, titulo, descricao, duracao = 3000, visivel }) => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    if (visivel) {
      setMostrarAlerta(true);
      const timer = setTimeout(() => {
        setMostrarAlerta(false);
      }, duracao);

      return () => clearTimeout(timer);
    } else {
      setMostrarAlerta(false);
    }
  }, [visivel, duracao]);

  if (!mostrarAlerta) {
    return null; // Não renderiza o alerta se não estiver visível
  }

  return (
    <Box
      position="fixed" // Fixa no topo da tela
      top="20px" // Distância do topo
      left="50%" // Centraliza horizontalmente
      transform="translateX(-50%)" // Ajuste para centralizar completamente
      zIndex="9999" // Garante que fique acima de todos os outros elementos
      width="auto"
      maxW="90%"
    >
      <Alert status={status} variant="solid">
        <AlertIcon />
        {titulo && <AlertTitle>{titulo}</AlertTitle>}
        {descricao && <AlertDescription>{descricao}</AlertDescription>}
      </Alert>
    </Box>
  );
};

export default AlertaCadastro;
