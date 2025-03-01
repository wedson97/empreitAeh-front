import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, useToast, Select } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import api from "api/requisicoes";
import { useUser } from "context/UseContext";
export default function NovoOrcamento({setShowTabela, showTabela}) {
  const { empreiteiro, setObras, obras } = useUser();
  const [obraSelecionada, setObraSelecionada] = useState(null);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        if (obras.length === 0) {
          let response;
          const token = localStorage.getItem("token");
          if (empreiteiro) {
            response = await api.get(`/empreiteiro/obras`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } 
          if (response) {
            setObras(response.data);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar as obras:", error);
      }
    };

    fetchObras();
  }, []);
  const [formData, setFormData] = useState({
    descricao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "numero" ? parseInt(value) || 0 : value,
    });
  };
  const toast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
        const token = localStorage.getItem("token"); 
        if (obraSelecionada !== null) {
          const response = await api.post('/empreiteiro/obra/'+obraSelecionada+'/orcamento', formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
          if (response.status === 201){
            toast({
              title: "Orçamento realizado!",
              description: "O orçamento foi realizado com sucesso!",
              status: "success",
              duration: 3000,
              isClosable: true,
              });
              setShowTabela(!showTabela);
          }
        }
        

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

  const handleSelectObra = (e) => {
    setObraSelecionada(e.target.value);
    console.log(e.target.value);
    
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
      <Select
  width="250px"
  backgroundColor={"#e8661e"}
  color={"white"}
  placeholder="Selecione uma obra"
  onChange={handleSelectObra}
>
  {obras
    .filter((obra) => obra.id_orcamento !== null) // Filtra antes de mapear
    .map((obra) => (
      <option key={obra.id} value={obra.id}>
        Obra: {obra.id}
      </option>
    ))}
</Select>

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
