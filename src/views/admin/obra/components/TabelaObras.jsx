import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
  Text
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoMdEye, IoMdClock } from "react-icons/io";
import api from "api/requisicoes";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";
import PdfObra from "./PdfObra";

export default function TabelaObras() {
  const { obras, setObras } = useUser();
  const { empreiteiro, setEmpreiteiro } = useUser();
  const navigate = useNavigate();
  const [isPdfVisible, setPdfVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEmpreiteiro = async () => {
      try {
        const empreiteiros = await api.get("/empreiteiros");
        const nome_empreiteiro_logado = localStorage.getItem("usuario");

        const empreiteiroFiltrado = empreiteiros.data.filter(e => e.nome === nome_empreiteiro_logado);
        if (empreiteiroFiltrado.length > 0) {
          setEmpreiteiro(empreiteiroFiltrado[0]);
          const empreiteiroId = empreiteiroFiltrado[0].id;
          const response = await api.get(`/empreiteiro/${empreiteiroId}/obras`);
          setObras(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar os empreiteiros ou orçamentos:", error);
      }
    };

    fetchEmpreiteiro();
  }, [navigate]);

  const getStatusIcon = (row) => {
    if (row.orcamento.data_aprovacao !== null) {
      return { status: "Em Andamento", icon: IoMdClock, color: "blue.600" };
    }
    return { status: "Pendente", icon: IoMdClock, color: "yellow.600" };
  };

  const handleViewPdf = (row) => {
    setSelectedRow(row);
    setPdfVisible(true);
  };

  return (
    <SimpleGrid gap='20px' mb='20px' backgroundColor="white" borderRadius="20px" overflow="hidden">
      <TableContainer>
        <Table variant="striped" backgroundColor="#f0f3f5">
          <TableCaption>Registro de obras</TableCaption>
          <Thead>
            <Tr>
              <Th>Dono da obra</Th>
              <Th>Data de início</Th>
              <Th>Previsão de término</Th>
              <Th>Status</Th>
              <Th>Visualizar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {obras.map((row, index) => {
              const { status, icon, color } = getStatusIcon(row);
              return (
                <Tr key={index}>
                  <Td>{row.orcamento.dono_obra.nome}</Td>
                  <Td>{new Date(row.orcamento.data_inicio).toLocaleDateString('pt-BR')}</Td>
                  <Td>{new Date(row.orcamento.data_termino).toLocaleDateString('pt-BR')}</Td>
                  <Td>
                    <Flex align="center">
                      <Icon as={icon} color={color} boxSize={6} />
                      <Text fontSize="sm" fontWeight="700" ml={2}>
                        {status}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <IconButton
                      backgroundColor="#e8661e"
                      color="white"
                      aria-label="Visualizar"
                      icon={<IoMdEye />}
                      onClick={() => handleViewPdf(row)}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {isPdfVisible && <PdfObra row={selectedRow} setPdfVisible={setPdfVisible} />}
    </SimpleGrid>
  );
}
