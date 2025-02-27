import { Box, SimpleGrid, FormControl, FormLabel, Input, IconButton, Td, Tbody, Th, Tr, TableCaption, Thead, TableContainer, Table, useToast, Button } from "@chakra-ui/react";
import api from "api/requisicoes";
import { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { MdBuild } from "react-icons/md";

const EditarEtapa = ({ gerenciarObra, idEtapaSelecionada}) => {
  const [etapas, setEtapas] = useState([])
  const [formDataEtapa, setFormDataEtapa] = useState([])
  const toast = useToast();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataEtapa((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
   useEffect(() => {
        const fetchData = async () =>{
          const token = localStorage.getItem("token"); 
          const response = await api.get("/empreiteiro/obra/"+gerenciarObra.id+"/etapa/"+idEtapaSelecionada,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status===200){
                setFormDataEtapa(response.data)
            }
        }
            
        fetchData()
    }, []);
  const handleSubmit = async (e) => {
      e.preventDefault();
      
      
      try {
        const token = localStorage.getItem("token"); 
        const response = await api.put("/empreiteiro/obra/"+gerenciarObra.id+"/etapa/"+idEtapaSelecionada, formDataEtapa,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
        
        if (response.status === 200) {
          toast({
            title: "Obra editada.",
            description: "A obra foi editada com sucesso.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        //   setUltimoMaterialCadastrado(response.data)
        }
      } catch (error) {
        console.log("Erro na requisição:", error);
        toast({
          title: "Erro ao editar a etapa.",
          description: "Houve um erro ao tentar editar a etapa.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

  return (
    
    <>
    
    <Box 
  p={4} 
  maxW="1200px" 
  mx="auto" 
  backgroundColor="white" 
  borderRadius="md" 
  shadow="md"
>
  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
    <FormControl id="nome" isRequired>
      <FormLabel>Nome</FormLabel>
      <Input
        type="text"
        name="nome"
        value={formDataEtapa.nome}
        onChange={handleChange}
        placeholder="Digite o nome"
      />
    </FormControl>

    <FormControl id="custo_mao_obra" isRequired>
      <FormLabel>Custo Mão de Obra</FormLabel>
      <Input
        type="number"
        step="0.01"
        name="custo_mao_obra"
        value={formDataEtapa.custo_mao_obra}
        onChange={handleChange}
        placeholder="Digite o custo"
      />
    </FormControl>

    <FormControl id="data_inicio" isRequired>
      <FormLabel>Data de Início</FormLabel>
      <Input
        type="date"
        name="data_inicio"
        value={formDataEtapa.data_inicio}
        onChange={handleChange}
      />
    </FormControl>

    <FormControl id="data_finalizacao">
      <FormLabel>Data de Finalização</FormLabel>
      <Input
        type="date"
        name="data_finalizacao"
        value={formDataEtapa.data_finalizacao}
        onChange={handleChange}
      />
    </FormControl>
  </SimpleGrid>

  {/* Botão alinhado à direita */}
  <Box display="flex" justifyContent="flex-end" mt={4}>
    <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit}>
      Editar etapa
    </Button>
  </Box>
</Box>
    
   
    </>
  );
};

export default EditarEtapa;
