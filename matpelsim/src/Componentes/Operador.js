import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { io } from "socket.io-client";
import exposureAlarm from "./sounds/alarm.mp3"
import alarm from "./sounds/alarmExp.mp3"


function Operador({ labels }) {
  const [counters, setCounters] = useState({
    comb: 0,
    h2s: 0,
    o2: 0,
    co: 0,
  });

  const [socket, setSocket] = useState(null);
  const [alarms, setAlarms] = useState([]);

  // Initialize sounds for alarms
  const alarmSound = new Audio(exposureAlarm); // Replace with your sound file for "alarma de exposición"
  const criticalAlarmSound = new Audio(alarm); // Replace with your sound file for "alarma crítica"

  useEffect(() => {
    // Initialize WebSocket connection when component mounts
    const newSocket = io("http://172.20.10.10:3002", {
      transports: ["websocket"], // Enforce WebSocket transport
    });

    // Listen to "lectures" event
    newSocket.on("lectures", (data) => {
      console.log("Received lectures:", data);
      setCounters(data); // Update counters with received data
      checkAlarms(data); // Check for alarms
    });

    // Set the socket instance
    setSocket(newSocket);

    // Cleanup connection on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []); // Run only once on component mount

  const checkAlarms = (data) => {
    const newAlarms = [];

    // COMB/EX Levels
    if (data.comb >= 15 && data.comb < 20) {
      newAlarms.push("COMB/EX: Alarma de exposición");
      playAlarm("exposure"); // Play exposure alarm sound
    } else if (data.comb >= 20) {
      newAlarms.push("COMB/EX: Alarma crítica");
      playAlarm("critical"); // Play critical alarm sound
    }

    // O2 Levels
    if (data.o2 < 19.5) {
      newAlarms.push("Oxígeno bajo");
      playAlarm("exposure"); // Play exposure alarm sound
    }

    // H2S Levels
    if (data.h2s >= 5 && data.h2s < 10) {
      newAlarms.push("H2S: Alarma de exposición");
      playAlarm("exposure"); // Play exposure alarm sound
    } else if (data.h2s >= 10) {
      newAlarms.push("H2S: Alarma crítica");
      playAlarm("critical"); // Play critical alarm sound
    }

    // CO Levels
    if (data.co >= 5 && data.co < 10) {
      newAlarms.push("CO: Alarma de exposición");
      playAlarm("exposure"); // Play exposure alarm sound
    } else if (data.co >= 10) {
      newAlarms.push("CO: Alarma crítica");
      playAlarm("critical"); // Play critical alarm sound
    }

    setAlarms(newAlarms);
  };

  const playAlarm = (type) => {
    if (type === "critical") {
      criticalAlarmSound.play(); // Play critical alarm sound
    } else {
      alarmSound.play(); // Play exposure alarm sound
    }
  };

  const connectSocket = () => {
    if (!socket || socket.disconnected) {
      const newSocket = io("http://localhost:3002", {
        transports: ["websocket"],
      });

      newSocket.on("lectures", (data) => {
        console.log("Received lectures:", data);
        setCounters(data);
        checkAlarms(data);
      });

      setSocket(newSocket);
    } else {
      alert("Socket is already connected.");
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    } else {
      alert("Socket is not connected.");
    }
  };

  return (
    <Container
      maxWidth="sm"
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
        Operador
      </Typography>

      {/* Connection Buttons */}
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
          sx={{ backgroundColor: "#FF7043" }}
          onClick={disconnectSocket}
        >
          Disconnect
        </Button>
      </Box>

      {/* Alarm Messages */}
      {alarms.length > 0 && (
        <Box sx={{ marginBottom: "20px", width: "100%" }}>
          {alarms.map((alarm, index) => (
            <Alert key={index} severity="warning" sx={{ marginBottom: "10px" }}>
              {alarm}
            </Alert>
          ))}
        </Box>
      )}

      {/* Display counters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {Object.keys(counters).map((campo) => (
          <Paper
            key={campo}
            elevation={3}
            sx={{
              margin: "10px",
              padding: "20px",
              textAlign: "center",
              width: "150px",
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
          </Paper>
        ))}
      </Box>
    </Container>
  );
}

export default Operador;
