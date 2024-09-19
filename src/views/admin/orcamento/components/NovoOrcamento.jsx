import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid } from "@chakra-ui/react";

export default function NovoOrcamento() {
  const [formData, setFormData] = useState({
    id_cliente: 1,
    descricao: "teste orcamento",
    valor_metro: 10.0,
    qtd_metros: 10,
    data_inicio: "2024-09-19",
    data_termino: "2024-11-19"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Aqui você pode lidar com o envio dos dados, se necessário.
    console.log("Dados do formulário:", formData);
  };

  return (
    <Box
      p={4}
      maxW="1200px"
      mx="auto"
      backgroundColor="white"
      borderRadius="md"
      shadow="md"
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <FormControl id="id_cliente">
          <FormLabel>ID Cliente</FormLabel>
          <Input
            type="number"
            name="id_cliente"
            value={formData.id_cliente}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="valor_metro">
          <FormLabel>Valor por Metro</FormLabel>
          <Input
            type="number"
            step="0.01"
            name="valor_metro"
            value={formData.valor_metro}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="qtd_metros">
          <FormLabel>Quantidade de Metros</FormLabel>
          <Input
            type="number"
            name="qtd_metros"
            value={formData.qtd_metros}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_inicio">
          <FormLabel>Data de Início</FormLabel>
          <Input
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
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={4}
        />
      </FormControl>

      <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit} mt={4}>
        Enviar
      </Button>
    </Box>
  );
}
