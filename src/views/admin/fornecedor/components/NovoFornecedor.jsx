import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, SimpleGrid, useToast } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import { useUser } from "context/UseContext";
import api from "api/requisicoes";
import { logDOM } from "@testing-library/react";

export default function NovoFornecedor({handleMostrar}) {
    const { empreiteiro, setAlertaFuncionario } = useUser();
    const [formDataFornecedor, setFormDataFornecedor] = useState({
        nome: "",
        email: "",
        telefone: ""
    });
    const toast = useToast();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem("token"); 
            
            const response = await api.post(
                `/fornecedores`,
                formDataFornecedor,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        
            if (response.status === 201) {
                toast({
                    title: "Fornecedor cadastrado!",
                    description: `Fornecedor ${formDataFornecedor.nome} cadastrado com sucesso!`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
               
                setFormDataFornecedor({
                    nome: "",
                    cpf: "",
                    data_nascimento: ""
                });
                handleMostrar();
            }
        } catch (error) {
            toast({
                title: "Cadastro falhou!",
                description: `Erro ao criar Fornecedor, verifique os dados e tente novamente`,
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


    return (
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
        </Box>
    );
}
