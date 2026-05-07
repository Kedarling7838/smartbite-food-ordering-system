import React, {
  useState,
  useEffect
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaSearch,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";

const Topbar = () => {

  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/smartbite/notifications/")
      .then((response) => {

        setNotifications(response.data);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);

  const handleSearch = async (value) => {

    setSearchQuery(value);

    if (value.trim() === "") {

      setSearchResults([]);

      return;

    }

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/api/smartbite/search/?query=${value}`
      );

      setSearchResults(response.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  const handleExit = () => {

    navigate("/admin-dashboard");

  };

  return (

    <div className="smartbite-topbar">

      <div className="topbar-left">

        <div className="search-box-wrapper">

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search users, foods, orders..."
              value={searchQuery}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
            />

          </div>

          {
            searchResults.length > 0 && (

              <div className="search-results-dropdown">

                {
                  searchResults.map((item, index) => (

                    <div
                      key={index}
                      className="search-result-item"
                    >

                      <strong>
                        {item.type}
                      </strong>

                      <span>
                        {item.name}
                      </span>

                    </div>

                  ))
                }

              </div>

            )
          }

        </div>

      </div>

      <div className="topbar-right">

        <div className="ai-badge">

          <FaRobot />

          <span>AI Active</span>

        </div>

        <div className="notification-wrapper">

          <div
            className="notification-box"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
          >

            <FaBell />

            <div className="notification-dot"></div>

          </div>

          {
            showNotifications && (

              <div className="notification-dropdown">

                <h5>
                  Live Notifications
                </h5>

                {
                  notifications.length > 0 ? (

                    notifications.map((item, index) => (

                      <div
                        key={index}
                        className="notification-item"
                      >

                        {item}

                      </div>

                    ))

                  ) : (

                    <div className="notification-item">

                      No notifications available

                    </div>

                  )
                }

              </div>

            )
          }

        </div>

        <button
          className="exit-smartbite-btn"
          onClick={() =>
            setShowExitConfirm(true)
          }
        >

          <FaSignOutAlt />

          Exit

        </button>

        <div className="admin-profile">

          <img
            src="/images/admin.jpg"
            alt="admin"
          />

          <div>

            <h6>
              Admin
            </h6>

            <small>
              SmartBite Manager
            </small>

          </div>

        </div>

      </div>

      {
        showExitConfirm && (

          <div className="exit-modal-overlay">

            <div className="exit-modal">

              <h3>
                Exit SmartBite?
              </h3>

              <p>
                Return back to Admin Dashboard?
              </p>

              <div className="exit-modal-buttons">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowExitConfirm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="confirm-btn"
                  onClick={handleExit}
                >
                  Yes Exit
                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

};

export default Topbar;