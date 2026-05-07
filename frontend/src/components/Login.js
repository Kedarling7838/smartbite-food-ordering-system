import React, { useState, useEffect } from "react";
import PublicLayout from "./PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaUserPlus,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import API_BASE from "../api";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    emailcont: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.emailcont.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);
        setTimeout(() => navigate("/"), 1200);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch {
      toast.error("Server not reachable");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(`${API_BASE}/google-login/`, {
        token: response.credential,
      });

      if (res.status === 200) {
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("userName", res.data.userName);

        toast.success(`Welcome ${res.data.userName}`);
        setTimeout(() => navigate("/"), 1200);
      }
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer />

      <div
        className="container-fluid"
        style={{ minHeight: "calc(100vh - 70px)" }}
      >
        <div className="row" style={{ minHeight: "100%" }}>

          {/* LEFT SIDE */}
          <div
            className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
            style={{
              minHeight: "calc(103vh - 70px)",
              backgroundImage: "url('/images/Login.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              transform: `translateY(${offsetY * 0.2}px)`,
            }}
          >

            {/* DARK OVERLAY */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
              }}
            />

            {/* ANIMATED TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-white text-center px-4"
              style={{ zIndex: 2 }}
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="fw-bold mb-3"
              >
                Delicious food, delivered fast
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Fresh meals, quick delivery, and the best taste —
                all at your fingertips.
              </motion.p>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="col-md-6 d-flex align-items-center justify-content-center bg-light"
            style={{ minHeight: "calc(100vh - 70px)" }}
          >

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card border-0 shadow"
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "16px",
                padding: "30px",
                background: "#fff",
              }}
            >

              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted small">
                  Login to continue your food journey
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="small text-muted">Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaEnvelope />
                    </span>
                    <input
                      name="emailcont"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.emailcont}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small text-muted">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaLock />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn w-100 mb-3"
                  style={{
                    background: "#fc8019",
                    color: "#fff",
                    fontWeight: "600",
                    borderRadius: "10px",
                  }}
                >
                  <FaSignInAlt className="me-2" />
                  Login
                </motion.button>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 mb-3"
                  onClick={() => navigate("/register")}
                >
                  <FaUserPlus className="me-2" />
                  Create Account
                </button>

                <div className="text-center mb-2 text-muted">OR</div>

                <div className="d-flex justify-content-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                  />
                </div>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;