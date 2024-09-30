import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, SimpleGrid, useToast } from "@chakra-ui/react";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";

export default function NovoFuncionario({handleMostrar}) {
    const { empreiteiro, setAlertaFuncionario } = useUser();
    const [formDataFuncionario, setFormDataFuncionario] = useState({
        nome: "",
        cpf: "",
        data_nascimento: ""
    });
    const toast = useToast();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(`/empreiteiro/${empreiteiro.id}/funcionarios`, formDataFuncionario);
            if (response.status===200){
                toast({
                    title: "Funcionário cadastrado!",
                    description: `Funcionário ${formDataFuncionario.nome} cadastrado com sucesso!`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    });
               
                setFormDataFuncionario({
                    nome: "",
                    cpf: "",
                    data_nascimento: ""
                });
                handleMostrar()
            }
        } catch (error) {
            setAlertaFuncionario({
                status: "error",
                titulo: "Cadastro falhou!",
                descricao: `Erro ao criar funcionário, verifique os dados e tente novamente`,
                duracao: 3000,
                visivel: true,
            });
            
            setFormDataFuncionario({
                nome: "",
                cpf: "",
                data_nascimento: ""
            });
    
            setTimeout(() => {
                setAlertaFuncionario(prev => ({ ...prev, visivel: false }));
            }, 5000);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDataFuncionario((prevData) => ({
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
                        value={formDataFuncionario.data_nascimento} // Correção do valor
                        onChange={handleInputChange} // Adicionado onChange
                    />
                </FormControl>
            </SimpleGrid>

            <Button backgroundColor="#e8661e" onClick={handleSubmit} color="white" mt={4}>
                Enviar
            </Button>
        </Box>
    );
}
