
import { Box, Button, Grid } from "@chakra-ui/react";
import Banner from "views/admin/profile/components/Banner";
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarPerfil from "./components/EditarPerfil";
import { useUser } from "context/UseContext";
import CadastroEndereco from "../default/components/CadastrarEndereco";

export default function Overview() {
  const [editarPerfil, setEditarPerfil] = useState(false);
  const tipo_usuario = localStorage.getItem("tipo_usuario")
	const id = localStorage.getItem("id")
  const name = localStorage.getItem("nome")
  const getTipoUsuario = () => {
    if (tipo_usuario === "dono_obra") {
      return "Dono de obra";
    } else if (tipo_usuario === "empreiteiro") {
      return "Empreiteiro";
    }
  };

  const handleToggleEditarPerfil = () => {
    setEditarPerfil((prev) => !prev);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Button
        mb={4}
        backgroundColor={"#e8661e"}
        color={"white"}
        onClick={handleToggleEditarPerfil}
      >
        {editarPerfil ? "Voltar" : "Editar Perfil"}
      </Button>
      {editarPerfil ? (
        <EditarPerfil handleToggleEditarPerfil={handleToggleEditarPerfil}/>
        // <CadastroEndereco/>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1fr",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "1fr",
          }}
          justifyContent="center"
          alignItems="center"
          gap={{ base: "20px", xl: "20px" }}
        >
          <Banner
            gridArea="1 / 1 / 2 / 2"
            banner={banner}
            avatar={avatar}
            name={name}
            job={getTipoUsuario()}
          />
        </Grid>
      )}
    </Box>
  );
}
