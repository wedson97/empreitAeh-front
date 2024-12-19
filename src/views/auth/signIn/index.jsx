
import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import {
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
  useToast,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/empreitaehBranco.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import api from "api/requisicoes";
import { useUser } from "context/UseContext";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
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
  const navigate = useNavigate();
  const {setDonoObra, setEmpreiteiro, editarPerfil, setEditarPerfil} = useUser();
  
  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    const email = localStorage.getItem("email");

    if (usuario !== null && email !== null) {
      navigate("/admin/default");
    }

    window.scrollTo(0, 0);
  }, []);
  
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
 
  const [formData, setFormData] = useState({
    email: '',
    senha: ' '
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const toast = useToast();
 
  const handleSubmit = async (user) => {
    const data = new FormData();
    data.append('email', formData.email);
    data.append('senha', formData.senha);
    console.log(formData);
    
    try {

      const response = await api.post("/login",{email:user.email, senha:" "})
      if(response.status===200){
        
        if (response.data.tipo_usuario.id === 3) {
          setEmpreiteiro(response.data);
          localStorage.setItem("userType", "empreiteiro");
        } else if (response.data.tipo_usuario.id === 2) {
          setDonoObra(response.data);
          localStorage.setItem("userType", "dono_obra");
        }
        
        setFormData({email: '',senha: ''})
        navigate("/admin/default")
        localStorage.setItem("id",response.data.id)
        localStorage.setItem("email",response.data.email)
        localStorage.setItem("usuario", response.data.nome)
        if(response.data.tipo_usuario.id === 2 && response.data.endereco.cidade===null && response.data.endereco.bairro===null && response.data.endereco.rua===null){
          // navigate("/admin/perfil")
          // setEditarPerfil(true)
          // toast({
          //   title: "Completar cadastro",
          //   description: `Para utilizar todas as funcionalidades do sistema, cadastre seu endereço atual!`,
          //   status: "success",
          //   duration: 6000,
          //   isClosable: true,
          //   });
        }
        
      }else{
        toast({
          title: "Falha no login",
          description: `Verifique suas credenciais!`,
          status: "error",
          duration: 3000,
          isClosable: true,
          });
      }
    } catch (AxiosError) {
      toast({
        title: "Falha no login",
        description: `Verifique suas credenciais!`,
        status: "error",
        duration: 3000,
        isClosable: true,
        });
    }
  }
const handleGoogleSignUp = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      handleSubmit(user)
    } catch (error) {
      toast({
        title: "Erro ao entrar com Google!",
        description: `Ocorreu um erro: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
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
        mt={{ base: "1px", md: "1vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Coloque seu email e sua senha!
          </Text>
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
          <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
            onClick={handleGoogleSignUp}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Entrar com o Google
          </Button>
          <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex>
          <FormControl>
          <form onSubmit={handleSubmit}>
          
          <FormControl>
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
              fontSize='sm'
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@simmmple.com'
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
            <InputGroup>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 caracteres'
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
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
          </FormControl>
          
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  me='10px'
                  sx={{
                    "& .chakra-checkbox__control[data-checked]": {
                      bg: "#e8661e",
                      borderColor: "#e8661e",
                    },
                  }}
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Continuar logado
                </FormLabel>
              </FormControl>
              <NavLink to='/auth/forgot-password'>
                <Text
                  color={'#e8661e'}
                  fontSize='sm'
                  w='134px'
                  fontWeight='300'>
                  Esqueceu sua senha?
                </Text>
              </NavLink>
            </Flex>
            <Button
              fontSize='sm'
              variant='brand'
              backgroundColor={'#e8661e'}
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              type="submit"
              >
              Entrar
            </Button>
            </form>
          </FormControl>
          
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
