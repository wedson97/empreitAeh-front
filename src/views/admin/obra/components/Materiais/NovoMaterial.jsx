import { Box, SimpleGrid, FormControl, FormLabel, Input, Select, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Button, useToast } from "@chakra-ui/react";
import api from "api/requisicoes";
import { useUser } from "context/UseContext";
import { useEffect, useState } from "react";

const NovoMaterial = ({ mostrarBotao, idEtapaSelecionada, setIdEtapaSelecionada, ultimoMaterialCadastrado, passos, formDataMaterial, setFormDataMaterial, obraCadastrada }) => {
  
  const [etapas, setEtapas] = useState([]);
  const { fornecedores, setFornecedores } = useUser();
  const [materiais, setMateriais] = useState([]);
  const { setUltimoMaterialCadastrado,setObraSelecionada, obraSelecionada } = useUser();
  const toast = useToast();
  console.log(obraSelecionada);
  
  // Valores iniciais do formulário
  const initialFormData = {
    id_fornecedor: "",
    nome: "",
    descricao: "",
    valor_unitario: "",
    quantidade: "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataMaterial({ ...formDataMaterial, [name]: value });
  };

  const handleSelectChange = (e) => {
    setIdEtapaSelecionada(e.target.value); // Atualiza o ID da etapa selecionada
  };

  // Função para buscar os materiais da etapa selecionada
  const fetchMateriaisDaEtapa = async (idEtapa) => {
    if (!idEtapa) return; // Não faz a requisição se não houver etapa selecionada

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/empreiteiro/obra/${obraCadastrada}/etapa/${idEtapa}/materiais`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setMateriais(response.data); // Atualiza o estado com os materiais da etapa
      }
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
      toast({
        title: "Erro ao buscar materiais.",
        description: "Não foi possível carregar os materiais da etapa.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Executa a função de busca sempre que o ID da etapa selecionada mudar
  useEffect(() => {
    fetchMateriaisDaEtapa(idEtapaSelecionada);
  }, [idEtapaSelecionada,ultimoMaterialCadastrado]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      console.log(obraCadastrada);
      let response;
      if(obraCadastrada){
        response = await api.get(`/empreiteiro/obra/${obraCadastrada}/etapas`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }else{
        response = await api.get(`/empreiteiro/obra/${obraSelecionada.id}/etapas`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      

      if (response.status === 200) {
        setEtapas(response.data);
      }
    };

    const fetchDataFornecedor = async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/fornecedores`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setFornecedores(response.data);
      }
    };

    fetchData();
    fetchDataFornecedor();
  }, [passos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/empreiteiro/obra/" + obraCadastrada + "/etapa/" + idEtapaSelecionada + "/materiais", formDataMaterial, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast({
          title: "Material cadastrado.",
          description: "O material foi cadastrado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUltimoMaterialCadastrado(response.data);

        // Zerar o formulário após o envio
        setFormDataMaterial(initialFormData);

        // Recarregar os materiais da etapa após cadastrar um novo material
        fetchMateriaisDaEtapa(idEtapaSelecionada);
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
      toast({
        title: "Erro ao cadastrar o material.",
        description: "Houve um erro ao tentar cadastrar o material.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box p={4} maxW="1200px" mx="auto" backgroundColor="white" borderRadius="md" shadow="md">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          <FormControl id="id_etapa" isRequired>
            <FormLabel>Etapa</FormLabel>
            <Select value={idEtapaSelecionada} onChange={handleSelectChange} placeholder="Selecione uma etapa">
              {etapas.map((etapa) => (
                <option key={etapa.id} value={etapa.id}>
                  {etapa.nome}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="id_fornecedor" isRequired>
            <FormLabel>Fornecedor</FormLabel>
            <Select name="id_fornecedor" value={formDataMaterial.id_fornecedor} onChange={handleChange} placeholder="Selecione um fornecedor">
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="nome" isRequired>
            <FormLabel>Nome</FormLabel>
            <Input type="text" name="nome" value={formDataMaterial.nome} onChange={handleChange} placeholder="Digite o nome" />
          </FormControl>

          <FormControl id="descricao" isRequired>
            <FormLabel>Descrição</FormLabel>
            <Input type="text" name="descricao" value={formDataMaterial.descricao} onChange={handleChange} placeholder="Digite a descrição" />
          </FormControl>

          <FormControl id="valor_unitario" isRequired>
            <FormLabel>Valor Unitário</FormLabel>
            <Input type="number" step="0.01" name="valor_unitario" value={formDataMaterial.valor_unitario} onChange={handleChange} placeholder="Digite o valor" />
          </FormControl>

          <FormControl id="quantidade" isRequired>
            <FormLabel>Quantidade</FormLabel>
            <Input type="number" name="quantidade" value={formDataMaterial.quantidade} onChange={handleChange} placeholder="Digite a quantidade" />
          </FormControl>
        </SimpleGrid>
        {mostrarBotao === true && (
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit}>
              Cadastrar Material
            </Button>
          </Box>
        )}
      </Box>
      
      <TableContainer>
        <Table variant="striped" backgroundColor="#f0f3f5">
          <TableCaption>Registro de Materiais</TableCaption>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Valor Unitário</Th>
              <Th>Quantidade</Th>
            </Tr>
          </Thead>
          <Tbody>
            {materiais.map((row, index) => (
              <Tr key={index}>
                <Td>{row.nome}</Td>
                <Td>{row.valor_unitario}</Td>
                <Td>{row.quantidade}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        
      </TableContainer>
    </>
  );
};

export default NovoMaterial;