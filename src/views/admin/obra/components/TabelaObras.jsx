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
  const {setObraCadastrada, setUltimaEtapaCadastrada} = useUser();

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  const data_inicio = getCurrentDate();
  const handleAprovarObra = async (obraId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/empreiteiro/obra/${obraId}/iniciar`, {data_inicio}, {
        headers: { Authorization: `Bearer ${token}` }
      });

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


  return (
    <SimpleGrid gap='20px' mb='20px' backgroundColor="white" borderRadius="20px" overflow="hidden">
      <TableContainer>
        <Table variant="striped" backgroundColor="#f0f3f5">
          <TableCaption>Registro de obras</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Dono da obra</Th>
              <Th>Data de início</Th>
              <Th>Previsão de término</Th>
              
              {empreiteiro ?<Th>Opções</Th>:null}
              
            </Tr>
          </Thead>
          <Tbody>
            {obras.map((row, index) => {
              const temDataInicio = !!row.data_inicio;
              const temDataFim = !!row.data_entrega;
              
              return (
                <Tr key={index}>
                  <Td>{row.id}</Td>
                  <Td>{row.dono_obra.nome}</Td>
                  <Td>{row.data_inicio || 'Não iniciada'}</Td>
                  <Td>{row.data_inicio && !row.data_entrega ? 'Em andamento':row.data_entrega }</Td>

                  <Td>
                    <Flex gap="2">
                      
                      {empreiteiro ?<IconButton
                        backgroundColor="#2b6cb0"
                        color="white"
                        aria-label="Gerênciar"
                        icon={<MdBuild />}
                        onClick={() => handleClickGerencia(row)}
                      />:null}
                      
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
