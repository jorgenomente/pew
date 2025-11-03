import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#C78C60] to-[#B57A50] shadow-lg flex items-center justify-center z-40"
      style={{
        boxShadow: '0 4px 20px rgba(199, 140, 96, 0.4)',
      }}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{
          scale: [1, 1.3, 1.5],
          opacity: [0.6, 0.3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{
          border: '2px solid #C78C60',
        }}
      />
      
      <Plus className="w-6 h-6 text-white relative z-10" />
    </motion.button>
  );
}
