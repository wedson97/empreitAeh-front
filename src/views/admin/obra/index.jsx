import React, { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TabelaObras from "./components/TabelaObras";
import GerenciarObra from "./components/GerenciarObra";
import NovoObra from "./components/NovaObra";
import NovaEtapa from "./components/etapas/NovaEtapa";
import NovoMaterial from "./components/Materiais/NovoMaterial";
import Atividades from "./components/Atividades"; // Importando o componente Atividades
import { useUser } from "context/UseContext";

export default function Obra() {
  const navigate = useNavigate();
  const [mostrarTabela, setMostrarTabela] = useState(true);
  const [mostrarBotoesTabela, setMostrarBotoesTabela] = useState(false);
  const [mostrarAtividades, setMostrarAtividades] = useState(false);
  const [mostrarNovaEtapa, setMostrarNovaEtapa] = useState(false);
  const [mostrarNovoMaterial, setMostrarNovoMaterial] = useState(false);
  const [gerenciarObra, setGerenciarObra] = useState(0);
  const [criarObra, setCriarObra] = useState(false);
  const { setAtividades, empreiteiro } = useUser();
  const { idEtapaSelecionada, setIdEtapaSelecionada, setObraCadastrada, obraCadastrada, ultimoMaterialCadastrado, setUltimoMaterialCadastrado, ultimaEtapaCadastrada, setUltimaEtapaCadastrada } = useUser();
  const [formDataEtapa, setFormDataEtapa] = useState({
    nome: "",
    custo_mao_obra: "",
    data_inicio: "",
    data_finalizacao: "",
  });
  const [formDataMaterial, setFormDataMaterial] = useState({
    id_fornecedor: "",
    nome: "",
    descricao: "",
    valor_unitario: "",
    quantidade: ""
  });
  const [etapas, setEtapas] = useState([]); // Estado para armazenar as etapas

  const handleGerenciar = (row) => {
    setMostrarTabela(false);
    setGerenciarObra(row);
    setMostrarBotoesTabela(true);
  };

  const handleAtividades = () => {
    setMostrarAtividades(true); // Define mostrarAtividades como true
    setMostrarBotoesTabela(false);
  };

  const handleVoltarTabela = () => {
    if (mostrarNovaEtapa) {
      setMostrarNovaEtapa(false);
      setMostrarBotoesTabela(true);
    } else if (mostrarNovoMaterial) {
      setMostrarNovoMaterial(false);
      setMostrarBotoesTabela(true);
    } else if (mostrarAtividades) {
      setMostrarAtividades(false); // Fecha o componente Atividades
      setMostrarBotoesTabela(true);
    } else {
      setMostrarTabela(true);
      setMostrarBotoesTabela(false);
      setCriarObra(false);
    }
  };

  const handleNovaObra = () => {
    setCriarObra(true);
    setMostrarTabela(false);
    setMostrarBotoesTabela(false);
    setObraCadastrada(null)
    setUltimaEtapaCadastrada(null)
  };

  const handleNovaEtapa = () => {
    setMostrarNovaEtapa(true);
    setMostrarBotoesTabela(false);
  };

  const handleNovoMaterial = () => {
    setMostrarNovoMaterial(true);
    setMostrarBotoesTabela(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const tipo_usuario = localStorage.getItem("tipo_usuario");
    const id = localStorage.getItem("id");
    if (!tipo_usuario && !id) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      width="100%"
      maxWidth="container.xl"
      mx="auto"
      px={{ base: 4, md: 8 }}
    >
      {!criarObra && mostrarTabela && (
        <Button
          mb={4}
          backgroundColor={"#e8661e"}
          color={"white"}
          onClick={handleNovaObra}
        >
          Nova obra
        </Button>
      )}

      {mostrarBotoesTabela && !mostrarNovaEtapa && !mostrarNovoMaterial && !mostrarAtividades && (
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Button
            onClick={handleVoltarTabela}
            mb={4}
            backgroundColor={"#e8661e"}
            color={"white"}
          >
            Voltar
          </Button>
          <Button
            onClick={handleAtividades}
            mb={4}
            backgroundColor={"#e8661e"}
            color={"white"}
          >
            Nova atividade
          </Button>
          <Button
            onClick={handleNovaEtapa}
            mb={4}
            backgroundColor={"#e8661e"}
            color={"white"}
          >
            Nova Etapa
          </Button>
          <Button
            onClick={handleNovoMaterial}
            mb={4}
            backgroundColor={"#e8661e"}
            color={"white"}
          >
            Novo material
          </Button>
        </Box>
      )}

      <Box width="100%">
        {criarObra ? (
          <>
            <Button
              onClick={handleVoltarTabela}
              mb={4}
              backgroundColor={"#e8661e"}
              color={"white"}
            >
              Voltar
            </Button>
            <NovoObra handleVoltarTabela={handleVoltarTabela} />
          </>
        ) : mostrarNovaEtapa ? (
          <>
            <Button
              onClick={handleVoltarTabela}
              mb={4}
              backgroundColor={"#e8661e"}
              color={"white"}
            >
              Voltar
            </Button>
            <NovaEtapa
              formDataEtapa={formDataEtapa}
              setFormDataEtapa={setFormDataEtapa}
              ultimaEtapaCadastrada={ultimaEtapaCadastrada}
              obraCadastrada={gerenciarObra.id}
              adicionarBotao={true}
            />
          </>
        ) : mostrarNovoMaterial ? (
          <>
            <Button
              onClick={handleVoltarTabela}
              mb={4}
              backgroundColor={"#e8661e"}
              color={"white"}
            >
              Voltar
            </Button>
            <NovoMaterial
              mostrarBotao={true}
              passos={null}
              formDataMaterial={formDataMaterial}
              setFormDataMaterial={setFormDataMaterial}
              idEtapaSelecionada={idEtapaSelecionada}
              setIdEtapaSelecionada={setIdEtapaSelecionada}
              obraCadastrada={obraCadastrada}
              setObraCadastrada={setObraCadastrada}
              handleVoltarTabela={handleVoltarTabela}
            />
          </>
        ) : mostrarAtividades ? (
          <>
            <Button
              onClick={handleVoltarTabela}
              mb={4}
              backgroundColor={"#e8661e"}
              color={"white"}
            >
              Voltar
            </Button>
            <Atividades
              etapas={etapas}
              setEtapas={setEtapas}
              gerenciarObra={gerenciarObra}
              handleAtividades={handleAtividades}
              setAtividades={setAtividades}
            />
          </>
        ) : mostrarTabela ? (
          <TabelaObras handleGerenciar={handleGerenciar} />
        ) : (
          <GerenciarObra
            mostrarBotoesTabela={mostrarBotoesTabela}
            setMostrarBotoesTabela={setMostrarBotoesTabela}
            mostrarAtividades={mostrarAtividades}
            handleAtividades={handleAtividades}
            gerenciarObra={gerenciarObra}
          />
        )}
      </Box>
    </Box>
  );
}