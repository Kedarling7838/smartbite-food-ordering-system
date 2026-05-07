import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../styles/admin.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";
import "../styles/AdminDashboard.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handelLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://127.0.0.1:8000/api/admin-login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      toast.success(data.message);
      localStorage.setItem("adminUser", username);

      setTimeout(() => {
        window.location.href = "/admin-dashboard";
      }, 2000);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <PublicLayout>
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/images/adminbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "40px 15px",
        }}
      >
        <div className="container">
          <div className="row justify-content-center align-items-center g-4">
            <div className="col-lg-5 d-none d-lg-block text-white">
              <div className="pe-4">
                <div className="mb-4">
                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill fw-semibold">
                    Secure Admin Access
                  </span>
                </div>

                <h1 className="display-5 fw-bold mb-3">
                  Welcome Back,
                  <br />
                  Admin Panel
                </h1>

                <p className="lead text-light opacity-75 mb-4">
                  Manage orders, categories, customers, products and reports
                  from one powerful dashboard.
                </p>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-white text-dark rounded-circle p-3">
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">Protected Access</h6>
                      <small>Encrypted and secure admin authentication</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-md-8 col-sm-10">
              <div
                className="card border-0 shadow-lg rounded-4 overflow-hidden"
                style={{
                  backdropFilter: "blur(12px)",
                  background: "rgba(255,255,255,0.95)",
                }}
              >
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "70px",
                        height: "70px",
                        background: "#f8f9fa",
                        fontSize: "28px",
                      }}
                    >
                      <FaUser />
                    </div>

                    <h3 className="fw-bold mb-1">Admin Login</h3>
                    <p className="text-muted mb-0">
                      Sign in to continue to dashboard
                    </p>
                  </div>

                  <form onSubmit={handelLogin}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Username
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white">
                          <FaUser />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter admin username"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Password
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white">
                          <FaLock />
                        </span>

                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter admin password"
                          required
                        />

                        <button
                          type="button"
                          className="input-group-text bg-white border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-100 py-3 rounded-4 fw-bold"
                    >
                      <FaSignInAlt className="me-2" />
                      Login to Dashboard
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </PublicLayout>
  );
};

export default AdminLogin;
