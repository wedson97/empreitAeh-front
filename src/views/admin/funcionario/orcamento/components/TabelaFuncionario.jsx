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
import EditarFuncionario from "./EditarFuncionario";
import { IoMdCloseCircle } from "react-icons/io";

export default function TabelaFuncionario({handleMostrar, mostrarTabela, setMostrarBotaoVoltarEditar, mostrarBotaoVoltarEditar}) {
  const { funcionarios, setFuncionarios, empreiteiro } = useUser();
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (empreiteiro && empreiteiro.id) {
        const response = await api.get(`/empreiteiro/${empreiteiro.id}/funcionarios`);
        setFuncionarios(response.data);
      }
    };
    fetchData();
  }, [empreiteiro]);

  function formatarCPF(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  const abrirEditarFuncionario = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setMostrarEditar(true);
    setMostrarBotaoVoltarEditar(true);
  };

  const abrirExclusaoFuncionario = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    onOpen();
  };
  const toast = useToast();
  
  const handleConfirmarExclusao = async () => {
    try {
      const response = await api.delete(`/empreiteiro/${empreiteiro.id}/funcionario/${funcionarioSelecionado.id}`);
  
      if (response.status >= 200 && response.status < 300) {
        setFuncionarios(funcionarios.filter(f => f.id !== funcionarioSelecionado.id));
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
        <EditarFuncionario 
          setMostrarEditar={setMostrarEditar} 
          mostrarBotaoVoltarEditar={mostrarBotaoVoltarEditar} 
          funcionarioSelecionado={funcionarioSelecionado} 
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
                    <Th>CPF</Th>
                    <Th>Data de nascimento</Th>
                    <Th>Opções</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {funcionarios.map((funcionario) => (
                    <Tr key={funcionario.id}>
                      <Td>{funcionario.nome}</Td>
                      <Td>{formatarCPF(funcionario.cpf)}</Td>
                      <Td>{new Date(new Date(funcionario.data_nascimento).setDate(new Date(funcionario.data_nascimento).getDate() + 1)).toLocaleDateString("pt-BR")}</Td>
                      <Td>
                        <IconButton
                          backgroundColor="#2b6cb0"
                          color="white"
                          aria-label="Editar"
                          icon={<MdBuild />}
                          onClick={() => abrirEditarFuncionario(funcionario)}
                          mr={1}
                        />
                        <IconButton
                          backgroundColor="#c51010"
                          color="white"
                          aria-label="Excluir"
                          icon={<IoMdCloseCircle />}
                          onClick={() => abrirExclusaoFuncionario(funcionario)}
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
                  Tem certeza que deseja excluir o funcionário {funcionarioSelecionado?.nome}?
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
