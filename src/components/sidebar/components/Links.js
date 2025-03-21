
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useUser } from "context/UseContext";

export function SidebarLinks(props) {
  const {empreiteiro, setEmpreiteiro} = useUser();
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;

 const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight='bold'
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='18px'
              pb='12px'
              key={index}>
              {route.name}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        const tipo_usuario = localStorage.getItem("tipo_usuario");
        const id = localStorage.getItem("id");
        // Condição para mostrar a rota de funcionário apenas se empreiteiro for diferente de null
        if (route.name === "Funcionário" && tipo_usuario === 'dono_obra') {
          return null;
        }
        if (route.name === "Fornecedor" && tipo_usuario === 'dono_obra') {
          return null;
        }
  
        return (
          <>
            {route.icon && route.name !== "Sign In" && route.name !== "Principal" ? (
              <NavLink key={index} to={route.layout + route.path}>
                <Box>
                  <HStack
                    spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
                    py="5px"
                    ps="10px"
                  >
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box
                        color={
                          activeRoute(route.path.toLowerCase()) ? '#e8661e' : textColor
                        }
                        me="18px"
                      >
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase()) ? activeColor : textColor
                        }
                        fontWeight={
                          activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                        }
                      >
                        {route.name}
                      </Text>
                    </Flex>
                    <Box
                      h="36px"
                      w="4px"
                      bg={
                        activeRoute(route.path.toLowerCase()) ? '#e8661e' : "transparent"
                      }
                      borderRadius="5px"
                    />
                  </HStack>
                </Box>
              </NavLink>
            ) : null}
          </>
        );
      }
    });
  };
  
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
