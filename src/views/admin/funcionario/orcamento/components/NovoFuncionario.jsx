import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, SimpleGrid, useToast } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import { useUser } from "context/UseContext";
import api from "api/requisicoes";

export default function NovoFuncionario({handleMostrar}) {
    const { empreiteiro, setAlertaFuncionario } = useUser();
    const [formDataFuncionario, setFormDataFuncionario] = useState({
        nome: "",
        telefone:"",
        cpf: "",
        data_nascimento: ""
    });
    const toast = useToast();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formDataFuncionario);
        const token = localStorage.getItem("token"); 
            
        try {
            const response = await api.post(`/funcionarios`, formDataFuncionario,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if (response.status === 200) {
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
                handleMostrar();
            }
        } catch (error) {
            toast({
                title: "Cadastro falhou!",
                description: `Erro ao criar funcionário, verifique os dados e tente novamente`,
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

    const handleCpfChange = (e) => {
        const valorSemMascara = e.target.value.replace(/\D/g, '');
        setFormDataFuncionario((prevData) => ({
            ...prevData,
            cpf: valorSemMascara,
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
                <FormControl id="telefone">
                    <FormLabel>Telefone</FormLabel>
                    <Input
                        isRequired
                        name="telefone"
                        type="number"
                        value={formDataFuncionario.telefone}
                        onChange={handleInputChange}
                    />
                </FormControl>

                <FormControl id="cpf">
                    <FormLabel>CPF do funcionário</FormLabel>
                    <InputMask
                        mask="999.999.999-99"
                        value={formDataFuncionario.cpf}
                        onChange={handleCpfChange}
                    >
                        {(inputProps) => (
                            <Input
                                {...inputProps}
                                isRequired
                                variant="auth"
                                name="cpf"
                                type="text"
                                placeholder="xxx.xxx.xxx-xx"
                                fontSize="sm"
                                ms={{ base: "0px", md: "0px" }}
                                mb="24px"
                                fontWeight="500"
                                size="md"
                            />
                        )}
                    </InputMask>
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
        </Box>
    );
}
