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
  Text,
  Fade,
  useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoMdEye, IoMdClock } from "react-icons/io";
import { MdBuild, MdCancel, MdCheckCircle, MdDeliveryDining  } from "react-icons/md";
import api from "api/requisicoes";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";
import PdfObra from "./PdfObra";

export default function TabelaObras({ handleGerenciar}) {
  const { obras, setObras, empreiteiro, donoObra } = useUser();
  const navigate = useNavigate();
  const [isPdfVisible, setPdfVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const {idEtapaSelecionada, setIdEtapaSelecionada,setObraCadastrada, obraCadastrada, ultimoMaterialCadastrado, setUltimoMaterialCadastrado, ultimaEtapaCadastrada, setUltimaEtapaCadastrada} = useUser();
  const [atividadesPorObra, setAtividadesPorObra] = useState({});

  const toast = useToast();

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mês começa do zero, então somamos 1
    const day = String(today.getDate()).padStart(2, '0'); // Garantir que o dia tenha dois dígitos
    return `${year}-${month}-${day}`;
  }
  
  const data_inicio = getCurrentDate();
  const handleAprovarObra = async (obraId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/empreiteiro/obra/${obraId}/iniciar`, {data_inicio}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Atualizar lista de obras após aprovação
      const obrasAtualizadas = obras.map(obra => 
        obra.id === obraId ? { ...obra, data_inicio: new Date().toISOString().split('T')[0] } : obra
      );
      setObras(obrasAtualizadas);
    } catch (error) {
      console.error("Erro ao aprovar obra:", error);
    }
  };
  const data_entrega = getCurrentDate();
  const handleEntregarObra = async (obraId) => {
    try {
      const token = localStorage.getItem("token");
      
      await api.post(`/empreiteiro/obra/${obraId}/entregar`, {data_entrega}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Atualizar lista de obras após entrega
      fetchEmpreiteiro();
    } catch (error) {
      console.error("Erro ao entregar obra:", error);
    }
  };
  const fetchEmpreiteiro = async () => {
    try {
      let response;
      const token = localStorage.getItem("token"); 
      if (empreiteiro) {
        response = await api.get(`/empreiteiro/obras`,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
      } else if (donoObra) {
        response = await api.get(`/dono_obra/obras`,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
      }
      
      
      if(response){
        setObras(response.data);
        
      }
    } catch (error) {
      console.error("Erro ao buscar os empreiteiros ou orçamentos:", error);
    }
  };

  useEffect(() => {
    setUltimaEtapaCadastrada(null)
    window.scrollTo(0, 0);
    
    fetchEmpreiteiro();
  }, [empreiteiro, navigate, donoObra]);


 

  const handleClickGerencia = async (row)=>{
    handleGerenciar(row)
    setObraCadastrada(row.id)
  }

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
              <Th>Opções</Th>
            </Tr>
          </Thead>
          <Tbody>
            {obras.map((row, index) => {
              const temDataInicio = !!row.data_inicio;
              const temDataFim = !!row.data_entrega;
              
              return (
                <Tr key={index}>
                  <Td>{row.dono_obra.nome}</Td>
                  <Td>{row.data_inicio || 'Não iniciada'}</Td>
                  <Td>{row.data_inicio && !row.data_entrega ? 'Em andamento':row.data_entrega }</Td>

                  <Td>
                    <Flex gap="2">
                      <IconButton
                        backgroundColor="#e8661e"
                        color="white"
                        aria-label="Visualizar"
                        icon={<IoMdEye />}
                        onClick={() => handleViewPdf(row)}
                      />
                      {empreiteiro ?<IconButton
                        backgroundColor="#2b6cb0"
                        color="white"
                        aria-label="Gerênciar"
                        icon={<MdBuild />}
                        onClick={() => handleClickGerencia(row)}
                      />:null}
                      
                      {/* Botão condicional */}
                      {!temDataInicio && empreiteiro && (
                        <IconButton
                          backgroundColor="green.500"
                          color="white"
                          aria-label="Aprovar obra"
                          icon={<MdCheckCircle />}
                          onClick={() => handleAprovarObra(row.id)}
                        />
                      )}
                      
                      {temDataInicio && !temDataFim && empreiteiro && (
                        <IconButton
                          backgroundColor="blue.500"
                          color="white"
                          aria-label="Entregar obra"
                          icon={<MdDeliveryDining />}
                          onClick={() => handleEntregarObra(row.id)}
                        />
                      )}
                    </Flex>
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
