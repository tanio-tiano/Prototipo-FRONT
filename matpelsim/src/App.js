import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { io } from "socket.io-client";

function App() {
  // Estado con valores de los contadores
  const [counters, setCounters] = useState({
    comb: 0,
    h2s: 0,
    o2: 0,
    co: 0,
  });

  // Nombres personalizados para cada campo
  const labels = {
    comb: "COMB/EX (%)",
    h2s: "H2S (ppm)",
    o2: "O2 (%)",
    co: "CO (ppm)",
  };

  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    if (!socket) {
      const newSocket = io("http://localhost:3002", {
        transports: ["websocket"], // Ensures WebSocket is used
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
      socket.emit("parameter", counters); // Emit event with counters
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
      sendParameters(); // Send updated values
      return updatedCounters;
    });
  };

  const decrement = (campo) => {
    setCounters((prev) => {
      const updatedCounters = {
        ...prev,
        [campo]: prev[campo] > 0 ? prev[campo] - 1 : 0,
      };
      sendParameters(); // Send updated values
      return updatedCounters;
    });
  };

  const resetCounters = () => {
    const resetValues = {
      comb: 0,
      h2s: 0,
      o2: 20.8, // Fixed value for o2
      co: 0,
    };
    setCounters(resetValues);
    if (socket && socket.connected) {
      socket.emit("parameter", resetValues); // Emit event with reset values
    }
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

      {/* Connect and Disconnect Buttons */}
      <Box sx={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={connectSocket}
        >
          Connect
        </Button>
        <Button variant="contained" color="secondary" onClick={disconnectSocket}>
          Disconnect
        </Button>
        <Button variant="contained" color="warning" onClick={resetCounters}>
          Reset
        </Button>
      </Box>

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
