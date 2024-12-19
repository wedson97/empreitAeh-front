
import React, {useEffect} from "react";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import { useNavigate, Link } from 'react-router-dom';
import { Stack, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from "./img/logo.png"
import background from "./img/empreitaeh.png"

function Principal() {
  const textColor = useColorModeValue("white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  console.log("aq");
  
  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    const email = localStorage.getItem("email");

    if (usuario !== null && email !== null) {
      navigate("/admin/default");
    }

    window.scrollTo(0, 0);
  }, []);

  return (
    <>
     <Box bg="transparent" px={4} position="fixed" width="100%" zIndex="999">
  <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
    <Box fontWeight="bold" fontSize="xl">
      <Image boxSize="40px" src={logo} alt="Logo" mr={2} />
    </Box>

    <Flex alignItems={'center'} justifyContent="space-between" width="100%">
      {/* Links à esquerda com margem à esquerda */}
      <Flex ml={8}>
        <Stack direction={'row'} spacing={4} display={{ base: 'none', md: 'flex' }} color={"white"}>
          <Link
            href="#home"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.200', 'gray.700') }}
            to={"/auth/sign-up/donoObra"}
          >
            Quero construir
          </Link>
          <Link
            href="#home"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.200', 'gray.700') }}
            to={"/auth/sign-up/empreiteiro"}
          >
            Quero ser empreiteiro
          </Link>
        </Stack>
      </Flex>

      {/* Link à direita */}
      <Flex mr={4}>
        <Stack direction={'row'} spacing={4} display={{ base: 'none', md: 'flex' }} color={"white"}>
          <Link
            href="#home"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.200', 'gray.700') }}
            as={Link} to={"/auth/sign-in"}
          >
            Sign in
          </Link>
        </Stack>
      </Flex>

      <Button onClick={isOpen ? onClose : onOpen} display={{ md: 'none' }} ml={2} bg="transparent" color={"white"}>
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </Button>
    </Flex>
  </Flex>

  {isOpen ? (
    <Box pb={4} display={{ md: 'none' }}>
      <Stack as={'nav'} spacing={3} color={"white"}>
        <Link href="#home" onClick={onClose} to={"/auth/sign-up/empreiteiro"}>
          Quero ser empreiteiro
        </Link>
        <Link href="#home" onClick={onClose} to={"/auth/sign-up/donoObra"}>
          Quero construir
        </Link>
        <Link href="#home" onClick={onClose} to={"/auth/sign-in"} >
          Sing in
        </Link>
      </Stack>
    </Box>
  ) : null}
</Box>


    
    <Box
    position="relative"
    width="100vw"
    height="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    >

    <Box
        bgImage={`url(${background})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        width="100%"
        height="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="1"
    />

    <Box
        bg="rgba(0, 0, 0, 0.65)" 
        width="100%"
        height="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="2"
    />

        <Box
        position="relative"
        zIndex="3"
        p={8}
        borderRadius="md"
        width="100%"
        >
        <Heading 
            color={textColor} 
            ml={{ base: "20px", md: "100px" }}
            fontSize={{ base: "32px", md: "48px", lg: "72px" }} 
            mb="10px"
        >
            EmpreitAeh
        </Heading>
        <Text
            color={textColor} 
            fontSize={{ base: "16px", md: "20px", lg: "24px" }}
            ml={{ base: "20px", md: "100px" }}
            mb="10px"
        >
            Construindo Seus Sonhos
        </Text>
        </Box>

    </Box>
    </>
  );
}

export default Principal;
