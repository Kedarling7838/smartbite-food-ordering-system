import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBot from "../components/ChatBot";
import {
  FaKey,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const ChangePassword = () => {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
  }, []);

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passsword & Confirm Paassword do not match");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/change_password/${userId}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message || "Password Changed successfully");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
        <ChatBot/>
      <div
        className="min-vh-100 d-flex align-items-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)",
          padding: "30px 0",
        }}
      >
        <div className="container">
          <div className="row justify-content-center align-items-center g-5">
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <div
                      className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "#f8f9fa",
                        fontSize: "22px",
                      }}
                    >
                      <FaShieldAlt />
                    </div>

                    <h2 className="fw-bold mb-2 text-dark">
                      <FaKey className="me-2 text-primary" />
                      Change Password
                    </h2>
                    <p className="text-muted mb-0">
                      Keep your account secure with a strong password
                    </p>
                  </div>

                  <form onSubmit={handelSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Current Password
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white">
                          <FaLock />
                        </span>
                        <input
                          type={showCurrent ? "text" : "password"}
                          className="form-control"
                          name="currentPassword"
                          placeholder="Enter Current Password"
                          value={formData.currentPassword}
                          onChange={handelChange}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-white"
                          onClick={() => setShowCurrent(!showCurrent)}
                        >
                          {showCurrent ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        New Password
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white">
                          <FaLock />
                        </span>
                        <input
                          type={showNew ? "text" : "password"}
                          className="form-control"
                          name="newPassword"
                          placeholder="Enter New Password"
                          value={formData.newPassword}
                          onChange={handelChange}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-white"
                          onClick={() => setShowNew(!showNew)}
                        >
                          {showNew ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Confirm Password
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white">
                          <FaLock />
                        </span>
                        <input
                          type={showConfirm ? "text" : "password"}
                          className="form-control"
                          name="confirmPassword"
                          placeholder="Re-type new password"
                          value={formData.confirmPassword}
                          onChange={handelChange}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-white"
                          onClick={() => setShowConfirm(!showConfirm)}
                        >
                          {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-100 py-3 rounded-4 fw-bold"
                    >
                      <FaCheckCircle className="me-2" />
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="text-center">
                <img
                  src="/images/Login.png"
                  alt="security"
                  className="img-fluid"
                  style={{
                    maxWidth: "85%",
                    borderRadius: "24px",
                  }}
                />

                <div className="mt-4">
                  <h3 className="fw-bold">Safe • Secure • Protected</h3>
                  <p className="text-muted">
                    Your password protects your orders, payments and personal
                    account details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ChangePassword;
