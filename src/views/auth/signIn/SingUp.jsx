/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, {useState, useEffect} from "react";
// Chakra imports
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Select
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/empreitaehBranco.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import api from "api/requisicoes";
import { useNavigate } from 'react-router-dom'; // Import do useNavigate
import AlertaCadastro from "./AlertaCadastro";

function SignUp() {

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    senha: '',
    tipo: ''
  });
  const [alertaCadastro, setAlertaCadastro] = useState({status:"", titulo:"", descricao:"", duracao:3000, visivel:false})
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('cpf', formData.cpf);
    data.append('cnpj', formData.cnpj);
    data.append('email', formData.email);
    data.append('senha', formData.senha);
    data.append('tipo', formData.tipo);
    if (formData.tipo==="empreiteiro"){
      const response = await api.post("/empreiteiros",formData)
      if(response.status==200){
        setFormData({nome: '',cpf: '',cnpj: '',email: '',senha: '',tipo: ''})
        setAlertaCadastro({status:"success", titulo:"Cadastrado com sucesso!",descricao: `O ${formData.tipo} ${formData.nome} foi cadastro com sucesso!`, duracao:3000, visivel:true})
        setTimeout(() => {
          setAlertaCadastro(prev => ({ ...prev, visivel: false }));
        }, 3000);
      }
      
    }
  
  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
    
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign Up
          </Heading>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <form onSubmit={handleSubmit}>
          <FormControl>
          <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Nome<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='text'
              name="nome"
              placeholder='Nome'
              value={formData.nome}
              onChange={handleInputChange}
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              CPF<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              value={formData.cpf}
              name="cpf"
              onChange={handleInputChange}
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='xxx.xxx.xxx-xx'
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              CNPJ
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              value={formData.cnpj}
              name="cnpj"
              onChange={handleInputChange}
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='xx.xxx.xxx/xxxx-xx.'
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              value={formData.email}
              name="email"
              onChange={handleInputChange}
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@mail.com'
              mb='24px'
              fontWeight='500'
              size='lg'
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Senha<Text color={brandStars}>*</Text>
            </FormLabel>
            
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                value={formData.senha}
                name="senha"
                onChange={handleInputChange}
                placeholder='Min. 8 caracteres'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Cliente  / Empreiteiro<Text color={brandStars}>*</Text>
            </FormLabel>
            <Select
              isRequired={true}
              variant='auth'
              fontSize='sm'
              value={formData.tipo}
              name="tipo"
              onChange={handleInputChange}
              ms={{ base: "0px", md: "0px" }}
              placeholder='Selecione'
              mb='24px'
              fontWeight='500'
              size='lg'
            >
              <option value='cliente'>Cliente</option>
              <option value='empreiteiro'>Empreiteiro</option>
            </Select>
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              type="submit">
              Cadastrar
            </Button>
          </FormControl>
          </form>
          <AlertaCadastro 
            status={alertaCadastro.status} 
            titulo={alertaCadastro.titulo}
            descricao={alertaCadastro.descricao} 
            duracao={alertaCadastro.duracao}
            visivel={alertaCadastro.visivel}
          />
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
