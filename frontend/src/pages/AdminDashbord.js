import React, { useState, useEffect } from "react";
// import AdminSidebar from '../components/AdminSidebar';
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import '../styles/AdminDashboard.css';
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const adminUser = localStorage.getItem('adminUser');
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        total_orders: 0,
        new_orders: 0,
        confirmed: 0,
        food_preparing: 0,
        food_pickup: 0,
        food_delivered: 0,
        canceled_orders: 0,
        total_users: 0,
        total_categories: 0,
        today_sales: 0,
        week_sales: 0,
        month_sales: 0,
        year_sales: 0,
        total_reviews: 0,
        total_wishlists: 0,
    })
    const cardData = [
        { title: 'Total Orders', key: 'total_orders', color: 'primary', icon: 'fas fa-shopping-cart' },
        { title: 'New Orders', key: 'new_orders', color: 'info', icon: 'fas fa-shopping-cart' },
        { title: 'Confirmed Orders', key: 'confirmed', color: 'secondary', icon: 'fas fa-check-circle' },
        { title: 'Food Being Prepared', key: 'food_preparing', color: 'primary', icon: 'fas fa-utensils' },
        { title: 'Food Pickup', key: 'food_pickup', color: 'info', icon: 'fas fa-motorcycle' },
        { title: 'Food Delivered', key: 'food_delivered', color: 'secondary', icon: 'fas fa-truck' },
        { title: 'Canceled Orders', key: 'canceled_orders', color: 'primary', icon: 'fas fa-times-circle' },
        { title: 'Total Users', key: 'total_users', color: 'info', icon: 'fas fa-users' },
        { title: "Today's Sales", key: 'today_sales', color: 'secondary', icon: 'fas fa-coins' },
        { title: "This Week's Sales", key: 'week_sales', color: 'primary', icon: 'fas fa-calendar-week' },
        { title: "This Month's Sales", key: 'month_sales', color: 'info', icon: 'fas fa-calendar-week' },
        { title: "This Year's Sales", key: 'year_sales', color: 'secondary', icon: 'fas fa-calendar' },
        { title: "Total Categories", key: 'total_categories', color: 'primary', icon: 'fas fa-list' },
        { title: "Total Wishlists", key: 'total_wishlists', color: 'info', icon: 'fas fa-heart' },
        { title: "Total Reviews", key: 'total_reviews', color: 'secondary', icon: 'fas fa-star' },



    ]
    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }
        fetch('http://127.0.0.1:8000/api/dashboard_metrics/')
            .then(res => res.json())
            .then(data => {
                setMetrics(data)
            })
    }, []);
    return (

        <AdminLayout>
            <div className="admin-dashboard-bg">
                <div className="row g-4">
                    {cardData.map((item, i) => (
                        <div className="col-md-3" key={i}>
                            <div className={`card card-hover text-white bg-${item.color}`}>
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="card-title">{item.title}</h5>
                                        <h2>{(item.title.includes('Sales')) ? `₹ ${metrics[item.key]}` : metrics[item.key]}</h2>
                                    </div>
                                    <i className={`${item.icon} fa-2x`}></i>
                                </div>
                            </div>
                        </div>

                    ))}


                    <div className="col-md-3  card-hover">
                        <div className={"card text-white bg-primary d-flex justify-content-between align-items-center p-2"}>

                            <i className="fas fa-concierge-bell fa-2x text-danger  mb-3"></i>
                            <p className="text-dark fw-bold text-center mb-0"><span className="text-danger">Food Ordering</span><br></br> <span className="text-danger">System</span></p>

                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="insightshub-card"
                        onClick={() => navigate("/admin/insightshub")}
                    >

                        <div className="insightshub-glow"></div>

                        <h2>🚀 InsightsHub</h2>

                        <p>
                            AI-powered analytics, ML predictions,
                            review intelligence & advanced insights
                        </p>

                        <button className="enter-btn">
                            Enter Intelligence Panel
                        </button>

                    </motion.div>




                </div>
            </div>

        </AdminLayout>

    )
}
export default AdminDashboard;