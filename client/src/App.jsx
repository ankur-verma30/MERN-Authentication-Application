import { Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import NotFound from "./pages/NotFound"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <div>
      <ToastContainer /> 
      <Routes>
        <Route path="https://mern-auth-api-rho.vercel.app/" element={<Home />} />
        <Route path="https://mern-auth-api-rho.vercel.app/login" element={<Login />} />
        <Route path="https://mern-auth-api-rho.vercel.app/email-verify" element={<EmailVerify />} />
        <Route path="https://mern-auth-api-rho.vercel.app/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
