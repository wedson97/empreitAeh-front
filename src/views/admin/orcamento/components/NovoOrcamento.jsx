import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import api from "api/requisicoes";
import { useUser } from "context/UseContext";

export default function NovoOrcamento({setShowTabela}) {
  const {alertaOrcamento, setAlertaOrcamento} = useUser();
  const [formData, setFormData] = useState({
    cpf_cliente: "",
    descricao: "",
    valor_metro: 0.0,
    qtd_metros: 0,
    data_inicio: "",
    data_termino: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('cpf_cliente', formData.cpf_cliente);
    data.append('descricao', formData.descricao);
    data.append('valor_metro', formData.valor_metro);
    data.append('qtd_metros', formData.qtd_metros);
    data.append('data_inicio', formData.data_inicio);
    data.append('data_termino', formData.data_termino);
    try {
      const empreiteiro = await api.get("/empreiteiros");
      const nome_empreiteiro_logado = localStorage.getItem("usuario");
      console.log(nome_empreiteiro_logado);
      
      // Filtra o empreiteiro pelo nome
      const empreiteiroFiltrado = empreiteiro.data.filter(e => e.nome === nome_empreiteiro_logado);
  
      
      const response = await api.post(`/empreiteiro/${empreiteiroFiltrado[0].id}/orcamentos`,formData)
      if(response.status===201){
        console.log(response);
        setAlertaOrcamento({status:"success", titulo:"Orçamento realizado!",descricao: `O orçamento foi cadastro com sucesso!`, duracao:3000, visivel:true})
        setShowTabela(false);
        setFormData({cpf_cliente: "",descricao: "",valor_metro: 0.0,qtd_metros: 0,data_inicio: "",data_termino: ""})
        setTimeout(() => {
          setAlertaOrcamento(prev => ({ ...prev, visivel: false }));
        }, 3000);

      }
    } 
    catch (AxiosError) {
      setAlertaOrcamento({status:"error", titulo:"Falha no orçamento",descricao: `Verifique as informações e tente novamente`, duracao:3000, visivel:true})
      setTimeout(() => {
        setAlertaOrcamento(prev => ({ ...prev, visivel: false }));
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        <FormControl id="cpf_cliente">
          <FormLabel>CPF do cliente</FormLabel>
          <InputMask
              mask="999.999.999-99"
              value={formData.cpf_cliente}
              onChange={handleInputChange}
              maskChar={null} // Isso remove o caractere de máscara visível
            >
              {() => (
                <Input
                  isRequired={true}
                  variant='auth'
                  name="cpf_cliente"
                  fontSize='sm'
                  ms={{ base: "0px", md: "0px" }}
                  type='text'
                  placeholder='xxx.xxx.xxx-xx'
                  mb='24px'
                  fontWeight='500'
                  size='lg'
                  
                />
              )}
            </InputMask>
        </FormControl>

        <FormControl id="valor_metro">
          <FormLabel>Valor por Metro</FormLabel>
          <Input
            isRequired={true}
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
            isRequired={true}
            type="number"
            name="qtd_metros"
            value={formData.qtd_metros}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_inicio">
          <FormLabel>Data de Início</FormLabel>
          <Input
            isRequired={true}
            type="date"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_termino">
          <FormLabel>Data de Término</FormLabel>
          <Input
            isRequired={true} 
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
          isRequired={true}
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
