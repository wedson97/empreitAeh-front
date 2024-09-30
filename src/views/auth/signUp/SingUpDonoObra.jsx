

import React, {useState, useEffect} from "react";
import InputMask from 'react-input-mask';
import {
  Box,
  Button,
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
  useToast,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/empreitaehBranco.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import api from "api/requisicoes";
import { useNavigate } from 'react-router-dom';

function SingUpDonoObra() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnpj: null,
    email: '',
    senha: '',
    id_tipo_usuario: 2
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    const email = localStorage.getItem("email");

    if (usuario !== null && email !== null) {
      navigate("/admin/default");
    }

    window.scrollTo(0, 0);
  }, []);
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/donos_obra", formData);
      if (response.status === 201) {
        setFormData({ nome: '', cpf: '', cnpj: '', email: '', senha: '', tipo: '' });
        toast({
          title: "Cadastrado com sucesso!",
          description: `O dono de obra ${formData.nome} foi cadastrado com sucesso!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/auth/sign-in");
      }
    } catch (error) {
      console.error("Erro ao cadastrar o dono de obra:", error);
      toast({
        title: "Erro ao cadastrar!",
        description: `${error.response.data.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

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
        
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Cadastrar Dono de obra
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
            <InputMask
              mask="999.999.999-99"
              value={formData.cpf}
              onChange={handleInputChange}
              maskChar={null}
            >
              {() => (
                <Input
                  isRequired={true}
                  variant='auth'
                  name="cpf"
                  fontSize='sm'
                  ms={{ base: "0px", md: "0px" }}
                  type='text'
                  placeholder='xxx.xxx.xxx-xx'
                  mb='24px'
                  fontWeight='500'
                  size='lg'
                />
              )}
            </InputMask>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              
              mb='8px'
            >
            
            CNPJ 
            <FormLabel display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              opacity={0.6}
              >(Opcional)
            </FormLabel>
          </FormLabel>
          <InputMask
              mask="99.999.999/9999-99"
              value={formData.cnpj}
              onChange={handleInputChange}
              maskChar={null}
            >
              {() => (
                <Input
                  variant='auth'
                  name="cnpj"
                  fontSize='sm'
                  ms={{ base: "0px", md: "0px" }}
                  type='text'
                  placeholder='xx.xxx.xxx/xxxx-xx'
                  mb='24px'
                  fontWeight='500'
                  size='lg'
                />
              )}
            </InputMask>
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
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              backgroundColor={'#e8661e'}
              w='100%'
              h='50'
              mb='24px'
              type="submit">
              Cadastrar
            </Button>
          </FormControl>
          </form>
          
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SingUpDonoObra;
