
import {
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import CheckTable from "views/admin/default/components/CheckTable";
import { useNavigate } from "react-router-dom";
import Atividades from "./Atividades";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";
import EditarAtividades from "./EditarAtividade";

export default function GerenciarObra({ mostrarAtividades, handleAtividades, gerenciarObra, setMostrarBotoesTabela, mostrarBotoesTabela}) {
  const { empreiteiro } = useUser();
  const [atividades, setAtividades] = useState([]);
  const [mostrarEditarAtividade, setMostrarEditarAtividade] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null); 
  const navigate = useNavigate();

  const handleEditarAtividade = (atividade) => {
    setAtividadeSelecionada(atividade);
    setMostrarEditarAtividade(true);
    setMostrarBotoesTabela(!mostrarBotoesTabela);
  };

  useEffect(() => {
    const fetchData = async () => {
      window.scrollTo(0, 0);
      const tipo_usuario = localStorage.getItem("tipo_usuario")
      const id = localStorage.getItem("id")
      if (tipo_usuario === null && id === null) {
        navigate("/");
        return;
      }
      
      setAtividades([]); // Limpa o estado anterior
      try {
        const response = await api.get(`/empreiteiro/${empreiteiro.id}/obra/${gerenciarObra.id}/atividades`);
        
        // Verifique se response.data é um array
        if (Array.isArray(response.data)) {
          setAtividades(response.data);
        } else {
          console.error("Dados retornados não são um array:", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };
    
    fetchData();
  }, [empreiteiro.id, gerenciarObra.id, navigate, handleAtividades]);

  const totalAtividades = atividades.length > 0 ? atividades.length : 1; // Para evitar divisão por zero
  const porcentagem = (100 / totalAtividades).toFixed(2);

  const atividadesFinalizadas = atividades.filter(atividade => atividade.finalizado === true);
  const atividadesNaoFinalizadas = atividades.filter(atividade => atividade.finalizado === false);

  return (
    <Box>
      {mostrarEditarAtividade ? (
        <EditarAtividades setMostrarBotoesTabela={setMostrarBotoesTabela} mostrarBotoesTabela={mostrarBotoesTabela} atividade={atividadeSelecionada} setMostrarEditarAtividade={setMostrarEditarAtividade} />
      ) : mostrarAtividades ? (
        <Atividades setAtividades={setAtividades} handleAtividades={handleAtividades} gerenciarObra={gerenciarObra} />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
          <CheckTable
            tableData={atividadesNaoFinalizadas}
            porcentagem={porcentagem}
            nome={'A fazer'}
            handleEditarAtividade={handleEditarAtividade}
          />
          <CheckTable
            tableData={atividadesFinalizadas}
            porcentagem={porcentagem}
            nome={'Feito'}
            handleEditarAtividade={handleEditarAtividade}
          />
        </SimpleGrid>
      )}
    </Box>
  );
}
