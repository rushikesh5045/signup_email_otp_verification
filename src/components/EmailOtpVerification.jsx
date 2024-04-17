import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OtpVerification.css";

function EmailOtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const contactValue = localStorage.getItem("contactValue");

      if (!contactValue) {
        setError("Contact value not found in local storage");
        return;
      }

      const response = await fetch("http://localhost:3001/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactValue, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("OTP verified successfully!");

        navigate("/dashboard");
      } else {
        setError(data.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again later.");
    }
  };

  const handleResendOTP = async () => {
    try {
      const contactValue = localStorage.getItem("contactValue");

      if (!contactValue) {
        setError("Contact value not found in local storage");
        return;
      }

      const response = await fetch("http://localhost:3001/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactValue }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("OTP resent successfully!");
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 60000);
      } else {
        setError(data.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <div className="otp-verification-container">
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Verify OTP</button>
        <button
          type="button"
          className="resend-link"
          onClick={handleResendOTP}
          disabled={resendDisabled}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
}

export default EmailOtpVerification;
