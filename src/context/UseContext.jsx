import { useToast } from '@chakra-ui/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from 'api/requisicoes';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
// ORCAMENTO
  const [orcamentos, setOrcamentos] = useState([])
  // OBRAS
  const [obras, setObras] = useState([])
  
  // EMPREITEIRO
  const [empreiteiro, setEmpreiteiro] = useState(null);
  // DONO OBRA
  const [donoObra, setDonoObra] = useState(null);
  // FUNCIONARIOS
  const [funcionarios, setFuncionarios] = useState([]);
  // ACCESS_TOKEN
  const [accessToken, setAccessToken] = useState('APP_USR-3911354165422158-101610-aaf89ff52bdf9345a484843225ba4ea7-1929055828');
  //  PAGAMENTOS
  const [pagamentos, setPagamentos] = useState([]);
  

  const toast = useToast();
  useEffect(() => {
    const performLogin = async () => {
      const id = localStorage.getItem('id');
      const email = localStorage.getItem('email');
      const usuario = localStorage.getItem('usuario');
      const tipo_usuario = localStorage.getItem('userType');
      
      if (email && usuario) {
        try {
          if (tipo_usuario === "empreiteiro") {
            const response = await api.get("/empreiteiro/"+id);
            if (response.status === 200) {
              setEmpreiteiro(response.data);
              localStorage.setItem("userType", "empreiteiro");
             
            } else {
              toast({
                title: "Falha no login",
                description: "Verifique suas credenciais!",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          } else if (tipo_usuario === "dono_obra") {
            const response = await api.get("/dono_obra/"+id);
            if (response.status === 200) {
              setDonoObra(response.data);
              localStorage.setItem("userType", "dono_obra");
             
            } else {
              toast({
                title: "Falha no login",
                description: "Verifique suas credenciais!",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          }
          
          
        } catch (error) {
          toast({
            title: "Falha no login",
            description: "Verifique suas credenciais!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    performLogin();
  }, []);
  return (
    <UserContext.Provider value={{pagamentos, setPagamentos, accessToken, setAccessToken,orcamentos, setOrcamentos, obras, setObras,empreiteiro, setEmpreiteiro, donoObra, setDonoObra, funcionarios, setFuncionarios }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('Não foi possível inicializar o contexto do usuário');
  }
  return ctx;
};