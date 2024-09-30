
import {
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
  import React, { useCallback, useEffect, useState} from "react";
  import { IoMdEye, IoMdClock} from "react-icons/io";
  import { MdCheckCircle, MdCancel  } from "react-icons/md";
import api from "api/requisicoes";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";
import PdfOrcamento from "./PdfOrcamento";
  
export default function TabelaOrcamento() {
  const {orcamentos, setOrcamentos} = useUser()
  const [isPdfVisible, setPdfVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const {empreiteiro, donoObra} = useUser();
    const navigate = useNavigate();
    const handleAprovarOrcamento = useCallback(async (row) => {
      let response;
      try {
        if (empreiteiro) {
          response = await api.put(`/empreiteiro/${empreiteiro.id}/orcamento/${row.id}/compactuar`, {
            data_compactuacao: new Date().toISOString()
          });
          if (response && response.status === 200) {
            setOrcamentos((prevOrcamentos) =>
              prevOrcamentos.map((orcamento) =>
                orcamento.id === row.id
                  ? { ...orcamento, data_compactuacao: new Date().toISOString() }
                  : orcamento
              )
            );
          }
        } else if (donoObra) {
          response = await api.put(`/dono_obra/${donoObra.id}/orcamento/${row.id}/aprovar`, {
            data_aprovacao: new Date().toISOString()
          });
          if (response && response.status === 200) {
            setOrcamentos((prevOrcamentos) =>
              prevOrcamentos.map((orcamento) =>
                orcamento.id === row.id
                  ? { ...orcamento, data_aprovacao: new Date().toISOString() }
                  : orcamento
              )
            );
          }
        }
        
        
      } catch (error) {
        console.error("Erro ao aprovar o orçamento:", error);
      }
    }, [empreiteiro, donoObra, setOrcamentos]);
  
    useEffect(() => {
      window.scrollTo(0, 0);
      
      const fetchEmpreiteiro = async () => {
        const email = localStorage.getItem("email");
        const usuario = localStorage.getItem("usuario");
  
        if (!email && !usuario) {
          navigate("/");
        } else {
          try {
            let response;
            if (empreiteiro) {
              response = await api.get(`/empreiteiro/${empreiteiro.id}/orcamentos`);
            } else if (donoObra) {
              response = await api.get(`/dono_obra/${donoObra.id}/orcamentos`);
            }
            if (response) {
              setOrcamentos(response.data);
            }
          } catch (error) {
            console.error("Erro ao buscar os orçamentos:", error);
          }
        }
      };
  
      fetchEmpreiteiro();
    }, [empreiteiro, donoObra, navigate, setOrcamentos]);

    const handleDeleteOrcamento=async(row)=>{
      const response = api.delete
    }
    
    const getStatusIcon = (row) => {
      if (row.data_aprovacao===null && row.data_compactuacao===null){
        return { status: "Em Análise", icon: IoMdClock, color: "blue.600" }
      }else if(row.data_aprovacao!==null && row.data_compactuacao===null){
        return { status: "Esperando empreiteiro", icon: IoMdClock, color: "yellow.600"  }
      } else if(row.data_compactuacao!==null && row.data_aprovacao===null){
        return { status: "Esperando dono da obra",  icon: IoMdClock, color: "yellow.600" }
      }else{
        return {status: "Finalizado", icon: MdCheckCircle, color: "green" };
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
                <Th>Opções</Th>
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
                        mr={1}
                      />
                       {donoObra && !row.data_aprovacao && (
                        <>
                          <IconButton
                            backgroundColor="green"
                            color="white"
                            aria-label="Aprovar Orçamento"
                            icon={<MdCheckCircle />}
                            onClick={() => handleAprovarOrcamento(row)}
                            mr={1}
                          />
                          <IconButton
                            backgroundColor="#c51010"
                            color="white"
                            aria-label="Cancelar"
                            icon={<MdCancel />}
                          />
                        </>
                      )}

                      {/* Condição para exibir o botão para o empreiteiro (se não tiver data de compactuação) */}
                      {empreiteiro && !row.data_compactuacao && (
                        <>
                          <IconButton
                            backgroundColor="green"
                            color="white"
                            aria-label="Compactuar Orçamento"
                            icon={<MdCheckCircle />}
                            onClick={() => handleAprovarOrcamento(row)}
                            mr={1}
                          />
                          <IconButton
                            backgroundColor="#c51010"
                            color="white"
                            aria-label="Cancelar"
                            icon={<MdCancel />}
                          />
                        </>
                      )}
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
  