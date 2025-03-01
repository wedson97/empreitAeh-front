import {
  Box,
  IconButton,
  SimpleGrid,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Atividades from "./Atividades";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";
import EditarAtividades from "./EditarAtividade";
import EditarEtapa from "./etapas/EditarEtapa";
import { IoMdEye } from "react-icons/io";
import { MdBuild, MdCancel, MdCheckCircle, MdDeliveryDining } from "react-icons/md";

export default function GerenciarObra({ gerenciarObra }) {
  const { empreiteiro } = useUser();
  const [atividades, setAtividades] = useState([]);
  const [mostrarEditarAtividade, setMostrarEditarAtividade] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [mostrarEditarEtapas, setMostrarEditarEtapas] = useState(false);
  const [idEtapaSelecionada, setIdEtapaSelecionada] = useState(null);
  const [etapaExpandida, setEtapaExpandida] = useState(null); // Novo estado para controlar a etapa expandida
  const navigate = useNavigate();
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (empreiteiro){
      const response = await api.get(`/empreiteiro/obra/${gerenciarObra.id}/etapas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setEtapas(response.data);
      }
    }
    
  };
  useEffect(() => {
    
    fetchData();
  }, [empreiteiro, gerenciarObra]);

  const fetchDataAtividades = async (etapaId) => {
    const token = localStorage.getItem("token");
    if(empreiteiro){
      const response = await api.get(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${etapaId}/atividades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setAtividades(response.data);
        setEtapaExpandida(etapaId); // Define a etapa expandida como a etapa clicada
      }
    }else{
      const response = await api.get(`/dono_obra/obra/${gerenciarObra.id}/etapa/${etapaId}/atividades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setAtividades(response.data);
        setEtapaExpandida(etapaId); // Define a etapa expandida como a etapa clicada
      }
    }
    
  };

  const handleExcluirEtapa = async (id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      setEtapas(etapas.filter((etapa) => etapa.id !== id));
    }
  };

  const handleAprovarEtapa = async (row)=>{
    console.log(row);
    
    const token = localStorage.getItem("token");
    const response = await api.post(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${row.id}/iniciar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
    if (response.status === 200) {
      fetchData();
    }
  }

  const handleAprovarAtividade = async (row, atividade) =>{
    const token = localStorage.getItem("token");
    const response = await api.post(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${row.id}/atividade/${atividade.id}/iniciar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
    if (response.status === 200) {
      fetchDataAtividades(row.id);
    }
  }

  const handleEntregarAtividade = async (row, atividade)=>{
    const token = localStorage.getItem("token");
    const response = await api.post(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${row.id}/atividade/${atividade.id}/finalizar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
    if (response.status === 200) {
      fetchDataAtividades(row.id);
    }
  }

  const handleFinalizarEtapa = async (row) =>{
    const token = localStorage.getItem("token");
    const response = await api.post(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${row.id}/finalizar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
    if (response.status === 200) {
      fetchData();
    }
  }

  return (
    <Box>
      {mostrarEditarAtividade ? (
        <EditarAtividades atividade={atividadeSelecionada} setMostrarEditarAtividade={setMostrarEditarAtividade} />
      ) : mostrarEditarEtapas ? (
        <EditarEtapa gerenciarObra={gerenciarObra} idEtapaSelecionada={idEtapaSelecionada} />
      ) : (
        <>
          <TableContainer>
            <Table variant="striped" backgroundColor="#f0f3f5">
              <TableCaption>Registro de etapas</TableCaption>
              <Thead>
                <Tr>
                  <Th>Etapa</Th>
                  <Th>Status</Th>
                  <Th>Data de início</Th>
                  <Th>Previsão de término</Th>
                  <Th>Opções</Th>
                </Tr>
              </Thead>
              <Tbody>
                {etapas.map((row, index) => (
                  <React.Fragment key={index}>
                    <Tr>
                      <Td>{row.nome}</Td>
                      <Td>{row.status}</Td>
                      <Td>{new Date(row.data_inicio).toLocaleDateString("pt-BR")}</Td>
                      <Td>{new Date(row.data_finalizacao).toLocaleDateString("pt-BR")}</Td>
                      <Td>
                        <IconButton
                          backgroundColor="#2b6cb0"
                          color="white"
                          aria-label="Visualizar"
                          icon={<MdBuild />}
                          mr={1}
                          onClick={() => {
                            setIdEtapaSelecionada(row.id);
                            setMostrarEditarEtapas(true);
                          }}
                        />
                        {empreiteiro ? <IconButton
                          backgroundColor="#c51010"
                          color="white"
                          aria-label="Cancelar"
                          icon={<MdCancel />}
                          onClick={() => handleExcluirEtapa(row.id)}
                          mr={1}
                        />:null}
                        <IconButton
                          backgroundColor="orange"
                          color="white"
                          aria-label="Ver Atividades"
                          icon={<IoMdEye />}
                          mr={1}
                          onClick={() => {
                            if (etapaExpandida === row.id) {
                              setEtapaExpandida(null); // Fecha a etapa se já estiver expandida
                            } else {
                              fetchDataAtividades(row.id);
                            }
                          }}
                        />
                        {row.status === "Aguardando" && empreiteiro ? (
                          <IconButton
                            backgroundColor="green"
                            color="white"
                            aria-label="Aprovar Etapa"
                            icon={<MdCheckCircle  />}
                            onClick={() => handleAprovarEtapa(row)}
                          />
                        ) : row.status !== "Concluído" && empreiteiro ? (
                          <IconButton
                            backgroundColor="red"
                            color="white"
                            aria-label="Finalizar Etapa"
                            icon={<MdDeliveryDining />}
                            onClick={() => handleFinalizarEtapa(row)}
                          />
                        ) : null}

                      </Td>
                    </Tr>
                    {etapaExpandida === row.id && (
                      <Tr>
                        <Td colSpan={5}>
                          <TableContainer>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Atividade</Th>
                                  <Th>Status</Th>
                                  <Th>Data de Início</Th>
                                  <Th>Data de Término</Th>
                                  <Th>Opções</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {atividades.map((atividade, idx) => (
                                  <Tr key={idx}>
                                    <Td>{atividade.descricao}</Td>
                                    <Td>{atividade.status}</Td>
                                    <Td>{new Date(atividade.data_inicio).toLocaleDateString("pt-BR")}</Td>
                                    <Td>{new Date(atividade.data_termino).toLocaleDateString("pt-BR")}</Td>
                                    <Td>
                                      {atividade.status === "Aguardando" && empreiteiro ? (
                                        <IconButton
                                          backgroundColor="green"
                                          color="white"
                                          aria-label="Aprovar Atividade"
                                          icon={<MdCheckCircle  />}
                                          onClick={() => handleAprovarAtividade(row, atividade)}
                                        />
                                      ) : atividade.status !== "Concluído" && empreiteiro ? (
                                        <IconButton
                                          backgroundColor="red"
                                          color="white"
                                          aria-label="Entregar Atividade"
                                          icon={<MdDeliveryDining />}
                                          onClick={() => handleEntregarAtividade(row, atividade)}
                                        />
                                      ) : null}
                                    </Td>

                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}