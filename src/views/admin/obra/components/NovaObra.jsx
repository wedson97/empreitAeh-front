import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, useToast } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import api from "api/requisicoes";
import NovaEtapa from "./etapas/NovaEtapa";
import NovoMaterial from "./Materiais/NovoMaterial";
import { useUser } from "context/UseContext";

export default function NovoObra({ handleVoltarTabela }) {
  const { idEtapaSelecionada, setIdEtapaSelecionada, obraCadastrada, setObraCadastrada, ultimoMaterialCadastrado, setUltimoMaterialCadastrado, ultimaEtapaCadastrada, setUltimaEtapaCadastrada } = useUser();

  const [passos, setPassos] = useState(0);
  const [formNovaObra, setFormNovaObra] = useState({
    cpf_cliente: "",
    cep: "",
    cidade: "",
    uf: "",
    bairro: "",
    rua: "",
    numero: "",
  });
  const [formDataEtapa, setFormDataEtapa] = useState({
    nome: "",
    custo_mao_obra: "",
    data_inicio: "",
    data_finalizacao: ""
  });
  const [formDataMaterial, setFormDataMaterial] = useState({
    id_fornecedor: "",
    nome: "",
    descricao: "",
    valor_unitario: "",
    quantidade: ""
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormNovaObra({
      ...formNovaObra,
      [name]: value
    });
  };

  const proximoPasso = () => {
    console.log(obraCadastrada);
    
    if (passos === 0) {
      if (obraCadastrada === null) {
        toast({
          title: "Cadastro incompleto",
          description: "Cadastre uma obra antes!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setPassos(passos + 1);
      }
    }
    if (passos === 1) {
      
      
      if (ultimaEtapaCadastrada === null) {
        toast({
          title: "Cadastro incompleto",
          description: "Cadastre uma etapa antes!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setPassos(passos + 1);
        
      }
    }
  };

  const passoAnterior = () => {
    if (passos !== 0) {
      setPassos(passos - 1);
    }
  };

  const handleSubmitPassoUm = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/empreiteiro/obras", formNovaObra,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      setObraCadastrada(response.data.id);
      if (response.status === 201) {
        toast({
          title: "Obra cadastrada.",
          description: "Siga para o próximo passo!.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
      toast({
        title: "Erro ao cadastrar a obra.",
        description: "Houve um erro ao tentar cadastrar a obra.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmitPassoDois = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/empreiteiro/obra/" + obraCadastrada + "/etapas", formDataEtapa,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      setUltimaEtapaCadastrada(response.data.id);
      if (response.status === 200) {
        toast({
          title: "Etapa cadastrada.",
          description: "Siga para o próximo passo!.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFormDataEtapa({
          nome: "",
          custo_mao_obra: "",
          data_inicio: "",
          data_finalizacao: ""
        })
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
      toast({
        title: "Erro ao cadastrar a obra.",
        description: "Houve um erro ao tentar cadastrar a obra.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmitPassoTres = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/empreiteiro/obra/" + obraCadastrada + "/etapa/" + idEtapaSelecionada + "/materiais", formDataMaterial,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        toast({
          title: "Material cadastrada.",
          description: "O material foi cadastrado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUltimoMaterialCadastrado(response.data);
        setFormDataMaterial({
          id_fornecedor: "",
          nome: "",
          descricao: "",
          valor_unitario: "",
          quantidade: ""
        });
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
      toast({
        title: "Erro ao cadastrar a obra.",
        description: "Houve um erro ao tentar cadastrar a obra.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={4}
      width="100%"
      maxWidth="1200px"
      mx="auto"
      backgroundColor="white"
      borderRadius="md"
      shadow="md"
    >
      {passos === 0 ? (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <FormControl id="cpf_cliente">
              <FormLabel>CPF do cliente</FormLabel>
              <InputMask
                mask="999.999.999-99"
                value={formNovaObra.cpf_cliente}
                onChange={handleChange}
                maskChar={null}
              >
                {() => (
                  <Input
                    isRequired
                    variant="auth"
                    name="cpf_cliente"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    placeholder="xxx.xxx.xxx-xx"
                    mb="24px"
                    fontWeight="500"
                    size="md"
                  />
                )}
              </InputMask>
            </FormControl>

            <FormControl id="cep">
              <FormLabel>CEP</FormLabel>
              <Input
                isRequired
                type="number"
                name="cep"
                value={formNovaObra.cep}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="cidade">
              <FormLabel>Cidade</FormLabel>
              <Input
                isRequired
                name="cidade"
                value={formNovaObra.cidade}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="uf">
              <FormLabel>UF</FormLabel>
              <Input
                isRequired
                name="uf"
                value={formNovaObra.uf}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="rua">
              <FormLabel>Rua</FormLabel>
              <Input
                isRequired
                name="rua"
                value={formNovaObra.rua}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="bairro">
              <FormLabel>Bairro</FormLabel>
              <Input
                isRequired
                name="bairro"
                value={formNovaObra.bairro}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="numero">
              <FormLabel>Número</FormLabel>
              <Input
                isRequired
                name="numero"
                value={formNovaObra.numero}
                onChange={handleChange}
              />
            </FormControl>
          </SimpleGrid>

         
        </>
      ) : passos === 1 ? (
        <>
          <FormLabel>Novas Etapas</FormLabel>
          <NovaEtapa obraCadastrada={obraCadastrada} ultimaEtapaCadastrada={ultimaEtapaCadastrada} formDataEtapa={formDataEtapa} setFormDataEtapa={setFormDataEtapa} adicionarBotao={false} />
        </>
      ) : passos === 2 ? (
        <>
          <FormLabel>Novos Materiais</FormLabel>
          <NovoMaterial mostrarBotao={false} idEtapaSelecionada={idEtapaSelecionada} setIdEtapaSelecionada={setIdEtapaSelecionada} ultimoMaterialCadastrado={ultimoMaterialCadastrado} setUltimoMaterialCadastrado={setUltimoMaterialCadastrado} passos={passos} obraCadastrada={obraCadastrada} formDataMaterial={formDataMaterial} setFormDataMaterial={setFormDataMaterial} />
        </>
      ) : <></>}



<Box
  display="flex"
  justifyContent="flex-end"
  mt={4}
  columns={2}
  flexDirection={{ xs: 'column', sm: 'row' }} // Coluna em telas pequenas, linha em telas maiores
  gap={1} // Espaçamento entre os botões
>
  {passos !== 0 && (
    <Button
      variant="contained"
      style={{ backgroundColor: '#e8661e', color: 'white' }}
      onClick={passoAnterior}
    >
      Passo anterior
    </Button>
  )}

  {passos !== 2 && (
    <Button
      variant="contained"
      style={{ backgroundColor: '#e8661e', color: 'white' }}
      onClick={proximoPasso}
    >
      Próximo passo
    </Button>
  )}

  {passos === 0 && (
    <Button
      variant="contained"
      style={{ backgroundColor: '#e8661e', color: 'white' }}
      onClick={handleSubmitPassoUm}
    >
      Cadastrar obra
    </Button>
  )}

  {passos === 1 && (
    <Button
      variant="contained"
      style={{ backgroundColor: '#e8661e', color: 'white' }}
      onClick={handleSubmitPassoDois}
    >
      Cadastrar Etapa
    </Button>
  )}

  {passos === 2 && (
    <Button
      variant="contained"
      style={{ backgroundColor: '#e8661e', color: 'white' }}
      onClick={handleSubmitPassoTres}
    >
      Cadastrar Material
    </Button>
  )}
</Box>
    </Box>
  );
}