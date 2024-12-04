// src/components/TabsComponent.js
import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

const TabsComponent = ({ value, handleChange }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center", // Centra las pestañas horizontalmente
        marginBottom: "20px", // Espaciado inferior para que no toque el contenido de abajo
      }}
    >
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs">
        <Tab label="Instructor" />
        <Tab label="Operador" />
        {/* Agrega más pestañas si es necesario */}
      </Tabs>
    </Box>
  );
};

export default TabsComponent;
