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
import { MdBuild, MdCancel } from "react-icons/md";

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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empreiteiro/obra/${gerenciarObra.id}/etapas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setEtapas(response.data);
      }
    };
    fetchData();
  }, [empreiteiro.id, gerenciarObra.id]);

  const fetchDataAtividades = async (etapaId) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${etapaId}/atividades`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      setAtividades(response.data);
      setEtapaExpandida(etapaId); // Define a etapa expandida como a etapa clicada
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
                  <Th>Nome</Th>
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
                        <IconButton
                          backgroundColor="#c51010"
                          color="white"
                          aria-label="Cancelar"
                          icon={<MdCancel />}
                          onClick={() => handleExcluirEtapa(row.id)}
                          mr={1}
                        />
                        <IconButton
                          backgroundColor="#28a745"
                          color="white"
                          aria-label="Ver Atividades"
                          icon={<IoMdEye />}
                          onClick={() => {
                            if (etapaExpandida === row.id) {
                              setEtapaExpandida(null); // Fecha a etapa se já estiver expandida
                            } else {
                              fetchDataAtividades(row.id);
                            }
                          }}
                        />
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
                                </Tr>
                              </Thead>
                              <Tbody>
                                {atividades.map((atividade, idx) => (
                                  <Tr key={idx}>
                                    <Td>{atividade.descricao}</Td>
                                    <Td>{atividade.status}</Td>
                                    <Td>{new Date(atividade.data_inicio).toLocaleDateString("pt-BR")}</Td>
                                    <Td>{new Date(atividade.data_termino).toLocaleDateString("pt-BR")}</Td>
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