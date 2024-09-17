
import React, {useState, useEffect} from "react";
import InputMask from 'react-input-mask';
// Chakra imports
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
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/empreitaehBranco.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import api from "api/requisicoes";
import { useNavigate } from 'react-router-dom';
import AlertaCadastro from "../signIn/AlertaCadastro";
import { useUser } from "context/UseContext";

function SignUpEmpreiteiro() {
  const navigate = useNavigate();
  const {setAlertaCadastro} = useUser();
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
    tipo: 'empreiteiro'
  });
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    const email = localStorage.getItem("email");

    if (usuario !== null && email !== null) {
      navigate("/admin/default");
    }

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
    // const response = await api.post("/empreiteiros",formData)
    // if(response.status===200){
    //   setFormData({nome: '',cpf: '',cnpj: '',email: '',senha: '',tipo: ''})
    //   setAlertaCadastro({status:"success", titulo:"Cadastrado com sucesso!",descricao: `O ${formData.tipo} ${formData.nome} foi cadastro com sucesso!`, duracao:3000, visivel:true})
    //   setTimeout(() => {
    //     setAlertaCadastro(prev => ({ ...prev, visivel: false }));
    //   }, 3000);
    //   navigate("/auth/sign-in")
    // }
    try {
      const response = await api.post("/empreiteiros",formData)
      setFormData({nome: '',cpf: '',cnpj: '',email: '',senha: '',tipo: ''})
      setAlertaCadastro({status:"success", titulo:"Cadastrado com sucesso!",descricao: `O ${formData.tipo} ${formData.nome} foi cadastro com sucesso!`, duracao:3000, visivel:true})
      setTimeout(() => {
        setAlertaCadastro(prev => ({ ...prev, visivel: false }));
      }, 3000);
      navigate("/auth/sign-in")
    } catch (error) {
      console.log(error);
      setAlertaCadastro({status:"error", titulo:"Erro no cadastro!",descricao: `${error.response.data.message}`, duracao:3000, visivel:true})
      setTimeout(() => {
        setAlertaCadastro(prev => ({ ...prev, visivel: false }));
      }, 3000);
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
        
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Cadastrar empreiteiro
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
              maskChar={null} // Isso remove o caractere de máscara visível
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
              maskChar={null} // Isso remove o caractere de máscara visível
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
          <AlertaCadastro 
          />
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUpEmpreiteiro;
