import React from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "../styles/smartbite.css";

const SmartbiteLayout = ({ children }) => {

  return (

    <div className="smartbite-layout">

      <div className="background-orb orb-1"></div>
      <div className="background-orb orb-2"></div>

      <Sidebar />

      <div className="smartbite-main">

        <Topbar />

        <div className="smartbite-content">

          {children}

        </div>

      </div>

    </div>

  );

};

export default SmartbiteLayout;