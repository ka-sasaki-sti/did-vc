import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material";

export const Issue: React.FC = () => {
  const [hodlerAddress, setHolderAddress] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [vc, setVc] = useState("");

  const handleHolderAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHolderAddress(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSumit = async () => {
    const res = await axios.post("http://localhost:3000/issueVc", {
      hodlerAddress,
      type,
      name,
    });
    setVc(res.data);
  };

  const Container = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  });

  return (
    <Container>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <h1>VC発行</h1>
          <Box sx={{ width: 500, maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="VC送信先アドレス"
              id="fullWidth"
              onChange={handleHolderAddressChange}
            />
            <TextField
              fullWidth
              label="学類"
              id="fullWidth"
              onChange={handleTypeChange}
            />
            <TextField
              fullWidth
              label="学位"
              id="fullWidth"
              onChange={handleNameChange}
            />
            <Button onClick={handleSumit} variant="contained">
              送信
            </Button>
          </Box>
          <h2>発行されたVC</h2>
          <Typography>{vc}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};
