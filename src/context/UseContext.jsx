import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  //LOGIN
  const [login, setLogin] = useState({id:"",nome:"",email:"",cpf:"",cnpj:""})
  // ALERTA CADASTRO
  const [alertaCadastro, setAlertaCadastro] = useState({status:"", titulo:"", descricao:"", duracao:3000, visivel:false})
  // ALERTA ORCAMENTO
  const [alertaOrcamento, setAlertaOrcamento] = useState({status:"", titulo:"", descricao:"", duracao:3000, visivel:false})
  // ALERTA ORCAMENTO
  const [alertaObra, setAlertaObra] = useState({status:"", titulo:"", descricao:"", duracao:3000, visivel:false})
  // ORCAMENTO
  const [orcamentos, setOrcamentos] = useState([])
  // OBRAS
  const [obras, setObras] = useState([])
  // EMPREITEIRO
  const [empreiteiro, setEmpreiteiro] = useState([]);
  return (
    <UserContext.Provider value={{ login, setLogin, alertaCadastro, setAlertaCadastro, alertaOrcamento, setAlertaOrcamento,orcamentos, setOrcamentos, obras, setObras,empreiteiro, setEmpreiteiro, alertaObra, setAlertaObra }}>
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