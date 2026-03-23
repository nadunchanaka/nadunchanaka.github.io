import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../coponents/layout/MainLayout";
import Home from "../coponents/home/Home";
import Product from "../coponents/product/Product";
import Dashboard from "../coponents/dashBoard/NewDashBoard";
import Contact from "../coponents/contact/Contatct";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/ourProduc" element={<Product />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
