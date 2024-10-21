import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Card, CardContent, styled } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export const VefiryVC: React.FC = () => {
  const [vc, setVc] = useState("");
  const [result, setResult] = useState(false);
  const handleVcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVc(e.target.value);
  };
  const handleSumit = async () => {
    const res = await axios.post("http://localhost:3000/verifyVc", {
      vc,
    });
    setResult(res.data);
  };

  const Container = styled("div")({
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    alignItems: "center",
  });
  return (
    <Container>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <h1>VC検証</h1>
          <Box sx={{ width: 500, maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="VC"
              id="fullWidth"
              onChange={handleVcChange}
            />
            <Button onClick={handleSumit} variant="contained">
              送信
            </Button>
          </Box>
          <h2>検証結果</h2>
          <p>{result ? "OK" : "NG"}</p>
        </CardContent>
      </Card>
    </Container>
  );
};
