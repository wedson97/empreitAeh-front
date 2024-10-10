import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, Select, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import api from "api/requisicoes"; 
import { useUser } from "context/UseContext";

export default function EditarAtividades({ atividade, setMostrarEditarAtividade, mostrarBotoesTabela, setMostrarBotoesTabela }) {
  const { empreiteiro, funcionarios } = useUser();
  const [formData, setFormData] = useState({
    nome: atividade.nome,
    descricao: atividade.descricao,
    data_inicio: atividade.data_inicio,
    data_termino: atividade.data_termino,
    finalizado: false,
    id_obra: atividade.obra.id,
    cpf_funcionario: atividade.funcionario.cpf,
  });
  const [isFinalizarOpen, setIsFinalizarOpen] = useState(false);

  const { isOpen: isEditarOpen, onOpen: onEditarOpen, onClose: onEditarClose } = useDisclosure();
  const { isOpen: isFinalizarModalOpen, onOpen: onFinalizarOpen, onClose: onFinalizarClose } = useDisclosure();

  const handleVoltar = () => {
    setMostrarEditarAtividade(false);
    setMostrarBotoesTabela(!mostrarBotoesTabela);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditarOpen();
  };

  const handleSubmitFinalizar = (e) => {
    e.preventDefault();
    onFinalizarOpen();
  };

  const handleFinalizar = async () => {
    
    if(atividade.finalizado===true){
      toast({
        title: "Erro",
        description: "Atividade já está finalizada!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onFinalizarClose();
      return null;
    }
    try {
      const response = await api.put(
        `/empreiteiro/${empreiteiro.id}/obra/${atividade.obra.id}/atividade/${atividade.id}`,
        { finalizado: true }
      );
      if (response.status === 200) {
        toast({
          title: "Atividade finalizada",
          description: "Atividade finalizada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleVoltar();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao finalizar",
        description: "Ocorreu um erro ao finalizar a atividade.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onFinalizarClose();
  };

  const handleSubmitConfirmar = async () => {
    if(atividade.finalizado===true){
      toast({
        title: "Erro",
        description: "Atividade já está finalizada!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onEditarClose();
      return null;
    }
    try {
      const response = await api.put(
        `/empreiteiro/${empreiteiro.id}/obra/${atividade.obra.id}/atividade/${atividade.id}`,
        formData
      );
      if (response.status === 200) {
        toast({
          title: "Atividade alterada",
          description: "Atividade alterada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleVoltar();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao salvar as alterações.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onEditarClose();
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" backgroundColor="white" borderRadius="md" shadow="md">
      <Button
        mb={4}
        backgroundColor={"#e8661e"}
        color={"white"}
        onClick={handleVoltar}
      >
        Voltar
      </Button>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl id="nome">
          <FormLabel>Nome</FormLabel>
          <Input
            isRequired
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="id_funcionario">
          <FormLabel>Funcionário</FormLabel>
          <Select
            isRequired
            name="cpf_funcionario"
            value={formData.cpf_funcionario || ''}
            onChange={handleChange}
          >
            <option key={atividade.funcionario.cpf} value={atividade.funcionario.cpf}>
              {atividade.funcionario.nome}
            </option>
            {funcionarios.map((funcionario) => (
              <option key={funcionario.cpf} value={funcionario.cpf}>
                {funcionario.nome}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="data_inicio">
          <FormLabel>Data de Início</FormLabel>
          <Input
            isRequired
            type="date"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="data_termino">
          <FormLabel>Data de Término</FormLabel>
          <Input
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
          isRequired
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={4}
        />
      </FormControl>

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button backgroundColor="#e8661e" color="white" onClick={handleSubmitFinalizar} ml={2}>
          Finalizar atividade
        </Button>
        <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit} ml={2}>
          Editar
        </Button>
      </Box>

      {/* Modal de Confirmação para Edição */}
      <Modal isOpen={isEditarOpen} onClose={onEditarClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deseja editar</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja salvar as alterações?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onEditarClose}>
              Cancelar
            </Button>
            <Button 
              backgroundColor="#e8661e" 
              color="white" 
              _hover={{ backgroundColor: "#d45a1a" }} 
              onClick={handleSubmitConfirmar}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação para Finalização */}
      <Modal isOpen={isFinalizarModalOpen} onClose={onFinalizarClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Finalizar Atividade</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja finalizar esta atividade?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onFinalizarClose}>
              Cancelar
            </Button>
            <Button 
              backgroundColor="#e8661e" 
              color="white" 
              _hover={{ backgroundColor: "#d45a1a" }} 
              onClick={handleFinalizar}
            >
              Finalizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
