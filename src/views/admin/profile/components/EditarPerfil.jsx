import { Box, Button, FormControl, FormLabel, Input, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, useToast, Heading } from "@chakra-ui/react";
import api from "api/requisicoes";
import { useUser } from "context/UseContext";
import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";

export default function EditarPerfil({handleToggleEditarPerfil}) {
  const { empreiteiro, donoObra, setDonoObra, setEmpreiteiro } = useUser();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cnpj: "",
    email: "",
    senha: ""
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (empreiteiro) {
      setFormData({
        nome: empreiteiro.nome,
        cpf: empreiteiro.cpf,
        cnpj: empreiteiro.cnpj,
        email: empreiteiro.email,
        senha: "" 
      });
    } else if (donoObra) {
      setFormData({
        nome: donoObra.nome,
        cpf: donoObra.cpf,
        cnpj: donoObra.cnpj,
        email: donoObra.email,
        senha: ""
      });
    }
  }, [empreiteiro,donoObra]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onOpen();
  };

  const handleConfirmarAlteracao = async () => {
    let response;
    if (empreiteiro) {
      response = await api.put(`/empreiteiro/${empreiteiro.id}`, formData);
    } else if (donoObra) {
      response = await api.put(`/dono_obra/${donoObra.id}`, formData);
    }
    if (response) {
        if(empreiteiro){
            setEmpreiteiro(response.data);
        }else if(donoObra){
            setDonoObra(response.data);
        }
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("usuario", response.data.nome);
      onClose();
      toast({
        title: "Edição concluída!",
        description: "O perfil foi editado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
        });
        handleToggleEditarPerfil()
    }else{
        toast({
            title: "Edição falho!",
            description: "O perfil não foi editado com sucesso",
            status: "error",
            duration: 3000,
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
      <form onSubmit={handleSubmit}>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl id="nome">
            <FormLabel>Nome</FormLabel>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Digite seu nome"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>

          <FormControl id="cpf">
            <FormLabel>CPF</FormLabel>
            <InputMask
              mask="999.999.999-99"
              value={formData.cpf}
              onChange={handleInputChange}
              maskChar={null}
            >
              {() => (
                <Input
                  name="cpf"
                  variant="auth"
                  placeholder="xxx.xxx.xxx-xx"
                  mb="24px"
                  fontSize="sm"
                  fontWeight="500"
                />
              )}
            </InputMask>
          </FormControl>

          <FormControl id="cnpj">
            <FormLabel>CNPJ</FormLabel>
            <InputMask
              mask="99.999.999/9999-99"
              value={formData.cnpj}
              onChange={handleInputChange}
              maskChar={null}
            >
              {() => (
                <Input
                  name="cnpj"
                  variant="auth"
                  placeholder="xx.xxx.xxx/xxxx-xx"
                  mb="24px"
                  fontSize="sm"
                  fontWeight="500"
                />
              )}
            </InputMask>
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Digite seu email"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>

          <FormControl id="senha">
            <FormLabel>Senha</FormLabel>
            <Input
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>

        </SimpleGrid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button backgroundColor="#e8661e" color="white" type="submit" mt={4}>
            Salvar Alterações
          </Button>
        </Box>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deseja editar</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja salvar as alterações?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button 
            backgroundColor="#e8661e" 
            color="white" 
            _hover={{ backgroundColor: "#d45a1a" }} 
            onClick={handleConfirmarAlteracao}
            >
            Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
