import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import loginImage from "../assets/login.jpg";
import showPwdImg from "../assets/show-password.svg";
import hidePwdImg from "../assets/hide-password.svg";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://signup-email-otp-verification.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // If login is successful, navigate to the dashboard
        navigate("/dashboard");
        console.log("Logged in successfully!");
      } else {
        console.error("Login failed:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const signupHandler = () => {
    navigate("/");
  };

  return (
    <div className="main">
      <div className="img_div login_img">
        <img src={loginImage} alt="login" />
      </div>
      <div className="form_div">
        <form onSubmit={handleSubmit}>
          <div className="text">
            <p>
              <span className="text_heading">Fill what we know</span>
              <span className="text_exclaim">!</span>
            </p>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="contactValue"
              placeholder="email"
              value={formData.contactValue}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <img
              src={showPassword ? hidePwdImg : showPwdImg}
              alt={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              onClick={togglePasswordVisibility}
              style={{ width: "30px", height: "25px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button type="submit" className="signin-button">
              Sign In
            </button>
            <button
              onClick={signupHandler}
              type="button"
              className="signup-button"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
