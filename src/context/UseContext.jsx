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
  const toast = useToast();
  useEffect(() => {
    const performLogin = async () => {
      const email = localStorage.getItem('email');
      const usuario = localStorage.getItem('usuario');
      const tipo_usuario = localStorage.getItem('userType');
      
      if (email && usuario) {
        try {
          if (tipo_usuario === "empreiteiro") {
            const response = await api.get("/empreiteiros");
            if (response.status === 200) {
              const filteredEmpreiteiros = response.data.filter(empreiteiro => 
                empreiteiro.nome === usuario && empreiteiro.email === email
              );
          
              if (filteredEmpreiteiros.length > 0) {
                setEmpreiteiro(filteredEmpreiteiros[0]);
                localStorage.setItem("userType", "empreiteiro");
              } else {
                toast({
                  title: "Empreiteiro não encontrado",
                  description: "Verifique suas credenciais!",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
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
            const response = await api.get("/donos_obra");
            if (response.status === 200) {
              const filteredDonoObra = response.data.filter(donoObra => 
                donoObra.nome === usuario && donoObra.email === email
              );
          
              if (filteredDonoObra.length > 0) {
                setDonoObra(filteredDonoObra[0]);
                localStorage.setItem("userType", "dono_obra");
              } else {
                toast({
                  title: "Dono de obra não encontrado",
                  description: "Verifique suas credenciais!",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
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

    performLogin(); // Chama a função de login
  }, []); // Adicione as dependências necessárias
  return (
    <UserContext.Provider value={{orcamentos, setOrcamentos, obras, setObras,empreiteiro, setEmpreiteiro, donoObra, setDonoObra, funcionarios, setFuncionarios }}>
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