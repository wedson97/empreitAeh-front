import {
  Box,
  Button,
  SimpleGrid,
} from "@chakra-ui/react"
import MiniCalendar from "components/calendar/MiniCalendar";
import React, { useEffect } from "react";
import ComplexTable from "views/admin/default/components/ComplexTable";
import {
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import { useUser } from "context/UseContext";
import { useNavigate } from "react-router-dom";
import CadastroEndereco from "./components/CadastrarEndereco";

export default function UserReports() {
  const { donoObra } = useUser();
  
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    const email = localStorage.getItem("email");
    const usuario = localStorage.getItem("usuario");
    
    if (email === null && usuario === null) {
      navigate("/");
    }
  }, []);
  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
    {donoObra !== null ? (
    donoObra?.endereco?.cidade === null &&
    donoObra?.endereco?.bairro === null &&
    donoObra?.endereco?.rua === null ? (
      <CadastroEndereco />
    ) : (
      <>
        <SimpleGrid>
          <ComplexTable
            columnsData={columnsDataComplex}
            tableData={tableDataComplex}
          />
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px"></SimpleGrid>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <MiniCalendar pt="50px" pl="60px" h="100%" minW="100%" selectRange={true} />
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px"></SimpleGrid>
        </SimpleGrid>
      </>
    )
  ) : (
    <>
      <SimpleGrid>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px"></SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <MiniCalendar pt="50px" pl="60px" h="100%" minW="100%" selectRange={true} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px"></SimpleGrid>
      </SimpleGrid>
        </>
      )}
    </Box>

  );
}
