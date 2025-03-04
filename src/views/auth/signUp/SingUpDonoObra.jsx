import React, { useState, useEffect } from "react";
import InputMask from 'react-input-mask';
import { FcGoogle } from "react-icons/fc";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/empreitaehBranco.png";
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail   } from 'firebase/auth';
import api from "api/requisicoes";

function SignUpDonoObra() {
  const textColor = useColorModeValue("navy.700", "white");
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    id_endereco:'',
    id_tipo_usuario: "dono_obra"
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/donos_obra", formData);
      if (response.status === 201) {
        toast({
          title: "Cadastrado com sucesso!",
          description: `O dono de obra ${formData.nome} foi cadastrado com sucesso!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
          await sendPasswordResetEmail(auth, formData.email);
        
        navigate("/auth/sign-in");
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar!",
        description: `${error.response.data.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

export default SignUpDonoObra;
