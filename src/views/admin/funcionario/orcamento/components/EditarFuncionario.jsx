import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, useDisclosure, useToast } from "@chakra-ui/react";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";

export default function EditarFuncionario({setMostrarEditar, funcionarioSelecionado, setMostrarBotaoVoltarEditar,mostrarBotaoVoltarEditar}) {
    const { empreiteiro, setFuncionarios} = useUser();
    
    const [formDataFuncionario, setFormDataFuncionario] = useState({
        nome: funcionarioSelecionado.nome,
        cpf: funcionarioSelecionado.cpf,
        data_nascimento: funcionarioSelecionado.data_nascimento
    });
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleSubmit = async (e) => {
        e.preventDefault();
        onOpen();
      };
    const handleConfirmarEdicao = async (e) => {
        e.preventDefault();
        console.log(formDataFuncionario);
        
        try {
            const response = await api.put(`/empreiteiro/${empreiteiro.id}/funcionario/${funcionarioSelecionado.id}`, formDataFuncionario);
            if (response.status===200){
                toast({
                    title: "Edição de funcionario!",
                    description: `Funcionário ${formDataFuncionario.nome} atualizado com sucesso!`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    });
                console.log(response.data);
                const response_get_funcionarios = await api.get(`/empreiteiro/${empreiteiro.id}/funcionarios`);
                if (response_get_funcionarios.status===200){
                    handleClickButtonVoltar()
                    setFuncionarios(response_get_funcionarios.data)
                    onClose()
                }
                    
                
            }
        } catch (error) {
            toast({
                title: "Edição de funcionario!",
                description: `Edição de funcionario falhou!`,
                status: "error",
                duration: 3000,
                isClosable: true,
                });
    
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDataFuncionario((prevData) => ({
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
                        value={formDataFuncionario.nome}
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl id="cpf">
                    <FormLabel>CPF do funcionário</FormLabel>
                    <Input
                        isRequired
                        variant='auth'
                        name="cpf"
                        type='text'
                        placeholder='xxx.xxx.xxx-xx'
                        fontSize='sm'
                        ms={{ base: "0px", md: "0px" }}
                        mb='24px'
                        fontWeight='500'
                        size='md'
                        value={formDataFuncionario.cpf}
                        onChange={handleInputChange}
                    />
                </FormControl>

                <FormControl id="data_nascimento">
                    <FormLabel>Data de nascimento</FormLabel>
                    <Input
                        isRequired
                        type="date"
                        name="data_nascimento"
                        value={formDataFuncionario.data_nascimento}
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
