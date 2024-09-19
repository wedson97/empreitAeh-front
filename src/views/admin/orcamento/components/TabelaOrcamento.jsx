
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
  import React from "react";
  import {
    MdCheckCircle,
    MdOutlineError
  } from "react-icons/md";
  import { IoMdEye, IoMdClock, IoMdHammer   } from "react-icons/io";
  
  export default function TabelaOrcamento() {
    const response = [
      { donoObra: "wedson", data: "18/09/2024", status: "Finalizado" },
      { donoObra: "alysson", data: "18/09/2024", status: "Em Andamento" },
      { donoObra: "alysson", data: "18/09/2024", status: "Em Analise" },
      { donoObra: "alysson", data: "18/09/2024", status: "Pendente" }
    ];
    const getStatusIcon = (status) => {
      switch (status) {
        case "Finalizado":
          return { icon: MdCheckCircle, color: "green" };
        case "Em Andamento":
          return { icon: IoMdHammer , color: "black" };
        case "Em Analise":
          return { icon: IoMdClock , color: "blue.600" };
        case "Pendente":
          return { icon: MdOutlineError , color: "yellow.600" };
        default:
          return null;
      }
    };
    return (
        <SimpleGrid  gap='20px' mb='20px' backgroundColor="white" borderRadius="20px" overflow="hidden">
        <TableContainer>
          <Table variant="striped" backgroundColor="#f0f3f5">
            <TableCaption>Registro de orçamentos</TableCaption>
            <Thead>
              <Tr>
                <Th>Dono da obra</Th>
                <Th>Data do orçamento</Th>
                <Th>Status</Th>
                <Th>Visualizar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {response.map((row, index) => {
                const { icon, color } = getStatusIcon(row.status);
                return (
                  <Tr key={index}>
                    <Td>{row.donoObra}</Td>
                    <Td>{row.data}</Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={icon} color={color} boxSize={6} />
                        <Text fontSize="sm" fontWeight="700" ml={2}>
                          {row.status}
                        </Text>
                      </Flex>
                    </Td>
                    <Td>
                      <IconButton
                        backgroundColor="#e8661e"
                        color="white"
                        aria-label="Visualizar"
                        icon={<IoMdEye />}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        </SimpleGrid>
        
    );
  }
  