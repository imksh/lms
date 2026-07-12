import React, { createContext, useContext, useState, useRef } from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ConfirmContext = createContext();

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const resolver = useRef(null);

  const confirm = (msg) => {
    setMessage(msg);
    setIsOpen(true);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  const handleConfirm = () => {
    if (resolver.current) resolver.current(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolver.current) resolver.current(false);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-base-100 rounded-3xl w-full max-w-sm shadow-2xl border border-base-300 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-error/10 text-error p-3 rounded-full shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-extrabold text-lg">Are you sure?</h3>
                    <p className="text-base-content/70 text-sm mt-1 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-base-200/50 p-4 flex gap-3 justify-end border-t border-base-300/50">
                <button
                  onClick={handleCancel}
                  className="btn btn-sm btn-ghost rounded-xl font-bold px-6"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn btn-sm btn-error rounded-xl font-bold px-6 shadow-sm shadow-error/20"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};
