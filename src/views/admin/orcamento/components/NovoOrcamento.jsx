import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, useToast } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import api from "api/requisicoes";
export default function NovoOrcamento({setShowTabela}) {
  const [formData, setFormData] = useState({
    cpf_cliente: "",
    descricao: "",
    valor_metro: 0.0,
    qtd_metros: 0,
  });
  const [formDataEndereco, setFormDataEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    cidade: "",
    bairro: "",
    data_inicio: "",
    data_termino: ""
  });

  const [formDataObra, setFormDataObra] = useState({
    id_orcamento: '',
    id_dono_obra: ''
  });

  // const handleSelectOrcamento = (e) => {
  //   const selectedOrcamentoId = e.target.value;

  //   const selectedOrcamento = orcamentos.find(orcamento => orcamento.id === parseInt(selectedOrcamentoId));

  //   if (selectedOrcamento) {
  //     setFormDataObra({
  //       ...formDataObra,
  //       id_orcamento: selectedOrcamento.id,
  //       id_dono_obra: selectedOrcamento.dono_obra.id 
  //     });
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;
    setFormDataEndereco({
      ...formDataEndereco,
      [name]: name === "numero" ? parseInt(value) || 0 : value,
    });
  };
  const toast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const nome_empreiteiro_logado = localStorage.getItem("usuario");
        const { data: empreiteiros } = await api.get("/empreiteiros");
        const empreiteiroFiltrado = empreiteiros.find(e => e.nome === nome_empreiteiro_logado);

        if (!empreiteiroFiltrado) throw new Error("Empreiteiro não encontrado");

        const response = await api.post(`/empreiteiro/${empreiteiroFiltrado.id}/orcamentos`, formData);
        if (response.status !== 201) throw new Error("Erro ao criar orçamento");

        const { data: orcamento } = response;
        setFormDataObra(prev => ({
            ...prev,
            id_orcamento: orcamento.id,
            id_dono_obra: orcamento.dono_obra.id,
        }));

        const responseObras = await api.post(`/empreiteiro/${empreiteiroFiltrado.id}/orcamento/${orcamento.id}/obra`, formDataEndereco);
        console.log(responseObras.data);
        
        if (responseObras.status !== 201) throw new Error("Erro ao criar obra");

        // const responsePutOrcamento = await api.put(`/empreiteiro/${empreiteiroFiltrado.id}/orcamentos/${orcamento.id}`, {
        //     data_aprovacao: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'),
        // });
        // if (responsePutOrcamento.status !== 200) throw new Error("Erro ao atualizar orçamento");
        toast({
          title: "Obra iniciada!",
          description: "A obra foi iniciada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
          });

        setShowTabela(false);
        setFormDataEndereco({ cep: null, rua: "", numero: null, cidade: "", bairro: "" });

      } catch (error) {
          console.error(error);
          toast({
              title: "Erro",
            description: "Houve um erro ao processar a solicitação.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
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
                  size='md'
                  
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
            onChange={handleChangeEndereco}
          />
        </FormControl>

        <FormControl id="data_termino">
          <FormLabel>Data de Término</FormLabel>
          <Input
            isRequired={true} 
            type="date"
            name="data_termino"
            value={formData.data_termino}
            onChange={handleChangeEndereco}
          />
        </FormControl>
        <FormControl id="cep">
          <FormLabel>CEP</FormLabel>
          <Input
            isRequired={true}
            type="number"
            name="cep"
            value={formDataEndereco.cep}
            onChange={handleChangeEndereco}
          />
        </FormControl>

        <FormControl id="cidade">
          <FormLabel>Cidade</FormLabel>
          <Input
            isRequired={true}
            name="cidade"
            value={formDataEndereco.cidade}
            onChange={handleChangeEndereco}
          />
        </FormControl>

        <FormControl id="rua">
          <FormLabel>Rua</FormLabel>
          <Input
            isRequired={true}
            name="rua"
            value={formDataEndereco.rua}
            onChange={handleChangeEndereco}
          />
        </FormControl>

        <FormControl id="bairro">
          <FormLabel>Bairro</FormLabel>
          <Input
            isRequired={true}
            name="bairro"
            value={formDataEndereco.bairro}
            onChange={handleChangeEndereco}
          />
        </FormControl>

        <FormControl id="numero">
          <FormLabel>Número</FormLabel>
          <Input
            isRequired={true}
            name="numero"
            value={formDataEndereco.numero}
            onChange={handleChangeEndereco}
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
      

      
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit} mt={4}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
}
