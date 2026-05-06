import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ toast, onClose }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          onClick={onClose}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
