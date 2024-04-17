import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import signup from "../assets/signup.jpg";
import showPwdImg from "../assets/show-password.svg";
import hidePwdImg from "../assets/hide-password.svg";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    contactValue: "",
  });
  const [errors, setErrors] = useState({});
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

  const validate = () => {
    let newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }
    if (!formData.contactValue) {
      newErrors.contactValue = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactValue)) {
      newErrors.contactValue = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const response = await fetch("http://localhost:3001/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("contactValue", formData.contactValue);
          navigate("/verify");
          console.log("Form submitted successfully!", formData);
        } else {
          console.error("Signup failed:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  };

  return (
    <div className="main poppins-bold ">
      <div className="img_div">
        <img src={signup} alt="sign" />
      </div>
      <div className="form_div">
        <form onSubmit={handleSubmit}>
          <div className="text">
            <p>
              <span className="text_heading">Let us know</span>
              <span className="text_exclaim">!</span>
            </p>
            <Link to="/login" className="text_signin">
              Sign <span className="text_In">In</span>
            </Link>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="First Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="error-message">{errors.lastName}</p>
            )}
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Set Password"
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
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Retype Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <img
              src={showPassword ? hidePwdImg : showPwdImg}
              alt={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              onClick={togglePasswordVisibility}
              style={{ width: "30px", height: "25px" }}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="form-group contact">
            <input
              type="text"
              name="contactmode"
              id="contactmode"
              placeholder="Contact Mode"
              disabled
            />
            <select
              name="contactMode"
              defaultValue="email"
              onChange={handleChange}
            >
              <option value="email">Email</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="contactValue"
              placeholder="Enter Email"
              value={formData.contactValue}
              onChange={handleChange}
            />
            {errors.contactValue && (
              <p className="error-message">{errors.contactValue}</p>
            )}
          </div>
          <button className="sub" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
