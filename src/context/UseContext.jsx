import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  //LOGIN
  const [login, setLogin] = useState({id:"",nome:"",email:"",cpf:"",cnpj:""})
  // ALERTA CADASTRO
  const [alertaCadastro, setAlertaCadastro] = useState({status:"", titulo:"", descricao:"", duracao:3000, visivel:false})
  return (
    <UserContext.Provider value={{ login, setLogin, alertaCadastro, setAlertaCadastro }}>
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