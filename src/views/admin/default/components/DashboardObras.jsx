import {
    Box,
    Flex,
    Icon,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Stack,
    Divider,
    Badge
  } from '@chakra-ui/react';
  import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  import { useEffect, useState } from 'react';
  import { MdCheckCircle, MdDeliveryDining } from 'react-icons/md';
  import { IoMdEye } from "react-icons/io";
  import Card from 'components/card/Card';
  import api from 'api/requisicoes';
  import { useUser } from 'context/UseContext';
  import { useNavigate } from 'react-router-dom';
  import { format, parseISO, isValid } from "date-fns";
  import { ptBR } from "date-fns/locale";
  
  const columnHelper = createColumnHelper();
  
  export default function DashboardObras() {
    const { obras, setObras, empreiteiro, setEmpreiteiro, setDonoObra, donoObra } = useUser();
    const navigate = useNavigate();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const [sorting, setSorting] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen: isDetalhesOpen, onOpen: onDetalhesOpen, onClose: onDetalhesClose } = useDisclosure();
    const [selectedObra, setSelectedObra] = useState(null);
  
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-";
    };
  
    const handleViewDetails = (obra) => {
      setSelectedObra(obra);
      onDetalhesOpen();
    };
  
    useEffect(() => {
      const consultaTipo = () => {
        const token = localStorage.getItem("token");
        const userType = localStorage.getItem("tipo_usuario");
        
        if (userType === "empreiteiro") {
          setEmpreiteiro(userType);
          setDonoObra(null);
        } else {
          setEmpreiteiro(null);
          setDonoObra(userType);
        }
      };
  
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          let response;
          const userType = localStorage.getItem("tipo_usuario")
          
          if (userType === "empreiteiro") {
            response = await api.get(`/empreiteiro/obras`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } else {
            response = await api.get(`/dono_obra/obras`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
  
          if (response) {
            setObras(response.data);
          }
        } catch (error) {
          console.error("Erro ao buscar obras:", error);
        } finally {
          setLoading(false);
        }
      };
  
      consultaTipo();
      fetchData();
    }, [setDonoObra, setEmpreiteiro, empreiteiro, donoObra, setObras]);
  
    const columns = [
      columnHelper.accessor('dono_obra.nome', {
        id: 'dono_obra.nome',
        header: () => (
          <Text fontSize="sm" color="gray.400">
            Dono da obra
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('data_inicio', {
        id: 'data_inicio',
        header: () => (
          <Text fontSize="sm" color="gray.400">
            Data de Início
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue() || 'Não iniciada'}
          </Text>
        ),
      }),
      columnHelper.accessor('data_entrega', {
        id: 'data_entrega',
        header: () => (
          <Text fontSize="sm" color="gray.400">
            Previsão de Término
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue() || 'Não definida'}
          </Text>
        ),
      }),
      columnHelper.accessor('id', {
        id: 'opcoes',
        header: () => (
          <Text fontSize="sm" color="gray.400">
            Opções
          </Text>
        ),
        cell: (info) => {
          const obra = info.row.original;
          const temDataInicio = !!obra.data_inicio;
          const temDataEntrega = !!obra.data_entrega;
  
          return (
            <Flex gap="2">
              {
                <>
                  <IconButton
                    size="sm"
                    colorScheme="blue"
                    aria-label="Visualizar detalhes"
                    icon={<IoMdEye />}
                    onClick={() => handleViewDetails(obra)}
                  />
                </>
              }
            </Flex>
          );
        },
      }),
    ];
  
    const table = useReactTable({
      data: obras,
      columns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
  
    const handleAprovarObra = async (obraId) => {
      try {
        const token = localStorage.getItem("token");
        await api.post(`/empreiteiro/obra/${obraId}/iniciar`, {
          data_inicio: new Date().toISOString().split('T')[0]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        setObras(obras.map(obra => 
          obra.id === obraId ? { ...obra, data_inicio: new Date().toISOString() } : obra
        ));
      } catch (error) {
        console.error("Erro ao aprovar obra:", error);
      }
    };
  
    const handleEntregarObra = async (obraId) => {
      try {
        const token = localStorage.getItem("token");
        await api.post(`/empreiteiro/obra/${obraId}/entregar`, {
          data_entrega: new Date().toISOString().split('T')[0]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        setObras(obras.map(obra => 
          obra.id === obraId ? { ...obra, data_entrega: new Date().toISOString() } : obra
        ));
      } catch (error) {
        console.error("Erro ao entregar obra:", error);
      }
    };
  
    const ModalDetalhesObra = () => (
      <Modal isOpen={isDetalhesOpen} onClose={onDetalhesClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes da Obra</ModalHeader>
          <ModalBody>
            {selectedObra && (
              <Stack spacing={4}>
            
  
                <Stack direction="row" justify="space-between" flexWrap="wrap">
                  <Box>
                    <Text fontWeight="bold">Data Início:</Text>
                    <Text>{formatDate(selectedObra.data_inicio)}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Previsão Término:</Text>
                    <Text>{formatDate(selectedObra.data_entrega)}</Text>
                  </Box>
                </Stack>
  
                <Divider />
  
                <Stack>
                  <Text fontWeight="bold" fontSize="lg">Responsáveis</Text>
                  <Stack spacing={3}>
                    <Box>
                      <Text fontWeight="semibold">Dono da Obra:</Text>
                      <Text>{selectedObra.dono_obra?.nome}</Text>
                      <Text fontSize="sm" color="gray.600">
                        CPF: {selectedObra.dono_obra?.cpf}
                      </Text>
                    </Box>
                    
                    {selectedObra.empreiteiro && (
                      <Box>
                        <Text fontWeight="semibold">Empreiteiro:</Text>
                        <Text>{selectedObra.empreiteiro?.nome}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {selectedObra.empreiteiro?.cnpj || selectedObra.empreiteiro?.cpf}
                        </Text>
                      </Box>
                    )}
                  </Stack>
                </Stack>
  
                <Divider />
  
                <Stack>
                  <Text fontWeight="bold" fontSize="lg">Endereço</Text>
                  <Text>
                    {selectedObra.endereco?.rua}, {selectedObra.endereco?.numero}
                  </Text>
                  <Text>
                    {selectedObra.endereco?.bairro} - {selectedObra.endereco?.cidade}/{selectedObra.endereco?.uf}
                  </Text>
                  <Text>CEP: {selectedObra.endereco?.cep}</Text>
                </Stack>
  
                <Divider />
  
                <Stack>
                  <Text fontWeight="bold" fontSize="lg">Status</Text>
                  <Badge 
                    colorScheme={
                      !selectedObra.data_inicio ? 'red' :
                      selectedObra.data_entrega ? 'green' : 'orange'
                    }
                    fontSize="sm"
                    w="fit-content"
                  >
                    {
                      !selectedObra.data_inicio ? 'Não iniciada' :
                      selectedObra.data_entrega ? 'Finalizada' : 'Em andamento'
                    }
                  </Badge>
                </Stack>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onDetalhesClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text fontSize="22px" fontWeight="700" color={textColor}>
            Resumo de Obras
          </Text>
        </Flex>
  
        <Box>
          {loading ? (
            <Text p={4} textAlign="center">Carregando obras...</Text>
          ) : (
            <Table variant="simple" color="gray.500">
              <Thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <Th
                        key={header.id}
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex align="center" fontSize="sm" color="gray.400">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Flex>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <Td
                          key={cell.id}
                          fontSize="sm"
                          borderColor={borderColor}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={columns.length} textAlign="center">
                      Nenhuma obra encontrada
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </Box>
        
        <ModalDetalhesObra />
      </Card>
    );
  }