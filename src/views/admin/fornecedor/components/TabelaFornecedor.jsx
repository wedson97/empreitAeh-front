import {
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";
import { MdBuild } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import EditarFornecedor from "./EditarFornecedor";

export default function TabelaFornecedor({handleMostrar, mostrarTabela, setMostrarBotaoVoltarEditar, mostrarBotaoVoltarEditar}) {
  const { fornecedores, setFornecedores, empreiteiro } = useUser();
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [fornecedoreselecionado, setFornecedoreselecionado] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token de autenticação não encontrado.");
          return;
        }
        const response = await api.get('/fornecedores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFornecedores(response.data);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
      }
    };
    fetchData();
    
  }, []);

  const abrirEditarFornecedor = (fornecedor) => {
    setFornecedoreselecionado(fornecedor);
    setMostrarEditar(true);
    setMostrarBotaoVoltarEditar(true);
  };

  const abrirExclusaoFornecedor = (fornecedor) => {
    setFornecedoreselecionado(fornecedor);
    onOpen();
  };
  const toast = useToast();
  
  const handleConfirmarExclusao = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/fornecedor/`+fornecedoreselecionado.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status >= 200 && response.status < 300) {
        setFornecedores(fornecedores.filter(f => f.id !== fornecedoreselecionado.id));
        toast({
          title: "Exclusão de funcionário",
          description: `Excluído com sucesso`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Exclusão de funcionário",
          description: `Falha na exclusão`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao tentar excluir o funcionário.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <>
      {mostrarEditar ? (
        <EditarFornecedor 
          setMostrarEditar={setMostrarEditar} 
          mostrarBotaoVoltarEditar={mostrarBotaoVoltarEditar} 
          fornecedoreselecionado={fornecedoreselecionado} 
          setMostrarBotaoVoltarEditar={setMostrarBotaoVoltarEditar} 
        />
      ) : (
        <>
          <SimpleGrid gap="20px" mb="20px" backgroundColor="white" borderRadius="20px" overflow="hidden">
            <TableContainer>
              <Table variant="striped" backgroundColor="#f0f3f5">
                <TableCaption>Registro de funcionários</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>telefone</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fornecedores.map((fornecedor) => (
                    <Tr key={fornecedor.id}>
                      <Td>{fornecedor.nome}</Td>
                      <Td>{fornecedor.email}</Td>
                      <Td>{fornecedor.telefone}</Td>
                      <Td>
                        <IconButton
                          backgroundColor="#2b6cb0"
                          color="white"
                          aria-label="Editar"
                          icon={<MdBuild />}
                          onClick={() => abrirEditarFornecedor(fornecedor)}
                          mr={1}
                        />
                        <IconButton
                          backgroundColor="#c51010"
                          color="white"
                          aria-label="Excluir"
                          icon={<IoMdCloseCircle />}
                          onClick={() => abrirExclusaoFornecedor(fornecedor)}
                          mr={1}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Modal de Confirmação */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Confirmar exclusão</ModalHeader>
                <ModalBody>
                  Tem certeza que deseja excluir o funcionário {fornecedoreselecionado?.nome}?
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="gray" mr={3} onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button 
                    backgroundColor="#e8661e" 
                    color="white" 
                    _hover={{ backgroundColor: "#d45a1a" }} 
                    onClick={handleConfirmarExclusao}
                  >
                    Excluir
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </SimpleGrid>
        </>
      )}
    </>
  );
}
