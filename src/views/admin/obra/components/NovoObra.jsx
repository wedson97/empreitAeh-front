import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, Select } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import api from "api/requisicoes";
import { useUser } from "context/UseContext";
import { useNavigate } from "react-router-dom";

export default function NovoOrcamento({ setShowTabela }) {
  const { orcamentos, setOrcamentos, setAlertaObra, empreiteiro, setEmpreiteiro } = useUser();
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEmpreiteiro = async () => {
      try {
        const empreiteiros = await api.get("/empreiteiros");
        const nome_empreiteiro_logado = localStorage.getItem("usuario");

        const empreiteiroFiltrado = empreiteiros.data.filter(e => e.nome === nome_empreiteiro_logado);
        if (empreiteiroFiltrado.length > 0) {
          setEmpreiteiro(empreiteiroFiltrado[0]);
          const empreiteiroId = empreiteiroFiltrado[0].id;
          const response = await api.get(`/empreiteiro/${empreiteiroId}/orcamentos`);
          setOrcamentos(response.data)
        }
      } catch (error) {
        console.error("Erro ao buscar os empreiteiros ou orçamentos:", error);
      }
    };

    fetchEmpreiteiro();
  }, []);

  useEffect(() => {
    if (empreiteiro) {
      setFormDataObra((prevData) => ({
        ...prevData,
        id_empreiteiro: empreiteiro.id,
      }));
    }
  }, [empreiteiro]);

  const [formDataEndereco, setFormDataEndereco] = useState({
    cep: null,
    rua: "",
    numero: null,
    cidade: "",
    bairro: ""
  });

  const [formDataObra, setFormDataObra] = useState({
    id_orcamento: '',
    id_dono_obra: ''
  });

  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;
    setFormDataEndereco({
      ...formDataEndereco,
      [name]: name === "numero" ? parseInt(value) || 0 : value,
    });
  };

  const handleSelectOrcamento = (e) => {
    const selectedOrcamentoId = e.target.value;

    const selectedOrcamento = orcamentos.find(orcamento => orcamento.id === parseInt(selectedOrcamentoId));

    if (selectedOrcamento) {
      setFormDataObra({
        ...formDataObra,
        id_orcamento: selectedOrcamento.id,
        id_dono_obra: selectedOrcamento.dono_obra.id 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/empreiteiro/${empreiteiro.id}/obras/${formDataObra.id_orcamento}`, formDataEndereco)
      if(response.status===201){
        console.log(response.data);
        const response_put_orcamento = await api.put(`/empreiteiro/${empreiteiro.id}/orcamentos/${formDataObra.id_orcamento}`, {
          data_aprovacao: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-')
        });
        if(response_put_orcamento.status===200){
          setAlertaObra({status:"success", titulo:"Obra iniciada!",descricao: `A obra foi inicia com sucesso!`, duracao:3000, visivel:true})
          setShowTabela(false);
          setFormDataEndereco({cep: null,rua: "",numero: null,cidade: "",bairro: ""})
          setTimeout(() => {
            setAlertaObra(prev => ({ ...prev, visivel: false }));
          }, 3000);
        }
        
      }
      
    } catch (error) {
      setAlertaObra({status:"error", titulo:"Falha ao iniciar a obra",descricao: `Verifique as informações e tente novamente`, duracao:3000, visivel:true})
      setTimeout(() => {
        setAlertaObra(prev => ({ ...prev, visivel: false }));
      }, 3000);
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
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        
        <FormControl id="id_orcamento">
          <FormLabel>ID do Orçamento</FormLabel>
          <Select
            isRequired={true}
            name="id_orcamento"
            value={formDataObra.id_orcamento}
            onChange={handleSelectOrcamento}
          >
            <option value="">Selecione um orçamento</option>
            {orcamentos.map((orcamento) => (
              <option key={orcamento.id} value={orcamento.id}>
                {orcamento.id} - {orcamento.dono_obra.nome}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="cep">
          <FormLabel>CEP</FormLabel>
          <Input
            isRequired={true}
            // as={InputMask}
            // mask="99999-999"
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

    

      <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit} mt={4}>
        Enviar
      </Button>
    </Box>
  );
}
