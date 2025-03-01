import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
  MdLock,
  MdMonetizationOn,
  MdConstruction,
  MdEngineering
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';
import Orcamento from 'views/admin/orcamento';
import Obra from 'views/admin/obra';
import Funcionario from 'views/admin/funcionario/orcamento';
import Pagamentos from 'views/admin/financeiro';


// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpEmpreiteiro from 'views/auth/signUp/SingUpEmpreiteiro';
import SingUpDonoObra from 'views/auth/signUp/SingUpDonoObra';
import Principal from 'views/auth/Principal/Index';
import Fornecedor from 'views/admin/fornecedor';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Perfil',
    layout: '/admin',
    path: '/perfil',

    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'Sign up',
    layout: '/auth',
    path: '/sign-up/empreiteiro',
    component: <SignUpEmpreiteiro />,
  },
  {
    name: 'Sign up',
    layout: '/auth',
    path: '/sign-up/donoObra',
    component: <SingUpDonoObra />,
  },
  {
    name: 'Orçamento',
    layout: '/admin',
    path: '/orcamento',
    icon: <Icon as={MdMonetizationOn} width="20px" height="20px" color="inherit" />,
    component: <Orcamento />,
  },
  {
    name: 'Obras',
    layout: '/admin',
    path: '/obras',
    icon: <Icon as={MdConstruction} width="20px" height="20px" color="inherit" />,
    component: <Obra />,
  }
  ,
  {
    name: 'Funcionário',
    layout: '/admin',
    path: '/funcionario',
    icon: <Icon as={MdEngineering} width="20px" height="20px" color="inherit" />,
    component: <Funcionario />,
  },{
    name: 'Fornecedor',
    layout: '/admin',
    path: '/fornecedor',
    icon: <Icon as={MdEngineering} width="20px" height="20px" color="inherit" />,
    component: <Fornecedor />,
  },
  
  // {
  //   name: 'Pagamentos',
  //   layout: '/admin',
  //   path: '/pagamentos',
  //   icon: <Icon as={MdMonetizationOn} width="20px" height="20px" color="inherit" />,
  //   component: <Pagamentos />,
  // },
  // {
  //   name: 'RTL Admin',
  //   layout: '/rtl',
  //   path: '/rtl-default',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <RTL />,
  // },
];

export default routes;
