import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import { useUser } from "context/UseContext";
import { Navigate, useNavigate } from "react-router-dom";
import CadastroEndereco from "../profile/components/CadastrarEndereco";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const { login, donoObra } = useUser();
  
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
      {donoObra?.endereco?.cidade === null && donoObra?.endereco?.bairro === null && donoObra?.endereco?.rua === null ? (
        <CadastroEndereco />
      ) : (
        <>
          {/* Componente de estatísticas ou conteúdo principal aqui */}
          {/* <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
                />
              }
              name="Earnings"
              value="$350.4"
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />}
                />
              }
              name="Spend this month"
              value="$642.39"
            />
            <MiniStatistics growth="+23%" name="Sales" value="$574.34" />
            <MiniStatistics
              endContent={
                <Flex me="-16px" mt="10px">
                  <FormLabel htmlFor="balance">
                    <Avatar src={Usa} />
                  </FormLabel>
                  <Select
                    id="balance"
                    variant="mini"
                    mt="5px"
                    me="0px"
                    defaultValue="usd"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gba">GBA</option>
                  </Select>
                </Flex>
              }
              name="Your balance"
              value="$1,000"
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                  icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
                />
              }
              name="New Tasks"
              value="154"
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />}
                />
              }
              name="Total Projects"
              value="2935"
            />
          </SimpleGrid> */}

          {/* CHART GRAFICO */}

          {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
            <TotalSpent />
            <WeeklyRevenue />
          </SimpleGrid> */}

          <SimpleGrid>
            <ComplexTable
              columnsData={columnsDataComplex}
              tableData={tableDataComplex}
            />
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
              {/* <Tasks />
              <MiniCalendar h="100%" minW="100%" selectRange={true} /> */}
            </SimpleGrid>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
            {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} /> */}
            <MiniCalendar pt="50px" pl="60px" h="100%" minW="100%" selectRange={true} />
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
              {/* <DailyTraffic />
              <PieCard /> */}
              {/* <Tasks /> */}
            </SimpleGrid>
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
