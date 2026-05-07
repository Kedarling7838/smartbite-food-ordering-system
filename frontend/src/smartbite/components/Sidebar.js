import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaChartLine,
  FaBrain,
  FaExclamationTriangle,
  FaComments,
  FaStore,
  FaHome
} from "react-icons/fa";

const Sidebar = () => {

  return (

    <div className="smartbite-sidebar">

      <div className="sidebar-logo">

        <div className="logo-glow"></div>

        <h2>SmartBite</h2>

        <p>AI Intelligence Panel</p>

      </div>

      <div className="sidebar-links">

        <NavLink
          to="/admin/insightshub"
          className="sidebar-link"
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/insightshub/analytics"
          className="sidebar-link"
        >
          <FaChartLine />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/admin/insightshub/conflicts"
          className="sidebar-link"
        >
          <FaExclamationTriangle />
          <span>Conflict Detector</span>
        </NavLink>

        <NavLink
          to="/admin/insightshub/predictions"
          className="sidebar-link"
        >
          <FaBrain />
          <span>ML Predictions</span>
        </NavLink>

        <NavLink
          to="/admin/insightshub/reviews"
          className="sidebar-link"
        >
          <FaComments />
          <span>Review Intelligence</span>
        </NavLink>


      </div>

    </div>

  );

};

export default Sidebar;