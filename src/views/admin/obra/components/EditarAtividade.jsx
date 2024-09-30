
import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, SimpleGrid, Select, useToast } from "@chakra-ui/react";
import api from "api/requisicoes"; 
import { useUser } from "context/UseContext";
export default function EditarAtividades({ atividade, setMostrarEditarAtividade,mostrarBotoesTabela , setMostrarBotoesTabela}) {
    const {empreiteiro} = useUser();
    const handleVoltar = () =>{
        setMostrarEditarAtividade(false)
        setMostrarBotoesTabela(!mostrarBotoesTabela)
    }
    const [formData, setFormData] = useState({
        finalizado: true,
      });
    const toast = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
           if(atividade.finalizado===false){
              const response = await api.put(`/empreiteiro/${empreiteiro.id}/obra/${atividade.obra.id}/atividade/${atividade.id}`, formData);
              if(response.status===200){
                toast({
                  title: "Atividade finalizada",
                  description: "Atividade finalizada com sucesso!",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                handleVoltar()
              }
           }else{
                toast({
                title: "Atividade já finalizada",
                description: "Atividade já está finalizada!",
                status: "error",
                duration: 3000,
                isClosable: true,
                });
            }
            
        
        } catch (error) {
          console.error(error);
          toast({
            title: "Erro ao enviar",
            description: "Ocorreu um erro ao enviar o formulário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };
    return (
        <Box>
        <Button
            mb={4}
            backgroundColor={"#e8661e"}
            color={"white"}
            onClick={() => handleVoltar()}
        >
            Voltar
        </Button>
        <Box p={4} maxW="1200px" mx="auto" backgroundColor="white" borderRadius="md" shadow="md">
            <Button backgroundColor="#e8661e" color="white" onClick={handleSubmit} mt={4}>
            Finalizar atividade
            </Button>
        </Box>
        </Box>
    );
}
