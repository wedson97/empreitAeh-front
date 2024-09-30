import {
  Flex,
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
  Text
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { IoMdEye } from "react-icons/io";
import { useUser } from "context/UseContext";
import api from "api/requisicoes";
import InputMask from "react-input-mask";

export default function TabelaFuncionario() {
  const { funcionarios, setFuncionarios, empreiteiro } = useUser();
  console.log(empreiteiro);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (empreiteiro && empreiteiro.id) { // Verifique se `empreiteiro` e `empreiteiro.id` estão definidos
        const response = await api.get(`/empreiteiro/${empreiteiro.id}/funcionarios`);
        setFuncionarios(response.data);
      }
    };
    fetchData();
  }, [empreiteiro]); // Adicione `empreiteiro` como dependência para reiniciar o efeito quando mudar

  function formatarCPF(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  return (
    <SimpleGrid gap='20px' mb='20px' backgroundColor="white" borderRadius="20px" overflow="hidden">
      <TableContainer>
        <Table variant="striped" backgroundColor="#f0f3f5">
          <TableCaption>Registro de orçamentos</TableCaption>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>CPF</Th>
              <Th>Data de nascimento</Th>
            </Tr>
          </Thead>
          <Tbody>
            {funcionarios.map((funcionario) => (
              <Tr key={funcionario.id}> {/* Adicione a key aqui */}
                <Td>{funcionario.nome}</Td>
                <Td>{formatarCPF(funcionario.cpf)}</Td>
                <Td>{new Date(funcionario.data_nascimento).toLocaleDateString('pt-BR')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </SimpleGrid>
  );
}
