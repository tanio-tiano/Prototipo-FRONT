import React, { useState } from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import { io } from "socket.io-client";
import TabsComponent from "./Componentes/TabsComponent";
import Operador from "./Componentes/Operador";

function App() {
  const [counters, setCounters] = useState({
    comb: 0,
    h2s: 0,
    o2: 0,
    co: 0,
  });

  const labels = {
    comb: "COMB/EX (%)",
    h2s: "H2S (ppm)",
    o2: "O2 (%)",
    co: "CO (ppm)",
  };

  const [socket, setSocket] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const connectSocket = () => {
    if (!socket) {
      const newSocket = io("http://localhost:3002", {
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        alert("Socket.IO connected!");
        setSocket(newSocket);
      });

      newSocket.on("disconnect", () => {
        alert("Socket.IO disconnected!");
        setSocket(null);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        alert("Failed to connect to the server.");
      });
    } else {
      alert("Socket.IO is already connected.");
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
    } else {
      alert("Socket.IO is not connected.");
    }
  };

  const sendParameters = () => {
    if (socket && socket.connected) {
      socket.emit("parameter", counters);
    } else {
      alert("Socket.IO is not connected.");
    }
  };

  const increment = (campo) => {
    setCounters((prev) => {
      const updatedCounters = {
        ...prev,
        [campo]: prev[campo] + 1,
      };
      sendParameters();
      return updatedCounters;
    });
  };

  const decrement = (campo) => {
    setCounters((prev) => {
      const updatedCounters = {
        ...prev,
        [campo]: prev[campo] > 0 ? prev[campo] - 1 : 0,
      };
      sendParameters();
      return updatedCounters;
    });
  };

  const resetCounters = () => {
    const resetValues = {
      comb: 0,
      h2s: 0,
      o2: 20.8,
      co: 0,
    };
    setCounters(resetValues);
    if (socket && socket.connected) {
      socket.emit("parameter", resetValues);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        backgroundColor: "#f6f0e1",
        padding: "20px",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        SimHaz
      </Typography>
      <TabsComponent value={tabValue} handleChange={handleTabChange} />

      {tabValue === 0 && (
        <>
          <Box sx={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#D32F2F" }}
              onClick={connectSocket}
            >
              Connect
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#D32F2F" }}
              onClick={disconnectSocket}
            >
              Disconnect
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#D32F2F" }}
              onClick={resetCounters}
            >
              Reset
            </Button>
          </Box>

          {/* Grid Layout para mostrar los contadores en 2 filas, 2 columnas */}
          <Grid container spacing={3} justifyContent="center">
            {Object.keys(counters).map((campo) => (
              <Grid item xs={12} sm={6} md={3} key={campo}>
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
                    {labels[campo]}
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#F44336" }}
                      onClick={() => increment(campo)}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#FF8A80" }}
                      onClick={() => decrement(campo)}
                    >
                      -
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {tabValue === 1 && (
        <Typography variant="h5" component="h2" gutterBottom>
          <Operador
            counters={counters}
            labels={labels}
            connectSocket={connectSocket}
            disconnectSocket={disconnectSocket}
            resetCounters={resetCounters}
          />
        </Typography>
      )}
    </Box>
  );
}

export default App;
