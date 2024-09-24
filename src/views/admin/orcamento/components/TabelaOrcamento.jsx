
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
  import React, { useEffect, useState} from "react";
  import { IoMdEye, IoMdClock, IoMdHammer } from "react-icons/io";
  import { MdCheckCircle } from "react-icons/md";
import api from "api/requisicoes";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";
import PdfOrcamento from "./PdfOrcamento";
  
export default function TabelaOrcamento() {
    const {orcamentos, setOrcamentos} = useUser()
    const [isPdfVisible, setPdfVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
      window.scrollTo(0, 0);
  
      const fetchEmpreiteiro = async () => {
        const email = localStorage.getItem("email");
        const usuario = localStorage.getItem("usuario");
  
        if (email === null && usuario === null) {
          navigate("/");
        } else {
          try {
            const empreiteiro = await api.get("/empreiteiros");
            const nome_empreiteiro_logado = localStorage.getItem("usuario");
            console.log(nome_empreiteiro_logado);
  
            const empreiteiroFiltrado = empreiteiro.data.filter(e => e.nome === nome_empreiteiro_logado);
  
            if (empreiteiroFiltrado.length > 0) {
              const empreiteiroId = empreiteiroFiltrado[0].id;
  
              const response = await api.get(`/empreiteiro/${empreiteiroId}/orcamentos`);
              setOrcamentos(response.data)
              console.log(response.data[0].dono_obra.nome);
              
            } else {
              console.log("Nenhum empreiteiro encontrado.");
            }
          } catch (error) {
            console.error("Erro ao buscar os empreiteiros ou orçamentos:", error);
          }
        }
      };
  
      fetchEmpreiteiro();
    }, [navigate]);
    
    const getStatusIcon = (row) => {
      if (row.data_aprovacao===null){
        return { status: "Em Análise", icon: IoMdClock, color: "blue.600" }
      }else{
        return { status: "Finalizado", icon: MdCheckCircle, color: "green"  }
      }
      // switch (status) {
      //   case "Finalizado":
      //     return { icon: MdCheckCircle, color: "green" };
      //   case "Em Andamento":
      //     return { icon: IoMdHammer , color: "black" };
      //   case "Em Analise":
      //     return { icon: IoMdClock , color: "blue.600" };
      //   case "Pendente":
      //     return { icon: MdOutlineError , color: "yellow.600" };
      //   default:
      //     return null;
      // }
    };

    const handleViewPdf = (row) => {
      setSelectedRow(row);
      console.log(row);
      
      setPdfVisible(true);
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
              {orcamentos.map((row, index) => {
                const { status, icon, color } = getStatusIcon(row);
                return (
                  <Tr key={index}>
                    <Td>{row.dono_obra.nome}</Td>
                    <Td>{new Date(row.data_criacao).toLocaleDateString('pt-BR')}</Td>
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
        {isPdfVisible && <PdfOrcamento row={selectedRow} setPdfVisible={setPdfVisible} />}
        </SimpleGrid>
        
    );
  }
  