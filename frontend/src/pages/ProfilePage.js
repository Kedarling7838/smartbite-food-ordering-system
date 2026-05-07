import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSave,
  FaShieldAlt,
} from "react-icons/fa";
import ChatBot from "../components/ChatBot";

const ProfilePage = () => {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobilenumber: "",
    reg_date: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/user/${userId}/`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
      });
  }, [userId]);

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/update/${userId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message || "Profile Updated successfully");
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
            <div className="col-lg-7">
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
                      <FaUserCircle className="me-2 text-primary" />
                      My Profile
                    </h2>
                    <p className="text-muted mb-0">
                      Manage your personal details and account information
                    </p>
                  </div>

                  <form onSubmit={handelSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          First Name
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaUser />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handelChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Last Name
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaUser />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handelChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaEnvelope />
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Mobile Number
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaPhone />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.mobile}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <label className="form-label fw-semibold">
                          Registration Date
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaCalendarAlt />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={new Date(formData.reg_date).toLocaleString()}
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-100 py-3 rounded-4 fw-bold mt-4"
                    >
                      <FaSave className="me-2" />
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="text-center">
                <img
                  src="/images/Login.png"
                  alt="profile"
                  className="img-fluid"
                  style={{
                    maxWidth: "85%",
                    borderRadius: "24px",
                  }}
                />

                <div className="mt-4">
                  <h3 className="fw-bold">Personal • Secure • Managed</h3>
                  <p className="text-muted">
                    Keep your account updated for a better ordering and delivery
                    experience.
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

export default ProfilePage;
