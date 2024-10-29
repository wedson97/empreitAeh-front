import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Heading,
  Flex,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";

export default function PagarDispesas({ setPagarDispesas, obraSelecionada }) {
  const { obras, accessToken } = useUser();
  const navigate = useNavigate();
  const [valorPagamento, setValorPagamento] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controle do modal

  const obraParaPagar = obras.find((obra) => obra.id === Number(obraSelecionada));
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const email = localStorage.getItem("email");
    const usuario = localStorage.getItem("usuario");

    if (!email && !usuario) {
      navigate("/");
    }
  }, [navigate]);

  const handlePaymentMercadoPago = async () => {
    if (Number(valorPagamento) === 0 || valorPagamento === "") {
      toast({
        title: "Valor inválido.",
        description: "Por favor, insira um valor válido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            items: [
              {
                title: "Pagamento para serviço de pedreiro",
                unit_price: 1,
                quantity: Number(valorPagamento),
              },
            ],
            back_urls: {
              success: "https://empreit-aeh-front.vercel.app/admin/pagamentos",
              failure: "https://empreit-aeh-front.vercel.app/admin/pagamentos",
              pending: "https://empreit-aeh-front.vercel.app/admin/pagamentos",
            },
            auto_return: "approved",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ${response.status}: ${errorData.message || "Erro ao criar o pagamento"}`);
        }

        const paymentData = await response.json();
        window.location.href = paymentData.init_point;
      } catch (error) {
        console.error("Erro ao processar o pagamento:", error);
      }
    }
  };

  const handlePaymentRegistro = async () => {
    const formdata = {
      valor_pagamento: Number(valorPagamento),
      data_pagamento: new Date().toISOString(),
    };

    if (valorPagamento <= 0) {
      toast({
        title: "Valor inválido.",
        description: "Por favor, insira um valor válido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await api.post(
        `/empreiteiro/${obraParaPagar.orcamento.empreiteiro.id}/obra/${obraParaPagar.id}/pagamentos`,
        formdata
      );
      toast({
        title: "Pagamento realizado",
        description: "Pagamento realizado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose(); 
    } catch (error) {
      console.error("Erro ao processar o pagamento:", error);
      toast({
        title: "Erro no pagamento.",
        description: "Houve um problema ao processar o pagamento.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  console.log();
  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} p={4} bg="gray.50" borderRadius="lg" boxShadow="md">
      <Button backgroundColor={"#e8661e"} color={"white"} onClick={() => setPagarDispesas(false)} mb={4}>
        Voltar
      </Button>

      <Flex spacing={6} align="start">
        <Box bg="white" p={6} borderRadius="md" boxShadow="md" flex="1" mr={4}>
          <Heading size="lg" mb={4}>Detalhes da Obra</Heading>
          <Divider mb={4} />
          {obraParaPagar ? (
            <VStack spacing={2} align="start">
              <Text fontWeight="bold">ID da Obra: {obraParaPagar.id}</Text>
              <Text fontWeight="bold">Endereço:</Text>
              <Text>Rua: {obraParaPagar.endereco.rua}</Text>
              <Text>Bairro: {obraParaPagar.endereco.bairro}</Text>
              <Text>Cidade: {obraParaPagar.endereco.cidade}</Text>
              <Text>Número: {obraParaPagar.endereco.numero}</Text>
              <Text fontWeight="bold">Descrição:</Text>
              <Text>{obraParaPagar.orcamento.descricao}</Text>
            </VStack>
          ) : (
            <Text>Obra não encontrada.</Text>
          )}
        </Box>

        <VStack spacing={4} align="start" flex="1">
          <Divider />
          <Text fontWeight="bold">Valor a Pagar:</Text>
          <Input
            type="number"
            placeholder="Valor a pagar"
            value={valorPagamento}
            onChange={(e) => setValorPagamento(e.target.value)}
            width="250px"
            size="lg"
            bg="white"
            borderColor="teal.300"
            _hover={{ borderColor: "teal.500" }}
            _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
          />
          <Button colorScheme="teal" onClick={onOpen} size="lg" width="100%">
            Pagar
          </Button>
          <Button colorScheme="teal" onClick={handlePaymentMercadoPago} size="lg" width="100%">
            Pagar com Mercado Pago
          </Button>
        </VStack>
      </Flex>

      {/* Modal de Confirmação */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Tem certeza de que deseja realizar o pagamento de R$ {valorPagamento} para {obraParaPagar.orcamento.empreiteiro.nome}?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="teal" onClick={handlePaymentRegistro}>
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
