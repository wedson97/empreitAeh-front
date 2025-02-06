import {
  Box,
  Button,
  SimpleGrid,
} from "@chakra-ui/react"
import MiniCalendar from "components/calendar/MiniCalendar";
import React, { useEffect, useState } from "react";
import ComplexTable from "views/admin/default/components/ComplexTable";
import {
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import { useUser } from "context/UseContext";
import { useNavigate } from "react-router-dom";
import CadastroEndereco from "./components/CadastrarEndereco";
import { getAuth } from "firebase/auth";
import api from "api/requisicoes";

export default function UserReports() {
  const { donoObra } = useUser();
  const [temEndereco, setTemEndereco] = useState(false);
  const tipo_usuario = localStorage.getItem("tipo_usuario");
  const id = localStorage.getItem("id");
    
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (tipo_usuario === null && id === null) {
      navigate("/");
    }else{
      const fetchObras = async () => {
        try {
          if (tipo_usuario === 'dono_obra'){
            const response = await api.get(`/dono_obra/${id}/endereco`);
            if (response.status === 200){
              setTemEndereco(true)
            }
            
          }
        } catch (error) {
            console.error("Erro ao buscar as obras:", error);
        }
      }
      fetchObras()
    }
    
    
  }, []);
  console.log(temEndereco);
  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        {tipo_usuario === 'dono_obra' && temEndereco === false ? (
          <>
            <CadastroEndereco />
          </>
        ) : (
          <>
          {/* <SimpleGrid>
              <ComplexTable columnsData={columnsDataComplex} tableData={tableDataComplex} />
              <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px"></SimpleGrid>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
              <MiniCalendar pt="50px" pl="60px" h="100%" minW="100%" selectRange={true} />
              <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px"></SimpleGrid>
            </SimpleGrid> */}</>
          
        )}
      </Box>
  );
}
   {/* <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
    </Box>*/}

  
