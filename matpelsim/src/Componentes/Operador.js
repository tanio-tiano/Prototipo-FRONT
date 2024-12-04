import React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid2,
  Container,
} from "@mui/material";

function Operador({ counters, labels, connectSocket, disconnectSocket }) {
  return (
    <Container
      maxWidth="sm" // Ajustar el tamaño del contenedor
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        backgroundColor: "#f6f0e1",
        padding: "10px",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        MatPelSim - Operador
      </Typography>

      {/* Botones de conexión */}
      <Box sx={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#66BB6A" }}
          onClick={connectSocket}
        >
          Connect
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#66BB6A" }}
          onClick={disconnectSocket}
        >
          Disconnect
        </Button>
      </Box>

      {/* Grid Layout para mostrar los contadores en 2 filas y 2 columnas */}
      <Grid2 container spacing={4} justifyContent="center">
        {Object.keys(counters).map((campo, index) => (
          <Grid2 item xs={6} sm={3} md={6} key={campo}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {labels[campo]} {/* Título personalizado */}
              </Typography>
              <Box
                sx={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  margin: "10px auto",
                  width: "100px",
                  backgroundColor: "#e3f2fd",
                }}
              >
                {counters[campo]}
              </Box>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default Operador;
