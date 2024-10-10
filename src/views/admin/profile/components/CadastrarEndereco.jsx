import { Box, Button, FormControl, FormLabel, Input, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, useToast, Heading } from "@chakra-ui/react";
import api from "api/requisicoes";
import { useUser } from "context/UseContext";
import React, { useState } from "react";

export default function CadastroEndereco() {
    const {donoObra, setDonoObra} = useUser()
  const [formData, setFormData] = useState({
    cep: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: ""
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onOpen();
  };

  const handleConfirmarAlteracao = async () => {
    const response = await api.post(`/dono_obra/${donoObra.id}/endereco`, formData)
    if(response.status===201){
        toast({
            title: "Cadastro concluído!",
            description: "O endereço foi cadastrado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setFormData({
            cep: "",
            cidade: "",
            bairro: "",
            rua: "",
            numero: ""
          })
          setDonoObra(response.data);
          
    }else{
        toast({
            title: "Erro",
            description: "O endereço não foi cadastrado",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
    }
    
    onClose();
    
  };

  return (
    <Box
      p={4}
      mx="auto"
      backgroundColor="white"
      borderRadius="md"
      shadow="md"
    >
      <form onSubmit={handleSubmit}>
      <Heading as="h3" size="lg" mb="6">
        Complete seu cadastro!
      </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl id="cep">
            <FormLabel>CEP</FormLabel>
            <Input
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              placeholder="Digite seu CEP"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>

          <FormControl id="cidade">
            <FormLabel>Cidade</FormLabel>
            <Input
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              placeholder="Digite sua cidade"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>

          <FormControl id="bairro">
            <FormLabel>Bairro</FormLabel>
            <Input
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              placeholder="Digite seu bairro"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>

          <FormControl id="rua">
            <FormLabel>Rua</FormLabel>
            <Input
              name="rua"
              value={formData.rua}
              onChange={handleInputChange}
              placeholder="Digite sua rua"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>

          <FormControl id="numero">
            <FormLabel>Número</FormLabel>
            <Input
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              placeholder="Digite o número"
              mb="24px"
              variant="auth"
              fontSize="sm"
              fontWeight="500"
            />
          </FormControl>
        </SimpleGrid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button backgroundColor="#e8661e" color="white" type="submit" mt={4}>
            Salvar Endereço
          </Button>
        </Box>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Alteração</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja salvar o endereço?
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
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
