import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdMonetizationOn
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';


// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpEmpreiteiro from 'views/auth/signUp/SingUpEmpreiteiro';
import SingUpDonoObra from 'views/auth/signUp/SingUpDonoObra';
import Principal from 'views/auth/Principal/Index';
import Orcamento from 'views/admin/orcamento';

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
    name: 'Principal',
    layout: '/auth',
    path: '/principal',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Principal />,
  },
  {
    name: 'Orçamento',
    layout: '/admin',
    path: '/orcamento',
    icon: <Icon as={MdMonetizationOn} width="20px" height="20px" color="inherit" />,
    component: <Orcamento />,
  },
  // {
  //   name: 'RTL Admin',
  //   layout: '/rtl',
  //   path: '/rtl-default',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <RTL />,
  // },
];

export default routes;
