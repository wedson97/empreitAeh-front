
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
    useToast
  } from "@chakra-ui/react";
  import React, { useCallback, useEffect, useState} from "react";
  import { IoMdEye, IoMdClock} from "react-icons/io";
  import { MdCheckCircle, MdCancel  } from "react-icons/md";
import api from "api/requisicoes";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";
import PdfOrcamento from "./PdfOrcamento";
  
export default function TabelaOrcamento() {
  const {orcamentos, setOrcamentos} = useUser()
  const [isPdfVisible, setPdfVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const {empreiteiro, donoObra} = useUser();
  const { isOpen: isConfirmar, onOpen: onConfirmarOpen, onClose: onConfirmarClose } = useDisclosure();
  const { isOpen: isRejeitarModalOpen, onOpen: onRejeitarOpen, onClose: onRejeitarClose } = useDisclosure();
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
          response = await api.put(`/empreiteiro/${empreiteiro.id}/orcamento/${row.id}/compactuar`, {
            data_compactuacao: new Date().toISOString()
          });
          if (response && response.status === 200) {
            setOrcamentos((prevOrcamentos) =>
              prevOrcamentos.map((orcamento) =>
                orcamento.id === row.id
                  ? { ...orcamento, data_compactuacao: new Date().toISOString() }
                  : orcamento
              )
            );
          }
        } else if (donoObra) {
          response = await api.put(`/dono_obra/${donoObra.id}/orcamento/${row.id}/aprovar`, {
            data_aprovacao: new Date().toISOString()
          });
          if (response && response.status === 200) {
            setOrcamentos((prevOrcamentos) =>
              prevOrcamentos.map((orcamento) =>
                orcamento.id === row.id
                  ? { ...orcamento, data_aprovacao: new Date().toISOString() }
                  : orcamento
              )
            );
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
            let response;
            if (empreiteiro) {
              response = await api.get(`/empreiteiro/${empreiteiro.id}/orcamentos`);
            } else if (donoObra) {
              
              response = await api.get(`/dono_obra/${donoObra.id}/orcamentos`);
            }
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

    
    const getStatusIcon = (row) => {
      
      if (row.data_aprovacao===null && row.data_compactuacao===null && row.status!=='Reprovado'){
        return { status: "Em Análise", icon: IoMdClock, color: "blue.600" }
      }else if(row.data_aprovacao!==null && row.data_compactuacao===null && row.status!=='Reprovado'){
        return { status: "Esperando empreiteiro", icon: IoMdClock, color: "yellow.600"  }
      } else if(row.data_compactuacao!==null && row.data_aprovacao===null && row.status!=='Reprovado'){
        return { status: "Esperando dono da obra",  icon: IoMdClock, color: "yellow.600" }
      }else if(row.status==='Reprovado'){
        return { status: "Reprovado",  icon: MdCancel, color: "red" }
      }else{
        return {status: "Finalizado", icon: MdCheckCircle, color: "green" };
      }
      // switch (status) {
      //   case "Finalizado":
      //     return { icon: MdCheckCircle, color: "green" };
      //   case "Em Andamento":
      //     return { icon: IoMdHammer , color: "black" };
      //   case "Em Analise":
      //     return { icon: IoMdClock , color: "blue.600" };
      //   case "Pendente":
      //     return { icon: MdOutlineError , color: "yellow.600" };
      //   default:
      //     return null;
      // }
    };

    const handleViewPdf = (row) => {
      setSelectedRow(row);
      setPdfVisible(true);
    };

    
    return (
        <SimpleGrid  gap='20px' mb='20px' backgroundColor="white" borderRadius="20px" overflow="hidden">
        <TableContainer>
          <Table variant="striped" backgroundColor="#f0f3f5">
            <TableCaption>Registro de orçamentos</TableCaption>
            <Thead>
              <Tr>
                <Th>Dono da obra</Th>
                <Th>Data do orçamento</Th>
                <Th>Status</Th>
                <Th>Opções</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orcamentos.map((row, index) => {
                const { status, icon, color } = getStatusIcon(row);
                return (
                  <Tr key={index}>
                    <Td>{row.dono_obra.nome}</Td>
                    <Td>{new Date(row.data_criacao).toLocaleDateString('pt-BR')}</Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={icon} color={color} boxSize={6} />
                        <Text fontSize="sm" fontWeight="700" ml={2}>
                          {status}
                        </Text>
                      </Flex>
                    </Td>
                    <Td>
                    <IconButton
                      backgroundColor="#e8661e"
                      color="white"
                      aria-label="Visualizar"
                      icon={<IoMdEye />}
                      onClick={() => handleViewPdf(row)}
                      mr={1}
                    />
                    
                    {donoObra && !row.data_aprovacao && row.status !== 'Reprovado' && (
                      <>
                        <IconButton
                          backgroundColor="green"
                          color="white"
                          aria-label="Aprovar Orçamento"
                          icon={<MdCheckCircle />}
                          onClick={() => modalAprovarOrcamento(row)}
                          mr={1}
                        />
                        <IconButton
                          backgroundColor="#c51010"
                          color="white"
                          aria-label="Cancelar"
                          onClick={() => modalReprovarOrcamento(row)}
                          icon={<MdCancel />}
                        />
                      </>
                    )}

                    {empreiteiro && !row.data_compactuacao && row.status !== 'Reprovado' && (
                      <>
                        <IconButton
                          backgroundColor="green"
                          color="white"
                          aria-label="Compactuar Orçamento"
                          icon={<MdCheckCircle />}
                          onClick={() => modalAprovarOrcamento(row)}
                          mr={1}
                        />
                        <IconButton
                          backgroundColor="#c51010"
                          color="white"
                          aria-label="Cancelar"
                          icon={<MdCancel />}
                        />
                      </>
                    )}
                  </Td>

                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
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
            <Button 
              backgroundColor="#e8661e" 
              color="white" 
              _hover={{ backgroundColor: "#d45a1a" }} 
              onClick={()=>{handleAprovarOrcamento(selectedRow)}}
            >Confirmar
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
  