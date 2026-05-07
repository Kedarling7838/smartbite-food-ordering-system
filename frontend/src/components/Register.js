import React, { useState } from "react";
import PublicLayout from "./PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // password match check
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success(data.message || "Registered successfully");

        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

 return (
  <PublicLayout>
    <ToastContainer position="top-center" autoClose={2000} />

    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">

        {/* LEFT SIDE IMAGE (LIGHT STYLE) */}
        <div
          className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
          style={{
            backgroundImage: "url('/images/register.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Light overlay (not dark) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
            }}
          />

          {/* Quote */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "420px",
              padding: "20px",
            }}
          >
            <h2 className="fw-bold text-dark">
              Discover great food, faster than ever
            </h2>
            <p className="text-dark opacity-75 mt-2">
              Join thousands of food lovers and enjoy seamless ordering experience.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">

          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "30px",
            }}
          >

            <h3 className="fw-bold mb-2">Create Account</h3>
            <p className="text-muted mb-4">
              Start ordering your favorite food
            </p>

            <form onSubmit={handleSubmit}>

              {/* FIRST NAME */}
              <div className="mb-3">
                <input
                  type="text"
                  name="firstname"
                  className="form-control py-2"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* LAST NAME */}
              <div className="mb-3">
                <input
                  type="text"
                  name="lastname"
                  className="form-control py-2"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control py-2"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control py-2"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-3">
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control py-2"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                className="btn w-100"
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <FaUserPlus className="me-2" />
                Register
              </button>

            </form>

            {/* LOGIN LINK */}
            <p className="text-center mt-4">
              Already have an account?{" "}
              <span
                style={{ cursor: "pointer", fontWeight: "500" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
);
};

export default Register;