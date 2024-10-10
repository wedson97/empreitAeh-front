import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, Select, useToast } from "@chakra-ui/react";
import api from "api/requisicoes"; 
import { useUser } from "context/UseContext";

export default function Atividades({ gerenciarObra, handleAtividades, setAtividades }) {
  const { funcionarios, empreiteiro, setFuncionarios } = useUser();
  const toast = useToast();
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const response = await api.get(`/empreiteiro/${empreiteiro.id}/funcionarios`);
      setFuncionarios(response.data);
    };
    fetchData();
  }, []);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data_inicio: "",
    data_termino: "",
    finalizado: false,
    id_obra: gerenciarObra.id,
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

    if (!formData.nome || !formData.descricao || !formData.data_inicio || !formData.cpf_funcionario ) {
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
      const response = await api.post(`/empreiteiro/${empreiteiro.id}/obra/${gerenciarObra.id}/atividades`, formData);
      if(response.status===201){
        toast({
          title: "Atividade cadastrada",
          description: "Atividade cadastrada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setFormData({
        nome: "",
        descricao: "",
        data_inicio: "",
        data_termino: "",
        finalizado: false,
        id_obra: gerenciarObra.id,
        cpf_funcionario: 0,
      });
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
    <>
      <Button
        onClick={handleAtividades}
        mb={4}
        backgroundColor={"#e8661e"}
        color={"white"}
      >
        Voltar
      </Button>
      <Box p={4} maxW="1200px" mx="auto" backgroundColor="white" borderRadius="md" shadow="md">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl id="nome">
            <FormLabel>Nome</FormLabel>
            <Input
              isRequired
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
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
    </>
  );
}
