import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Issue } from "./pages/Issue";
import { VefiryVC } from "./pages/Verify";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Issue />} />
        <Route path="/verify" element={<VefiryVC />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
