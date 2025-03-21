"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface WhatsAppWidgetProps {
  /**
   * WhatsApp phone number with country code (no spaces or special characters)
   */
  phoneNumber: string;
  
  /**
   * Pre-filled message for the WhatsApp chat
   */
  defaultMessage?: string;
  
  /**
   * Position of the widget on the screen
   */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  
  /**
   * Business or person name displayed in the chat header
   */
  businessName: string;
  
  /**
   * URL to the logo image displayed in the chat header
   */
  businessLogo?: string;
  
  /**
   * Primary color used for the widget (supports any valid CSS color)
   */
  primaryColor?: string;
  
  /**
   * Text for the welcome message shown in the chat bubble
   */
  welcomeMessage?: string;
  
  /**
   * Placeholder text for the message input field
   */
  inputPlaceholder?: string;
  
  /**
   * Control the initial open state of the widget
   */
  initiallyOpen?: boolean;
  
  /**
   * Optional classes to apply to the container element
   */
  className?: string;
  
  /**
   * Determines if the timestamp is shown in the welcome message
   */
  showTimestamp?: boolean;
}

export default function WhatsAppWidget({
  phoneNumber,
  defaultMessage = "",
  position = "bottom-right",
  businessName,
  businessLogo,
  primaryColor = "#25D366", // WhatsApp green by default
  welcomeMessage = "Hello! How can I help you today?",
  inputPlaceholder = "Type a message...",
  initiallyOpen = false,
  className = "",
  showTimestamp = true,
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [message, setMessage] = useState(defaultMessage);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Only initialize on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input field when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Only render client-side
  if (!mounted) return null;

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const positionClasses = {
    "bottom-right": "right-4 md:right-8 bottom-4 md:bottom-8",
    "bottom-left": "left-4 md:left-8 bottom-4 md:bottom-8",
    "top-right": "right-4 md:right-8 top-4 md:top-8",
    "top-left": "left-4 md:left-8 top-4 md:top-8",
  };
  
  const originPoint = {
    "bottom-right": "bottom right",
    "bottom-left": "bottom left",
    "top-right": "top right",
    "top-left": "top left",
  };

  // Animation variants
  const chatContainerVariants = {
    hidden: { 
      opacity: 0, 
      y: position.startsWith("top") ? -20 : 20, 
      scale: 0.95,
      transformOrigin: originPoint[position as keyof typeof originPoint]
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 20, 
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: position.startsWith("top") ? -15 : 15, 
      scale: 0.95, 
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const bubbleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.4,
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const floatingButtonIconVariants = {
    whatsapp: { rotate: 0, scale: 1 },
    close: { rotate: 180, scale: 1 }
  };

  // CSS variables for theming
  const buttonStyle = {
    backgroundColor: primaryColor,
  };

  const headerStyle = {
    backgroundColor: primaryColor,
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} flex flex-col items-end ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-4 overflow-hidden rounded-2xl shadow-xl w-[320px] backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center p-3 text-white backdrop-blur-2xl"
              style={headerStyle}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3, type: "spring" }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden"
                >
                  {businessLogo ? (
                    <img
                      src={businessLogo} 
                      alt={businessName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-lg font-semibold"
                         style={{ backgroundColor: primaryColor }}>
                      {businessName.charAt(0)}
                    </div>
                  )}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex flex-col"
                >
                  <div className="font-semibold">{businessName}</div>
                </motion.div>
              </div>
              <motion.button 
                onClick={() => setIsOpen(false)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.2)", scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-auto p-1.5 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <motion.svg 
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </motion.svg>
              </motion.button>
            </motion.div>
            
            <div className="bg-gray-100/750 dark:bg-gray-800/50 backdrop-blur-xl p-4 min-h-[180px] relative">
              <motion.div 
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
                className="relative mb-4 max-w-[85%]"
              >
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {welcomeMessage}
                  </p>
                  {showTimestamp && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-right">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              className="p-3 bg-gray-100/70 dark:bg-gray-900/70 backdrop-blur-2xl border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="flex-grow p-2 mr-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-opacity-50 focus:outline-none resize-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg text-gray-800 dark:text-white transition-colors"
                  style={{ 
                    minHeight: "40px", 
                    maxHeight: "40px",
                    overflowY: "auto"
                  }}
                  rows={1}
                />
                <motion.button
                  onClick={handleWhatsAppClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:brightness-95"
                  style={buttonStyle}
                  aria-label="Send message on WhatsApp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg backdrop-blur-xl"
        style={buttonStyle}
        aria-label={isOpen ? "Close chat" : "Open WhatsApp chat"}
      >
        <motion.div 
          animate={isOpen ? "close" : "whatsapp"}
          variants={floatingButtonIconVariants}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center w-full h-full"
        >
          {isOpen ? (
            <motion.svg 
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </motion.svg>
          ) : (
            <motion.svg 
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 448 512" 
              width="24" 
              height="24" 
              fill="white"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </motion.svg>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}