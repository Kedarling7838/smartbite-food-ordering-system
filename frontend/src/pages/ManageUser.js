import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const adminUser = localStorage.getItem("adminUser");
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/users/")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setAllUsers(data);
      });
  }, []);

  const handelSearch = (s) => {
    const keyword = s.toLowerCase();

    if (!keyword) {
      setUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (u) =>
          u.first_name.toLowerCase().includes(keyword) ||
          u.last_name.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword)
      );

      setUsers(filtered);
    }
  };

  const handelDelete = (id) => {
    if (window.confirm("Are you sure you want Delete")) {
      fetch(`http://127.0.0.1:8000/api/delete-users/${id}/`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message);
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid">
        <div
          className="card border-0 shadow-sm rounded-4 p-4"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div>
              <h3 className="fw-bold mb-1 text-dark">
                <i className="fas fa-users me-2 text-primary"></i>
                Users List
              </h3>
              <p className="text-muted mb-0">
                Manage registered users and export user data
              </p>
            </div>

            <div
              className="px-4 py-3 rounded-4 shadow-sm"
              style={{
                background: "#ffffff",
                border: "1px solid #e9ecef",
                minWidth: "180px",
              }}
            >
              <small className="text-muted d-block mb-1">
                <i className="fas fa-database me-1"></i>
                Total Users
              </small>
              <h4 className="mb-0 fw-bold text-success">
                {users.length}
              </h4>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div className="position-relative" style={{ width: "50%" }}>
              <input
                type="text"
                className="form-control ps-5 py-3 rounded-4 border-0 shadow-sm"
                placeholder="Search by name or email..."
                onChange={(e) => handelSearch(e.target.value)}
                style={{
                  background: "#ffffff",
                }}
              />
              <i
                className="fas fa-search position-absolute"
                style={{
                  left: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                }}
              ></i>
            </div>

            <CSVLink
              data={users}
              filename={"users_list.csv"}
              className="btn px-4 py-3 fw-semibold"
              style={{
                background:
                  "linear-gradient(135deg, #198754 0%, #157347 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
              }}
            >
              <i className="fas fa-file-csv me-2"></i>
              Export to CSV
            </CSVLink>
          </div>

          <div
            className="table-responsive rounded-4"
            style={{
              overflow: "hidden",
              border: "1px solid #edf2f7",
            }}
          >
            <table className="table align-middle mb-0">
              <thead
                style={{
                  background: "#111827",
                  color: "#ffffff",
                }}
              >
                <tr>
                  <th className="py-3 px-3">S.No</th>
                  <th className="py-3 px-3">First Name</th>
                  <th className="py-3 px-3">Last Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((u, index) => (
                    <tr
                      key={u.id}
                      style={{
                        background: "#ffffff",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <td className="px-3 fw-semibold">
                        #{index + 1}
                      </td>

                      <td className="px-3 fw-semibold text-dark">
                        {u.first_name}
                      </td>

                      <td className="px-3 text-dark">
                        {u.last_name}
                      </td>


                      <td className="px-3 text-muted">
                        {u.email}
                      </td>

                      <td className="px-3 text-center">
                        <button
                          onClick={() => handelDelete(u.id)}
                          className="btn btn-sm px-4 py-2 fw-semibold"
                          style={{
                            background:
                              "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                          }}
                        >
                          <i className="fas fa-trash-alt me-2"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5 text-muted"
                    >
                      <i className="fas fa-user-slash fa-2x mb-3 d-block"></i>
                      No Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUser;