
import {
    Flex,
    Icon,
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
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    useToast,
    Spinner,
    Box,
    Stack,
    Divider,
    Badge
  } from "@chakra-ui/react";
  import React, { useCallback, useEffect, useState} from "react";
  import { IoMdEye, IoMdClock} from "react-icons/io";
  import { MdCheckCircle, MdCancel  } from "react-icons/md";
import api from "api/requisicoes";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";
import PdfOrcamento from "./PdfOrcamento";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
  
export default function TabelaOrcamento({obra}) {
  const {orcamentos, setOrcamentos} = useUser()
  const [isPdfVisible, setPdfVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const {empreiteiro, donoObra} = useUser();
  const { isOpen: isConfirmar, onOpen: onConfirmarOpen, onClose: onConfirmarClose } = useDisclosure();
  const { isOpen: isRejeitarModalOpen, onOpen: onRejeitarOpen, onClose: onRejeitarClose } = useDisclosure();
  

  

  
  const { 
    isOpen: isDetalhesOpen, 
    onOpen: onDetalhesOpen, 
    onClose: onDetalhesClose 
  } = useDisclosure();


  const formatDate = (dateString) => {
    if (!dateString) return "-";
  
    const date = new Date(dateString);
    
    if (!isValid(date)) return "-"; // Garante que a data é válida antes de formatar
  
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const handleViewDetails = async (row) => {
    const token = localStorage.getItem("token"); 
    const response = await api.get(`/orcamento/${row.id}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setSelectedRow(response.data);
    onDetalhesOpen();
  };
  
  
  const [obraSelecionada, setObraSelecionada] = useState(null);
    const navigate = useNavigate();
    const modalAprovarOrcamento = async (row) =>{
      setSelectedRow(row)
      onConfirmarOpen()
    }
    const modalReprovarOrcamento = async (row) =>{
      setSelectedRow(row)
      onRejeitarOpen()
    }
    const toast = useToast();
    
    const handleReprovarOrcamento = useCallback(async (row) => {
      
      let response;
      try {
        if (donoObra) {
          response = await api.put(`/dono_obra/${row.dono_obra.id}/orcamento/${row.id}/reprovar`, {
            data_aprovacao: new Date().toISOString()
          });
          if (response && response.status === 200) {
            setOrcamentos((prevOrcamentos) =>
              prevOrcamentos.map((orcamento) =>
                orcamento.id === row.id
                  ? { ...orcamento, data_aprovacao: new Date().toISOString(), status: "Reprovado" }
                  : orcamento
              )
            );
          }
          toast({
            title: "Orçamento cancelado",
            description: "Orçamento cancelado com sucesso!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
        onRejeitarClose()
        
      } catch (error) {
        console.error("Erro ao aprovar o orçamento:", error);
      }
      
    }, [empreiteiro, donoObra, setOrcamentos]);
    const handleAprovarOrcamento = useCallback(async (row) => {
      let response;
      
      
      try {
        if (empreiteiro) {
          const token = localStorage.getItem("token"); 
          response = await api.post(`/empreiteiro/obra/${row.obra[0].id}/orcamento/pactuar`, {
            data_pactuacao: new Date().toISOString()
          },
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          if (response && response.status === 200) {
            setOrcamentos((prevOrcamentos) =>
              prevOrcamentos.map((orcamento) =>
                orcamento.id === row.id
                  ? { ...orcamento, data_pactuacao: new Date().toISOString() }
                  : orcamento
              )
            );
            toast({
              title: "Orçamento pactuado",
              description: "Orçamento pactuado com sucesso!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        } else if (donoObra) {
          
          const token = localStorage.getItem("token"); 
          response = await api.post(`/dono_obra/obra/${row.obra[0].id}/orcamento/aprovar`, {
            data_aprovacao: new Date().toISOString()
          },
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          if (response && response.status === 200) {
            setOrcamentos((prevOrcamentos) =>
              prevOrcamentos.map((orcamento) =>
                orcamento.id === row.id
                  ? { ...orcamento, data_aprovacao: new Date().toISOString() }
                  : orcamento
              )
            );
            toast({
              title: "Orçamento aprovado",
              description: "Orçamento aprovado com sucesso!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        }
        
        onConfirmarClose()
      } catch (error) {
        console.error("Erro ao aprovar o orçamento:", error);
      }
      
    }, [empreiteiro, donoObra, setOrcamentos]);
  
    useEffect(() => {
      window.scrollTo(0, 0);
      
      const fetchEmpreiteiro = async () => {
        const tipo_usuario = localStorage.getItem("tipo_usuario")
        const id = localStorage.getItem("id")
        if (tipo_usuario === null && id === null) {
          navigate("/");
        } else {
          try {
            const token = localStorage.getItem("token"); 
            const response = await api.get('/orcamentos',
              {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });

            if (response) {
              
              setOrcamentos(response.data);
            }
            
          } catch (error) {
            console.error("Erro ao buscar os orçamentos:", error);
          }
        }
      };
  
      fetchEmpreiteiro();
    }, [empreiteiro, donoObra, navigate, setOrcamentos]);

  

    const handleViewPdf = (row) => {
      setSelectedRow(row);
      setPdfVisible(true);
    };



    const ModalDetalhesOrcamento = () => (
      <Modal isOpen={isDetalhesOpen} onClose={onDetalhesClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes do Orçamento</ModalHeader>
          <ModalBody>
            {selectedRow && (
              <Stack spacing={4}>
                <Stack>
                  <Text fontWeight="bold">Descrição:</Text>
                  <Text>{selectedRow.descricao}</Text>
                </Stack>
                
                <Divider />
                
                <Stack direction="row" justify="space-between" flexWrap="wrap">
                  <Box>
                    <Text fontWeight="bold">Data Criação:</Text>
                    <Text>{formatDate(selectedRow.data_criacao)}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Data Aprovação:</Text>
                    <Text>{selectedRow.data_aprovacao ? formatDate(selectedRow.data_aprovacao) : '-'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Data Pactuação:</Text>
                    <Text>{selectedRow.data_pactuacao ? formatDate(selectedRow.data_pactuacao) : '-'}</Text>
                  </Box>
                  
                </Stack>
  
                <Divider />
  
                <Stack>
                  <Text fontWeight="bold" fontSize="lg">Dados Financeiros</Text>
                  <Stack direction="row" justify="space-between" flexWrap="wrap">
                    <Box>
                      <Text>Mão de Obra:</Text>
                      <Text>R$ {selectedRow.gasto_mao_obra?.toFixed(2)}</Text>
                    </Box>
                    <Box>
                      <Text>Materiais:</Text>
                      <Text>R$ {selectedRow.gasto_mateiriais?.toFixed(2)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Total:</Text>
                      <Text fontWeight="bold">R$ {selectedRow.valor_total?.toFixed(2)}</Text>
                    </Box>
                  </Stack>
                </Stack>
  
                <Divider />
  
                <Stack>
                  <Text fontWeight="bold" fontSize="lg">Informações da Obra</Text>
                  <Stack spacing={3}>
                    <Box>
                      <Text fontWeight="semibold">Empreiteiro:</Text>
                      <Text>{selectedRow.obra?.empreiteiro?.nome}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Email: {selectedRow.obra?.empreiteiro?.email}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedRow.obra?.empreiteiro?.cnpj ? `CNPJ: ${selectedRow.obra?.empreiteiro?.cnpj}` : `CPF: ${selectedRow.obra?.empreiteiro?.cpf}`}
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold">Dono da Obra:</Text>
                      <Text>{selectedRow.obra?.dono_obra?.nome}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Email: {selectedRow.obra?.dono_obra?.email}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        CPF: {selectedRow.obra?.dono_obra?.cpf}
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold">Endereço:</Text>
                      <Text>
                        {selectedRow.obra?.endereco?.rua}, {selectedRow.obra?.endereco?.numero}
                      </Text>
                      <Text>
                        {selectedRow.obra?.endereco?.bairro} - {selectedRow.obra?.endereco?.cidade}/{selectedRow.obra?.endereco?.uf}
                      </Text>
                      <Text>CEP: {selectedRow.obra?.endereco?.cep}</Text>
                    </Box>
  
                    <Stack direction="row" spacing={4}>
                      <Box>
                        <Text fontWeight="semibold">Data Início:</Text>
                        <Text>{formatDate(selectedRow.obra?.data_inicio)}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold">Data Entrega:</Text>
                        <Text>{formatDate(selectedRow.obra?.data_entrega)}</Text>
                      </Box>
                    </Stack>
  
                    <Box>
                      <Text fontWeight="semibold">ID Orçamento:</Text>
                      <Text>{selectedRow.obra?.id_orcamento}</Text>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onDetalhesClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );





    
    return (
      <SimpleGrid gap='20px' mb='20px' backgroundColor="white" borderRadius="20px" overflow="hidden">
      <TableContainer>
        <Table variant="striped" backgroundColor="#f0f3f5">
          <TableCaption>Registro de orçamentos</TableCaption>
          <Thead>
            <Tr>
              <Th>Descrição</Th>
              <Th>Data criação</Th>
              <Th>Opções</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orcamentos.map((row, index) => (
              <Tr key={index}>
                <Td>{row.descricao}</Td>
                <Td>{formatDate(row.data_criacao)}</Td>
              
                <Td>
                  <Flex gap={2}>
                    <IconButton
                      colorScheme="blue"
                      aria-label="Detalhes"
                      icon={<IoMdEye />}
                      onClick={() => handleViewDetails(row)}
                    />
                     {donoObra && !row.data_aprovacao && (
                          <Button 
                            backgroundColor="#e8661e" 
                            color="white" 
                            _hover={{ backgroundColor: "#d45a1a" }} 
                            onClick={() => handleAprovarOrcamento(row)}
                          >
                            Confirmar
                          </Button>
                        )}

                        {/* Botão para o empreiteiro */}
                        {empreiteiro && !row.data_aprovacao && !row.data_pactuacao && (
                          <Button 
                            backgroundColor="gray" 
                            color="white" 
                            _hover={{ backgroundColor: "#d45a1a" }} 
                            disabled // Botão cinza e sem onClick
                          >
                            Confirmar
                          </Button>
                        )}

                        {empreiteiro && row.data_aprovacao && !row.data_pactuacao && (
                          <Button 
                            backgroundColor="#e8661e" 
                            color="white" 
                            _hover={{ backgroundColor: "#d45a1a" }} 
                            onClick={() => handleAprovarOrcamento(row)} // Supondo que exista uma função para pactuar
                          >
                            Pactuar
                          </Button>
                        )}
                    {/* Mantenha os botões de aprovação/reprovação conforme necessário */}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <ModalDetalhesOrcamento />
        {isPdfVisible && <PdfOrcamento row={selectedRow} setPdfVisible={setPdfVisible} />}
        <Modal isOpen={isConfirmar} onClose={onConfirmarClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar orçamento</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja confirmar esse orçamento?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onConfirmarClose}>
              Cancelar
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isRejeitarModalOpen} onClose={onRejeitarClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancelar orçamento</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja cancelar esse orçamento?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onRejeitarClose}>
              Cancelar
            </Button>
            <Button 
              backgroundColor="#e8661e" 
              color="white" 
              _hover={{ backgroundColor: "#d45a1a" }} 
              onClick={()=>{handleReprovarOrcamento(selectedRow)}}
            >Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Finalizar Atividade</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja finalizar esta atividade?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} >
              Cancelar
            </Button>
            <Button 
              backgroundColor="#e8661e" 
              color="white" 
              _hover={{ backgroundColor: "#d45a1a" }} 
            >
              Finalizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </SimpleGrid>
        
    );
  }
  