
import React, { useEffect } from 'react';
import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import { MdBuild } from "react-icons/md";

const columnHelper = createColumnHelper();

export default function CheckTable(props) {
  const { tableData, nome, porcentagem, handleEditarAtividade } = props;
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const columns = [
    columnHelper.accessor('nome', {
      id: 'nome',
      header: () => <Text color="gray.400">Objetivo</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('progress', {
      id: 'progress',
      header: () => <Text color="gray.400">Porcentagem</Text>,
      cell: (info) => <Text color={textColor}>{porcentagem}%</Text>,
    }),
    columnHelper.accessor('data_termino', {
      id: 'data_termino',
      header: () => <Text color="gray.400">Prazo</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('opcoes', {
      id: 'opcoes',
      header: () => <Text color="gray.400">Opções</Text>,
      cell: (info) => (
        <IconButton
          backgroundColor="#2b6cb0"
          color="white"
          aria-label="Visualizar"
          icon={<MdBuild />}
          onClick={() => handleEditarAtividade(info.row.original)}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card w="100%">
      <Flex justifyContent="space-between" align="center" mb="8px" px="25px">
        <Text color={textColor} fontSize="22px" fontWeight="700">{nome}</Text>
      </Flex>
      <Box>
        <Table variant="simple">
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
