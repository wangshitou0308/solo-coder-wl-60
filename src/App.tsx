import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import SpiceRack from "@/pages/SpiceRack";
import Knowledge from "@/pages/Knowledge";
import Records from "@/pages/Records";
import Shopping from "@/pages/Shopping";
import Inspiration from "@/pages/Inspiration";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/spice-rack" element={<SpiceRack />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/records" element={<Records />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/inspiration" element={<Inspiration />} />
      </Routes>
    </Router>
  );
}
