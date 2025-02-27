import { Box, SimpleGrid, FormControl, FormLabel, Input, IconButton, Td, Tbody, Th, Tr, TableCaption, Thead, TableContainer, Table, useToast, Button } from "@chakra-ui/react";
import api from "api/requisicoes";
import { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { MdBuild } from "react-icons/md";

const NovaEtapa = ({formDataEtapa, setFormDataEtapa, ultimaEtapaCadastrada, obraCadastrada, adicionarBotao}) => {
  const [etapas, setEtapas] = useState([])
  const toast = useToast();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataEtapa((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const fetchData = async () =>{
    const token = localStorage.getItem("token"); 
    const response = await api.get("/empreiteiro/obra/"+obraCadastrada+"/etapas",
      {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      if (response.status===200){
        setEtapas(response.data)
      }
  }
  useEffect(() => {
      
          
      fetchData()
  }, [ultimaEtapaCadastrada]);

  const handleSubmit = async (e) => {
       e.preventDefault();
          
        
        try {
          const token = localStorage.getItem("token"); 
          const response = await api.post("/empreiteiro/obra/"+obraCadastrada+"/etapas", formDataEtapa,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
          if (response.status === 200) {
            toast({
              title: "Etapa cadastrada.",
              description: "Siga para o próximo passo!.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            fetchData()
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
    
    <>
    
    <Box p={4} maxW="1200px" mx="auto" backgroundColor="white" borderRadius="md" shadow="md">
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
      {adicionarBotao === true && (
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit}>
            Cadastrar Etapa
          </Button>
        </Box>
      )}
    </Box>
    
    <TableContainer>
        <Table variant="striped" backgroundColor="#f0f3f5">
          <TableCaption>Registro de obras</TableCaption>
          <Thead>
            <Tr>
              <Th>Etapa</Th>
              <Th>Status</Th>
              <Th>Data inicio</Th>
              <Th>Data finalização</Th>
            </Tr>
          </Thead>
          <Tbody>
            {etapas.map((row, index) => {
              return (
                <Tr key={index}>
                  <Td>{row.nome}</Td>
                  <Td>{row.status}</Td>
                  <Td>{new Date(row.data_inicio).toLocaleDateString("pt-BR")}</Td>
                  <Td>{new Date(row.data_finalizacao).toLocaleDateString("pt-BR")}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      
    </>
  );
};

export default NovaEtapa;
