import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, useToast } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import api from "api/requisicoes";
import NovaEtapa from "./etapas/NovaEtapa";
import NovoMaterial from "./Materiais/NovoMaterial";
import { useUser } from "context/UseContext";

export default function NovoObra({ handleVoltarTabela }) {
  
  
  const {idEtapaSelecionada, setIdEtapaSelecionada, obraCadastrada, setObraCadastrada, ultimoMaterialCadastrado, setUltimoMaterialCadastrado, ultimaEtapaCadastrada, setUltimaEtapaCadastrada} = useUser();
  
  const [passos, setPassos] = useState(0)
  const [formNovaObra, setFormNovaObra] = useState({
    cpf_cliente: "",
    data_inicio: "",
    data_entrega: "",
    cep: "",
    cidade: "",
    uf: "",
    bairro: "",
    rua: "",
    numero: "",
    valor_metro: "",
    qtd_metros: "",
    descricao: ""
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
    if (passos===0){
      if(obraCadastrada===null){
        toast({
          title: "Cadastro incompleto",
          description: "Cadastre uma obra antes!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }else{
        setPassos(passos+1)
      }
    }
    if (passos === 1){
      if(ultimaEtapaCadastrada===null){
        toast({
          title: "Cadastro incompleto",
          description: "Cadastre uma etapa antes!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }else{
        setPassos(passos+1)
      }
      
    }
  }
  const passoAnterior = () => {
    if (passos !== 0){
      setPassos(passos-1)
    }
  }

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
      const response = await api.post("/empreiteiro/obra/"+obraCadastrada+"/etapas", formDataEtapa,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      setUltimaEtapaCadastrada(response.data.id)
      if (response.status === 200) {
        toast({
          title: "Etapa cadastrada.",
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
  const handleSubmitPassoTres = async (e) => {
    e.preventDefault();
    
    
    try {
      const token = localStorage.getItem("token"); 
      const response = await api.post("/empreiteiro/obra/"+obraCadastrada+"/etapa/"+idEtapaSelecionada+"/materiais", formDataMaterial,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      
      if (response.status === 200) {
        toast({
          title: "Obra cadastrada.",
          description: "A obra foi cadastrada com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUltimoMaterialCadastrado(response.data)
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
      maxW="1200px"
      mx="auto"
      backgroundColor="white"
      borderRadius="md"
      shadow="md"
    >
      
      {passos === 0 ? (
        <>
         <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
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

        <FormControl id="valor_metro">
          <FormLabel>Valor por Metro</FormLabel>
          <Input
            isRequired
            type="number"
            step="0.01"
            name="valor_metro"
            value={formNovaObra.valor_metro}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="qtd_metros">
          <FormLabel>Quantidade de Metros</FormLabel>
          <Input
            isRequired
            type="number"
            name="qtd_metros"
            value={formNovaObra.qtd_metros}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_inicio">
          <FormLabel>Data de Início</FormLabel>
          <Input
            isRequired
            type="date"
            name="data_inicio"
            value={formNovaObra.data_inicio}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_entrega">
          <FormLabel>Data de Término</FormLabel>
          <Input
            isRequired
            type="date"
            name="data_entrega"
            value={formNovaObra.data_entrega}
            onChange={handleChange}
          />
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
          <FormLabel>uf</FormLabel>
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

      <FormControl id="descricao" mt={4}>
        <FormLabel>Descrição</FormLabel>
        <Textarea
          isRequired
          name="descricao"
          value={formNovaObra.descricao}
          onChange={handleChange}
          rows={4}
        />
      </FormControl>
        </>
       ): passos === 1 ? (
       <>
       <FormLabel>Novas Etapas</FormLabel>
        
        <NovaEtapa obraCadastrada={obraCadastrada} ultimaEtapaCadastrada={ultimaEtapaCadastrada} formDataEtapa={formDataEtapa} setFormDataEtapa={setFormDataEtapa} adicionarBotao={false}/>
       </>
       ): passos === 2 ? (
       <>
       <FormLabel>Novos Materiais</FormLabel>
        
        <NovoMaterial mostrarBotao={false} idEtapaSelecionada={idEtapaSelecionada} setIdEtapaSelecionada={setIdEtapaSelecionada} ultimoMaterialCadastrado={ultimoMaterialCadastrado} setUltimoMaterialCadastrado={setUltimoMaterialCadastrado} passos={passos} obraCadastrada={obraCadastrada} formDataMaterial={formDataMaterial} setFormDataMaterial={setFormDataMaterial}/>
       </>
       ):<></>}

<Box display="flex" justifyContent="flex-end" mt={4}>
        {passos !== 0 ?(<Button backgroundColor="#e8661e" color="white" onClick={passoAnterior} style={{margin:1}}>
            Passo anterior
          </Button>):(<></>)}
        {passos !== 2 ? (
          <>
          
          <Button backgroundColor="#e8661e" color="white" onClick={proximoPasso}>
            Próximo passo
          </Button>
          
          </>
          
        ) : (
         <></>
        )}
        {passos === 0 ? 
        ( 
          <Button backgroundColor="#e8661e" color="white" onClick={handleSubmitPassoUm}>
            Cadastrar obra
          </Button>
        )
        : passos === 1 ? 
        ( 
          <Button backgroundColor="#e8661e" color="white" onClick={handleSubmitPassoDois}>
            Cadastrar Etapa
          </Button>
        )
        : passos === 2 ?
        ( 
          <Button backgroundColor="#e8661e" color="white" onClick={handleSubmitPassoTres}>
            Cadastrar Material
          </Button>
        )
        :<></>}
      </Box>

    </Box>
  );
}
