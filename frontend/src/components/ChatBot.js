import React, {
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react';

import {
  motion,
  AnimatePresence
} from 'framer-motion';

import {
  FaRobot,
  FaPaperPlane,
  FaMicrophone,
  FaTimes,
  FaMoon,
  FaSun,
  FaShoppingCart,
  FaHome,
  FaHeart,
  FaUser,
  FaBell,
  FaVolumeUp,
  FaTrash,
  FaUtensils,
  FaSearch,
  FaStar,
  FaFire,
  FaClock,
  FaGift
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './ChatBot.css';

const API_URL = 'http://127.0.0.1:8000/api/chat/';

const quickQuestions = [
  'Show menu',
  'Suggest spicy food',
  'Cheap food',
  'Offers today',
  'Track order',
  'Healthy food',
  'Veg food',
  'Premium dishes'
];

const chatbotThemes = {
  dark: {
    background: '#0f172a',
    card: '#111827',
    text: '#ffffff'
  },
  light: {
    background: '#f8fafc',
    card: '#ffffff',
    text: '#111827'
  }
};

const ChatBot = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [voices, setVoices] = useState([]);
  const [listening, setListening] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [chatTitle, setChatTitle] = useState('SmartBite AI Assistant');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    userMessages: 0,
    botMessages: 0
  });

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentTheme = useMemo(() => {
    return darkMode
      ? chatbotThemes.dark
      : chatbotThemes.light;
  }, [darkMode]);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: '👋 Welcome to SmartBite Assistant. Ask me anything about food, offers, orders or delivery.',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    loadVoices();

    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, loading]);

  useEffect(() => {
    const total = messages.length;

    const userCount = messages.filter(
      m => m.sender === 'user'
    ).length;

    const botCount = messages.filter(
      m => m.sender === 'bot'
    ).length;

    setChatStats({
      totalMessages: total,
      userMessages: userCount,
      botMessages: botCount
    });
  }, [messages]);

  const speak = (text) => {
    if (!soundEnabled) return;

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    const femaleVoice =
      voices.find(v => v.name.includes('Zira')) ||
      voices.find(v => v.name.includes('Samantha')) ||
      voices.find(v => v.name.includes('Google UK English Female')) ||
      voices[0];

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1.2;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const fakeTypingEffect = async (text) => {
    setTypingText('');

    for (let i = 0; i < text.length; i++) {
      setTypingText(prev => prev + text.charAt(i));

      await new Promise(resolve =>
        setTimeout(resolve, 10)
      );
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async (customText = '') => {
    const finalMessage = customText || input;

    if (!finalMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: finalMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    addMessage(userMessage);

    setLoading(true);

    setInput('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: finalMessage
        })
      });

      const data = await response.json();

      await fakeTypingEffect(data.reply || '');

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || 'No response',
        items: data.items || [],
        timestamp: new Date().toLocaleTimeString()
      };

      addMessage(botMessage);

      speak(botMessage.text);

      if (notifications) {
        setUnreadCount(prev => prev + 1);
      }

      if (data.route) {
        setTimeout(() => {
          navigate(data.route);
        }, 1000);
      }

    } catch (error) {
      addMessage({
        id: Date.now(),
        sender: 'bot',
        text: '❌ Server error occurred.',
        timestamp: new Date().toLocaleTimeString()
      });
    }

    setLoading(false);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = false;

    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);

      sendMessage(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: '🧹 Chat cleared successfully.',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const renderMessage = (msg) => {
    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`message-wrapper ${msg.sender}`}
      >
        <div className={`chat-bubble ${msg.sender}`}>
          <div className="message-text">
            {msg.text}
          </div>

          {
            msg.items &&
            msg.items.length > 0 && (
              <ul className="food-list">
                {
                  msg.items.map((item, index) => (
                    <motion.li
                      whileHover={{ scale: 1.02 }}
                      key={index}
                      className="food-card"
                    >
                      <FaUtensils />
                      <span>{item}</span>
                    </motion.li>
                  ))
                }
              </ul>
            )
          }

          <div className="message-time">
            {msg.timestamp}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <motion.div
        className="advanced-chatbot-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
      >
        <FaRobot />

        {
          unreadCount > 0 && (
            <div className="notification-badge">
              {unreadCount}
            </div>
          )
        }
      </motion.div>

      <AnimatePresence>
        {
          open && (
            <motion.div
              className="advanced-chatbot-container"
              style={{
                background: currentTheme.card,
                color: currentTheme.text
              }}
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
            >
              <div className="chatbot-header">
                <div className="header-left">
                  <div className="bot-avatar">
                    <FaRobot />
                  </div>

                  <div>
                    <h5>{chatTitle}</h5>
                    <small>🟢 AI Online</small>
                  </div>
                </div>

                <div className="header-actions">
                  <button
                    className="icon-btn"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {
                      darkMode
                        ? <FaSun />
                        : <FaMoon />
                    }
                  </button>

                  <button
                    className="icon-btn"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    <FaVolumeUp />
                  </button>

                  <button
                    className="icon-btn"
                    onClick={clearChat}
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="icon-btn close-btn"
                    onClick={() => setOpen(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="chatbot-top-features">
                <div className="feature-chip">
                  <FaFire /> Trending
                </div>

                <div className="feature-chip">
                  <FaGift /> Offers
                </div>

                <div className="feature-chip">
                  <FaClock /> Fast Delivery
                </div>

                <div className="feature-chip">
                  <FaStar /> Premium
                </div>
              </div>

              {
                showSuggestions && (
                  <div className="quick-question-wrapper">
                    {
                      quickQuestions.map((question, index) => (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={index}
                          className="quick-question-btn"
                          onClick={() => sendMessage(question)}
                        >
                          {question}
                        </motion.button>
                      ))
                    }
                  </div>
                )
              }

              <div className="chatbot-body">
                {
                  messages.map(renderMessage)
                }

                {
                  loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="typing-indicator"
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </motion.div>
                  )
                }

                <div ref={chatEndRef}></div>
              </div>

              <div className="chatbot-footer">
                <div className="footer-top-actions">
                  <button onClick={() => navigate('/')}>
                    <FaHome />
                  </button>

                  <button onClick={() => navigate('/cart')}>
                    <FaShoppingCart />
                  </button>

                  <button onClick={() => navigate('/wishlist')}>
                    <FaHeart />
                  </button>

                  <button onClick={() => navigate('/login')}>
                    <FaUser />
                  </button>

                  <button>
                    <FaBell />
                  </button>
                </div>

                <div className="chatbot-input-area">
                  <button
                    className={`mic-btn ${listening ? 'active' : ''}`}
                    onClick={startVoiceRecognition}
                  >
                    <FaMicrophone />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    placeholder="Ask SmartBite anything..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        sendMessage();
                      }
                    }}
                  />

                  <button
                    className="search-btn"
                    onClick={() => setSearchMode(!searchMode)}
                  >
                    <FaSearch />
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="send-btn"
                    onClick={() => sendMessage()}
                  >
                    <FaPaperPlane />
                  </motion.button>
                </div>

                <div className="chatbot-stats">
                  <small>
                    Messages: {chatStats.totalMessages}
                  </small>

                  <small>
                    User: {chatStats.userMessages}
                  </small>

                  <small>
                    Bot: {chatStats.botMessages}
                  </small>
                </div>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </>
  );
};

// ====================== ADVANCED CONTEXT MEMORY ======================

const contextMemory = {
  lastCategory: '',
  lastFood: '',
  lastIntent: ''
};

const saveContext = (message) => {
  const text = message.toLowerCase();

  if (text.includes('pizza')) {
    contextMemory.lastFood = 'pizza';
  }

  if (text.includes('burger')) {
    contextMemory.lastFood = 'burger';
  }

  if (text.includes('spicy')) {
    contextMemory.lastCategory = 'spicy';
  }

  if (text.includes('cheap')) {
    contextMemory.lastCategory = 'cheap';
  }
};

// ====================== SMART AI TYPING EFFECT ======================

const streamBotMessage = async (text, callback) => {
  let current = '';

  for (let i = 0; i < text.length; i++) {
    current += text.charAt(i);

    callback(current);

    await new Promise(resolve => setTimeout(resolve, 15));
  }
};

// ====================== FOOD CARD UI ======================

const FoodCarousel = ({ items = [] }) => {
  return (
    <div className="food-carousel-wrapper">
      {
        items.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            key={index}
            className="advanced-food-card"
          >
            <div className="food-card-image">
              🍕
            </div>

            <div className="food-card-body">
              <h6>{item}</h6>

              <div className="food-card-rating">
                ⭐ 4.{Math.floor(Math.random() * 9)}
              </div>

              <button className="food-order-btn">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))
      }
    </div>
  );
};

// ====================== SMART AUTO SUGGESTIONS ======================

const smartSuggestions = [
  'Pizza',
  'Burger',
  'Dosa',
  'Veg Biryani',
  'Noodles',
  'Cheap food',
  'Offers',
  'Track Order'
];

const getSuggestions = (value) => {
  if (!value) return [];

  return smartSuggestions.filter(item =>
    item.toLowerCase().includes(value.toLowerCase())
  );
};

// ====================== ORDER TIMELINE ======================

const OrderTimeline = () => {
  return (
    <div className="order-timeline">
      <div className="timeline-step active">
        ✔ Order Placed
      </div>

      <div className="timeline-step active">
        👨‍🍳 Preparing
      </div>

      <div className="timeline-step">
        🚚 Out for Delivery
      </div>

      <div className="timeline-step">
        🏠 Delivered
      </div>
    </div>
  );
};

// ====================== AI ANALYTICS ======================

const analyticsData = {
  topFood: 'Pizza',
  activeUsers: 124,
  todayOrders: 78,
  trending: 'Burger Combo'
};

// ====================== SMART STATUS ======================

const aiStatuses = [
  '🤖 Understanding your request...',
  '🍕 Finding delicious foods...',
  '🔥 Checking trending items...',
  '🧠 SmartBite AI is thinking...'
];

export default ChatBot; 
