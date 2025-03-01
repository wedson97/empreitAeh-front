import { Box, SimpleGrid, FormControl, FormLabel, Input, IconButton, Td, Tbody, Th, Tr, Thead, TableContainer, Table, useToast, Button } from "@chakra-ui/react";
import api from "api/requisicoes";
import { useEffect, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";

const EditarEtapa = ({ gerenciarObra, idEtapaSelecionada }) => {
  const [formDataEtapa, setFormDataEtapa] = useState({});
  const [materiais, setMateriais] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // Buscar dados da etapa
        const etapaResponse = await api.get(
          `/empreiteiro/obra/${gerenciarObra.id}/etapa/${idEtapaSelecionada}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (etapaResponse.status === 200) {
          setFormDataEtapa(etapaResponse.data);
        }

        // Buscar materiais da etapa
        const materiaisResponse = await api.get(
          `/empreiteiro/obra/${gerenciarObra.id}/etapa/${idEtapaSelecionada}/materiais`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (materiaisResponse.status === 200) {
          setMateriais(materiaisResponse.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [gerenciarObra.id, idEtapaSelecionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataEtapa((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMateriais = [...materiais];
    updatedMateriais[index][name] = value;
    setMateriais(updatedMateriais);
  };

  const handleUpdateMaterial = async (materialId) => {
    try {
      const token = localStorage.getItem("token");
      const material = materiais.find(m => m.id === materialId);
      
      const response = await api.put(
        `/empreiteiro/obra/${gerenciarObra.id}/etapa/${idEtapaSelecionada}/material/${materialId}`,
        {
          valor_unitario: material.valor_unitario,
          quantidade: material.quantidade,
          descricao: material.descricao,
          nome: material.nome
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast({
          title: "Material atualizado!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar material",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await api.delete(
        `/empreiteiro/obra/${gerenciarObra.id}/etapa/${idEtapaSelecionada}/material/${materialId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMateriais(materiais.filter(m => m.id !== materialId));
        toast({
          title: "Material excluído!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir material",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const response = await api.put(
        `/empreiteiro/obra/${gerenciarObra.id}/etapa/${idEtapaSelecionada}`,
        formDataEtapa,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast({
          title: "Etapa atualizada!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast({
        title: "Erro ao editar a etapa",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" bg="white" borderRadius="md" shadow="md">
      {/* Formulário da Etapa */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <FormControl id="nome" isRequired>
          <FormLabel>Nome</FormLabel>
          <Input
            type="text"
            name="nome"
            value={formDataEtapa.nome || ''}
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
            value={formDataEtapa.custo_mao_obra || ''}
            onChange={handleChange}
            placeholder="Digite o custo"
          />
        </FormControl>

        <FormControl id="data_inicio" isRequired>
          <FormLabel>Data de Início</FormLabel>
          <Input
            type="date"
            name="data_inicio"
            value={formDataEtapa.data_inicio || ''}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_finalizacao">
          <FormLabel>Data de Finalização</FormLabel>
          <Input
            type="date"
            name="data_finalizacao"
            value={formDataEtapa.data_finalizacao || ''}
            onChange={handleChange}
          />
        </FormControl>
      </SimpleGrid>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button bg="#e8661e" color="white" onClick={handleSubmit}>
          Salvar Alterações
        </Button>
      </Box>
      {/* Tabela de Materiais */}
      <TableContainer mt={6}>
        <Table variant="striped">
          <Thead bg="gray.100">
            <Tr>
              <Th>Material</Th>
              <Th>valor unitario</Th>
              <Th>quantidade</Th>
              <Th>descrição </Th>
              <Th>Opções</Th>
            </Tr>
          </Thead>
          <Tbody>
            {materiais.map((material, index) => (
              <Tr key={material.id}>
                <Td>{material.nome}</Td>
                <Td>
                  <Input
                    type="number"
                    name="valor_unitario"
                    value={material.valor_unitario}
                    onChange={(e) => handleMaterialChange(index, e)}
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    name="quantidade"
                    value={material.quantidade}
                    onChange={(e) => handleMaterialChange(index, e)}
                  />
                </Td>
                <Td>
                  <Input
                    type="text"
                    step="0.01"
                    name="descricao"
                    value={material.descricao}
                    onChange={(e) => handleMaterialChange(index, e)}
                  />
                </Td>
                <Td>
                  <IconButton
                    icon={<FaCheck />}
                    colorScheme="green"
                    mr={2}
                    onClick={() => handleUpdateMaterial(material.id)}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDeleteMaterial(material.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      
    </Box>
  );
};

export default EditarEtapa;