import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, Select, useToast } from "@chakra-ui/react";
import api from "api/requisicoes"; 
import { useUser } from "context/UseContext";

export default function Atividades({ etapas, setEtapas, gerenciarObra, handleAtividades, setAtividades }) {
  const { funcionarios, empreiteiro, setFuncionarios } = useUser();
  const [idEtapaSelecionada, setIdEtapaSelecionada] = useState(null);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empreiteiro/obra/${gerenciarObra.id}/etapas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setEtapas(response.data);
      }
    };

    const fetchDataFuncionarios = async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/funcionarios`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setFuncionarios(response.data);
      }
    };

    fetchData();
    fetchDataFuncionarios();
  }, []);
  
  const [formData, setFormData] = useState({
    descricao: "",
    data_inicio: "",
    data_termino: "",
    cpf_funcionario: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.descricao || !formData.data_inicio || !formData.cpf_funcionario || !formData.data_termino) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/empreiteiro/obra/${gerenciarObra.id}/etapa/${idEtapaSelecionada}/atividades`, formData, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        toast({
          title: "Atividade cadastrada",
          description: "Atividade cadastrada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setFormData({
          descricao: "",
          data_inicio: "",
          data_termino: "",
          custo_mao_obra: ""
        });
        setIdEtapaSelecionada(null);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar o formulário.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" backgroundColor="white" borderRadius="md" shadow="md">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl id="id_etapa" isRequired>
          <FormLabel>Etapa</FormLabel>
          <Select 
            value={idEtapaSelecionada || ""} 
            onChange={(e) => setIdEtapaSelecionada(e.target.value)}
            placeholder="Selecione uma etapa"
          >
            {etapas.map((etapa) => (
              <option key={etapa.id} value={etapa.id}>
                {etapa.nome}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="id_funcionario">
          <FormLabel>Funcionário</FormLabel>
          <Select
            isRequired
            name="cpf_funcionario"
            value={formData.cpf_funcionario || ''}
            onChange={handleChange}
          >
            <option value="" disabled>
              Selecione um funcionário
            </option>
            {funcionarios.map((funcionario) => (
              <option key={funcionario.cpf} value={funcionario.cpf}>
                {funcionario.nome}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="data_inicio">
          <FormLabel>Data de Início</FormLabel>
          <Input
            isRequired
            type="date"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_termino">
          <FormLabel>Data de Término</FormLabel>
          <Input
            type="date"
            name="data_termino"
            value={formData.data_termino}
            onChange={handleChange}
          />
        </FormControl>
      </SimpleGrid>

      <FormControl id="descricao" mt={4}>
        <FormLabel>Descrição</FormLabel>
        <Textarea
          isRequired
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={4}
        />
      </FormControl>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit} mt={4}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
}