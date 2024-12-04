import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

function App() {
  // Estado con valores de los contadores
  const [counters, setCounters] = useState({
    campo1: 0,
    campo2: 0,
    campo3: 0,
    campo4: 0,
  });

  // Nombres personalizados para cada campo
  const labels = {
    campo1: "COMB/EX (%)",
    campo2: "H2S (ppm)",
    campo3: "O2 (%)",
    campo4: "CO (ppm)",
  };

  const increment = (campo) => {
    setCounters((prev) => ({
      ...prev,
      [campo]: prev[campo] + 1,
    }));
  };

  const decrement = (campo) => {
    setCounters((prev) => ({
      ...prev,
      [campo]: prev[campo] > 0 ? prev[campo] - 1 : 0,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        MatPelSim
      </Typography>

      {Object.keys(counters).map((campo) => (
        <Paper
          key={campo}
          elevation={3}
          sx={{
            width: "300px",
            padding: "20px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {labels[campo]} {/* Usar el título personalizado */}
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
          <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => increment(campo)}
            >
              +
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => decrement(campo)}
            >
              -
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default App;
