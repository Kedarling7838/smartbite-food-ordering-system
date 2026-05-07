import React from "react";
import { FaBars, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import '../styles/admin.css';
const Adminheader=({toggleSidebar, sidebarOpen, newOrders})=>{
    const navigate = useNavigate();

    const handelLogout=()=>{
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
    }
    return (
        <nav className="navbar navbar-expand-lg navabr-light bg-white border-bottom px-3 shadow-sm">
            <button className="btn btn-outline-dark me-3" onClick={toggleSidebar}>
                { sidebarOpen ? <FaChevronLeft/>:<FaChevronLeft/>}
            </button>
            <span className="navbar-brand fw-semibold"><i className="fas fa-utensils me-2"></i>SmartBite</span>
            <button className="navbar-toggler">
                <FaBars/>
            </button>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto align-items-center gap-3">
                    <li className="nav-item">
                        <button className="btn btn-outline-success"
                        onClick={()=>{
                            if (newOrders>0){
                                navigate('/order-not-confirmed');
                            }
                        }}
                        title={newOrders > 0 ? "View New Orders":"No New Oders"}
                        >
                            <FaBell/>
                            <span className="badge bg-danger position-absolute mt-1">{newOrders}</span>
                        </button>
                    </li>
                    <li>
                         <button className="btn btn-outline-danger" onClick={handelLogout}>
                            <FaSignOutAlt  className="me-1"/>Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export default Adminheader;