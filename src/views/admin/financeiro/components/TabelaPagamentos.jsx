
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  SimpleGrid,
  Select,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useMercadoPagoAccessToken } from "./CriarAccesToken";
import { useUser } from "context/UseContext";
import { useNavigate } from "react-router-dom";
import api from "api/requisicoes";

export default function TabelaPagamentos({setPagarDispesas, obraSelecionada, setObraSelecionada}) {
  const { handleConnect } = useMercadoPagoAccessToken();
  const { pagamentos, setPagamentos, donoObra, empreiteiro, accessToken, setObras, obras } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    const tipo_usuario = localStorage.getItem("tipo_usuario")
	  const id = localStorage.getItem("id")
    
    setObraSelecionada(null)
    setPagamentos([])
    if (tipo_usuario === null && id === null) {
      navigate("/");
    }

    const fetchObras = async () => {
      try {
        if (obras.length === 0) {
          let response;
          if (empreiteiro) {
            response = await api.get(`/empreiteiro/${empreiteiro.id}/obras`);
          } else if (donoObra) {
            response = await api.get(`/dono_obra/${donoObra.id}/obras`);
          }
          if (response) {
            setObras(response.data);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar as obras:", error);
      }
    };

    fetchObras();
  }, [navigate, empreiteiro, donoObra, obras.length, setObras]);

  const fetchPagamentosPorObra = async (obraId) => {
    const obraFiltrada = obras.find((obra) => obra.id === Number(obraId));
  
    if (!obraFiltrada) {
      console.error("Obra não encontrada.");
      return;
    }
    
    if (!obraFiltrada.orcamento || !obraFiltrada.orcamento.empreiteiro) {
      console.error("Orcamento ou empreiteiro não encontrados na obra selecionada.");
      return;
    }
  
    try {
      const response = await api.get(
        `/empreiteiro/${obraFiltrada.orcamento.empreiteiro.id}/obra/${obraId}/pagamentos`
      );
      setPagamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar os pagamentos:", error);
    }
  };
  const toast = useToast();
  const handleSelectObra = (e) => {

    const selectedObraId = e.target.value;

    setObraSelecionada(selectedObraId);
    fetchPagamentosPorObra(selectedObraId);
    
    
  };

  const ButtonPagarDispesas = async () => {
    if(obraSelecionada===null){
        toast({
            title: "Obra não selecionada",
            description: `Selecione uma obra para prosseguir`,
            status: "error",
            duration: 3000,
            isClosable: true,
          })
    }else{
       setPagarDispesas(true); 
    }
    
  };
  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {empreiteiro !== null && accessToken===null ? (
        <Flex justifyContent="space-between" alignItems="center" gap="4" mb={4}>
          <Button colorScheme="blue" onClick={handleConnect}>
          Conectar Mercado Pago
        </Button>
        <Select
        width="250px"
        backgroundColor={"#e8661e"}
        color={"white"}
        placeholder="Selecione uma obra"
        onChange={handleSelectObra}
    >
        {obras.map((obra) => (
        <option key={obra.id} value={obra.id}>
            Obra: {obra.id}
        </option>
        ))}
    </Select>
        </Flex>
        
      ) : (
        <>
        {empreiteiro === null ? <>
        <Flex justifyContent="space-between" alignItems="center" gap="4" mb={4}>
            <Button backgroundColor={"#e8661e"} color={"white"} onClick={ButtonPagarDispesas}>
                Pagar dispesas da obra
            </Button>
            <Select
                width="250px"
                backgroundColor={"#e8661e"}
                color={"white"}
                placeholder="Selecione uma obra"
                onChange={handleSelectObra}
            >
                {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                    Obra: {obra.id}
                </option>
                ))}
            </Select>
        </Flex></>
        :
        <>
        <Flex justifyContent="end" alignItems="center" gap="4" mb={4}>
        <Select
                width="250px"
                backgroundColor={"#e8661e"}
                color={"white"}
                placeholder="Selecione uma obra"
                onChange={handleSelectObra}
            >
                {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                    Obra: {obra.id}
                </option>
                ))}
            </Select>
        </Flex>
        
        </>}
        
        </>
        
      )}
      <SimpleGrid gap="20px" mb="20px" backgroundColor="white" borderRadius="20px" overflow="hidden">
        

        <TableContainer>
          <Table variant="striped" backgroundColor="#f0f3f5" mb={5}>
            <TableCaption>Pagamentos</TableCaption>
            <Thead>
              <Tr>
                <Th>ID Obra</Th>
                <Th>ID Pagamento</Th>
                <Th>Data</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pagamentos.map((pagamento, index) => (
                <Tr key={index}>
                 <Td>{pagamento.obra.id}</Td>
                  <Td>{pagamento.id}</Td>
                  <Td>{new Date(pagamento.data_pagamento).toLocaleDateString()}</Td>
                  <Td>{pagamento.valor_pagamento}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </SimpleGrid>
    </Box>
  );
}
