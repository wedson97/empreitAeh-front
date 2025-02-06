import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, useDisclosure, useToast } from "@chakra-ui/react";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";

export default function EditarFornecedor({setMostrarEditar, fornecedoreselecionado, setMostrarBotaoVoltarEditar,mostrarBotaoVoltarEditar}) {
    const { empreiteiro, setFornecedores} = useUser();
    
    const [formDataFornecedor, setFormDataFornecedor] = useState({
        id: fornecedoreselecionado.id,
        nome: fornecedoreselecionado.nome,
        email: fornecedoreselecionado.email,
        telefone: fornecedoreselecionado.telefone
    });
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleSubmit = async (e) => {
        e.preventDefault();
        onOpen();
      };
    const handleConfirmarEdicao = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem("token");
            const response = await api.put(`/fornecedor/${fornecedoreselecionado.id}`, formDataFornecedor, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            if (response.status===200){
                toast({
                    title: "Edição de Fornecedor!",
                    description: `Fornecedor ${formDataFornecedor.nome} atualizado com sucesso!`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    });
                const response_get_funcionarios = await api.get(`/fornecedores`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                if (response_get_funcionarios.status===200){
                    handleClickButtonVoltar()
                    setFornecedores(response_get_funcionarios.data)
                    onClose()
                }
                    
                
            }
        } catch (error) {
            toast({
                title: "Edição de Fornecedor!",
                description: `Edição de Fornecedor falhou!`,
                status: "error",
                duration: 3000,
                isClosable: true,
                });
    
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDataFornecedor((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleClickButtonVoltar= ()=>{
        setMostrarBotaoVoltarEditar(false)
        setMostrarEditar(false)
    }

    return (
        <>{mostrarBotaoVoltarEditar?<Button
            mb={4}
            onClick={()=>{handleClickButtonVoltar()}}
            backgroundColor={"#e8661e"}
            color={"white"}
          >Voltar
          </Button>:<></>}
          <Box
            p={4}
            maxW="1200px"
            mx="auto"
            backgroundColor="white"
            borderRadius="md"
            shadow="md"
        >
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl id="nome">
                    <FormLabel>Nome</FormLabel>
                    <Input
                        isRequired
                        name="nome"
                        value={formDataFornecedor.nome}
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl id="Email">
                    <FormLabel>Email</FormLabel>
                    <Input
                        value={formDataFornecedor.email}
                        isRequired
                        variant="auth"
                        name="email"
                        type="email" 
                        placeholder="Digite seu email"
                        onChange={handleInputChange}
                    />
                </FormControl>


                <FormControl id="telefone">
                    <FormLabel>Telefone</FormLabel>
                    <Input
                        isRequired
                        name="telefone"
                        value={formDataFornecedor.telefone}
                        onChange={handleInputChange}
                    />
                </FormControl>
            </SimpleGrid>
            
            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button backgroundColor="#e8661e" onClick={handleSubmit} color="white" mt={4}>
                    Enviar
                </Button>
            </Box>
            
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
            onClick={handleConfirmarEdicao}
            >
            Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </Box>
          </>
    );
}
