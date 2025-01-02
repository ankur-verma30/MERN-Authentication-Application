import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
 
  const inputRefs = useRef([]);

  // handle input change and move focus to next input field
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // handle key press to move focus to next input field or submit form
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  //paste functionality
  const handlePaste = (e) => {
    if (e.clipboardData.getData("text").length > 0) {
      const pastedValue = e.clipboardData.getData("text");
      const pasteArray = pastedValue.split("");
      pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      });
    }
  };

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const { backendURL } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  
  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${backendURL}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        data.success && setIsEmailSent(true);
        toast.success(" Reset Email send successfully ");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP=async(e)=>{
      e.preventDefault();
      const otpArray=inputRefs.current.map((e)=>e.value);
      const otp=otpArray.join('');
      setOtp(otp);
      setIsOtpSubmitted(true);
  }

  const onSubmitNewPassword = async(e)=>{
    e.preventDefault();
    try {
        const {data}=await axios.post(`${backendURL}/api/auth/reset-password`,{email,otp,newPassword})
        if(data.success) {
          toast.success("Password reset successfully");
          navigate("/login");
        }
        else{
          toast.error(data.message);
        }
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />
      {/* enter email id */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered Email Address
          </p>
          <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-4">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email Address"
              required
            />
          </div>
          <button className="w-full py-2.5 mt-1 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">
            Submit Email
          </button>
        </form>
      )}

      {/* OTP inptu form */}
      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Verify OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-Digit Code sent to your Email
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {
              // what does the underscore do in the map method ?? Refer to the docs
              Array(6)
                .fill()
                .map((_, index) => (
                  <input
                    key={index}
                    className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md px-2 "
                    type="text"
                    maxLength="1"
                    required
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))
            }
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">
            Verify OTP
          </button>
        </form>
      )}

      {/* Enter new Password */}
      {isEmailSent && isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Change Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter new password below
          </p>
          <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-4">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Enter new password"
              required
            />
          </div>
          <button className="w-full py-2.5 mt-1 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;  