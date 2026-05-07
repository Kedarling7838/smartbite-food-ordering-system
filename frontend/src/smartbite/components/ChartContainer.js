import React from "react";

import { motion } from "framer-motion";

const ChartContainer = ({
  title,
  children,
  height = "100%"
}) => {

  return (

    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      whileHover={{ y:-4 }}
      className="glass-card chart-container-card"
      style={{
        height:height
      }}
    >

      <div className="chart-container-header">

        <h4>
          {title}
        </h4>

      </div>

      <div className="chart-container-body">

        {children}

      </div>

    </motion.div>

  );

};

export default ChartContainer;