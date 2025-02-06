// CriarAccessToken.js
import { useEffect, useState } from "react";
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UseContext";

export const useMercadoPagoAccessToken = () => {
  const {accessToken, setAccessToken} = useUser();
  const navigate = useNavigate();

  initMercadoPago("APP_USR-0aff4f55-2fa2-4cc3-8ed7-49dc238ceadd");

  useEffect(() => {
    window.scrollTo(0, 0);
    const tipo_usuario = localStorage.getItem("tipo_usuario")
	  const id = localStorage.getItem("id")
    if (tipo_usuario === null && id === null) {
      navigate("/");
    }
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetchAccessToken(code);
    }
  }, [navigate]);

  const fetchAccessToken = async (authCode) => {
    try {
      const response = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: '3911354165422158',
          client_secret: "Yo6EmgbNj2IpyTeDqn8a2TF1xYNTqSVc",
          code: authCode,
          redirect_uri: 'https://empreit-aeh-front.vercel.app/admin/pagamentos',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${data.message}`);
      }
      console.log(data);
      
      setAccessToken(data.access_token);
      console.log("Access Token:", data.access_token);
    } catch (error) {
      console.error("Erro ao obter o access token:", error);
    }
  };

  return {
    handleConnect: () => {
      const clientId = '3911354165422158';
      const redirectUri = 'https://empreit-aeh-front.vercel.app/admin/pagamentos';
      const authUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&state=DocOAth&redirect_uri=${encodeURIComponent(redirectUri)}`;
      window.location.href = authUrl;
    },
  };
};
