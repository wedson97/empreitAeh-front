
import React, {useState, useEffect} from "react";
import InputMask from 'react-input-mask';
import { FcGoogle } from "react-icons/fc";
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
  useToast,
} from "@chakra-ui/react";

import { auth } from '../../../firebase/firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail   } from 'firebase/auth';
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/empreitaehBranco.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import api from "api/requisicoes";
import { useNavigate } from 'react-router-dom';
import { useUser } from "context/UseContext";

function SignUpEmpreiteiro() {
  const navigate = useNavigate();
  const {setAlertaCadastro} = useUser();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);


  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleClick = () => setShow(!show);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    tipo_usuario: "empreiteiro"
  });
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const tipo_usuario = localStorage.getItem("tipo_usuario")
	  const id = localStorage.getItem("id")
    if (tipo_usuario !== null && id !== null) {
      navigate("/admin/default");
    }

    window.scrollTo(0, 0);
  }, []);
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      const response = await api.post("/empreiteiros",formData)
      setFormData({nome: '',cpf: '',cnpj: '',email: '',tipo_usuario: ''})
      toast({
        title: "Cadastrado com sucesso!",
        description: `O empreiteiro ${formData.nome} foi cadastro com sucesso!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        });
       await sendPasswordResetEmail(auth, formData.email);
      navigate("/auth/sign-in")
    } catch (error) {
      toast({
        title: "Erro no cadastro!",
        description:  `${error.response.data.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        });
    }
  }

  const handleGoogleSignUp = async () => {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        setFormData({
          ...formData,
          email: user.email,
          nome: user.displayName,
        });
        setStep(2); // Passa para a etapa de CPF/CNPJ
      } catch (error) {
        toast({
          title: "Erro ao cadastrar com Google!",
          description: `Ocorreu um erro: ${error.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
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
            Cadastrar Empreiteiro
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
          
          {/* Etapa de Google Sign Up */}
          {step === 1 && (
            <form>
              <FormControl>
                <Button
                  fontSize='sm'
                  variant='brand'
                  fontWeight='500'
                  backgroundColor={'white'}
                  w='100%'
                  h='50'
                  mb='24px'
                  isLoading={loading}
                  onClick={handleGoogleSignUp}
                >
                  <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
                  <p style={{color:"black"}}> Cadastrar com Google</p>
                 
                </Button>
              </FormControl>
            </form>
          )}

          {/* Etapa de CPF e CNPJ */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>CPF</FormLabel>
                <InputMask
                  mask="99999999999"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  name="cpf"
                  maskChar={null}
                  required
                >
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>CNPJ (opcional)</FormLabel>
                <InputMask
                  mask="99.999.999/9999-99"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  name="cnpj"
                  maskChar={null}
                >
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </FormControl>
              <Button
                mt={6}
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                backgroundColor={'white'}
                w='100%'
                h='50'
                type="submit"
              >
                Finalizar Cadastro
              </Button>
            </form>
          )}

        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUpEmpreiteiro;
