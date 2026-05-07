import React from "react";

import { motion } from "framer-motion";

const InsightCard = ({
  title,
  description,
  icon,
  color = "#4facfe"
}) => {

  return (

    <motion.div
      whileHover={{
        scale:1.03,
        y:-5
      }}
      className="insight-card reusable-insight-card"
      style={{
        border:`1px solid ${color}40`
      }}
    >

      <div
        className="insight-icon"
        style={{
          background:`${color}20`,
          color:color
        }}
      >

        {icon}

      </div>

      <div className="insight-content">

        <h5>
          {title}
        </h5>

        <p>
          {description}
        </p>

      </div>

      <div
        className="insight-glow"
        style={{
          background:color
        }}
      ></div>

    </motion.div>

  );

};

export default InsightCard;