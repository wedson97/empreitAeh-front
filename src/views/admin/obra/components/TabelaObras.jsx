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
  Fade
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoMdEye, IoMdClock } from "react-icons/io";
import { MdBuild, MdCancel, MdCheckCircle } from "react-icons/md";
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

  useEffect(() => {
    window.scrollTo(0, 0);
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
          console.log(response);
          setObras(response.data);
          
        }
      } catch (error) {
        console.error("Erro ao buscar os empreiteiros ou orçamentos:", error);
      }
    };

    fetchEmpreiteiro();
  }, [empreiteiro, navigate, donoObra]);

  const [atividadesPorObra, setAtividadesPorObra] = useState({});

  const carregarAtividades = async (row) => {
    try {
      // if (!atividadesPorObra[row.id]) {
      //   const response = await api.get(`/empreiteiro/${empreiteiro.id}/obra/${row.id}/atividades`);
      //   const atividadesNaoFinalizadas = response.data.filter((atividade) => atividade.finalizado === false);
        
      //   setAtividadesPorObra((prev) => ({
      //     ...prev,
      //     [row.id]: atividadesNaoFinalizadas
      //   }));
      // }
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
    }
  };
  
  // const getStatusIcon = (row) => {
  //   const atividadesNaoFinalizadas = atividadesPorObra[row.id] || [];
  //   if (
  //     row.orcamento.status !== 'Reprovado' &&
  //     (row.orcamento.data_aprovacao === null || row.orcamento.data_compactuacao === null)
  //   ) {
  //     return { status: "Esperando aprovação", icon: IoMdClock, color: "yellow.600" };
  //   } 
  //   else if (
  //     row.orcamento.status !== 'Reprovado' &&
  //     row.orcamento.data_aprovacao !== null &&
  //     row.orcamento.data_compactuacao !== null
  //   ) {
  //     return { status: "Em Andamento", icon: IoMdClock, color: "blue.600" };
  //   } 
  //   else if (row.orcamento.status === 'Reprovado') {
  //     return { status: "Reprovado", icon: MdCancel, color: "red" };
  //   } 
  //   else {
  //     return { status: "Finalizado", icon: MdCheckCircle, color: "green" };
  //   }
  // };
  
  // if (row.data_aprovacao===null && row.data_compactuacao===null){
  //   return { status: "Em Análise", icon: IoMdClock, color: "blue.600" }
  // }else if(row.data_aprovacao!==null && row.data_compactuacao===null){
  //   return { status: "Esperando empreiteiro", icon: IoMdClock, color: "yellow.600"  }
  // } else if(row.data_compactuacao!==null && row.data_aprovacao===null){
  //   return { status: "Esperando dono da obra",  icon: IoMdClock, color: "yellow.600" }
  // }else{
  //   return {status: "Finalizado", icon: MdCheckCircle, color: "green" };
  // }

  const handleClickGerencia = async (row)=>{
    handleGerenciar(row)
    setObraCadastrada(row.id)
    await carregarAtividades(row);
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
              return (
                <Tr key={index}>
                  <Td>{row.dono_obra.nome}</Td>
                  <Td>{row.data_inicio}</Td>
                  <Td>{row.data_inicio}</Td>
                  <Td>
                    <IconButton
                      backgroundColor="#e8661e"
                      color="white"
                      aria-label="Visualizar"
                      icon={<IoMdEye />}
                      mr={1}
                      onClick={() => handleViewPdf(row)}
                    />
                   <IconButton
                      backgroundColor="#2b6cb0"
                      color="white"
                      aria-label="Gerênciar"
                      icon={<MdBuild />}
                      onClick={() => handleClickGerencia(row)}
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
