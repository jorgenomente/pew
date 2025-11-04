import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Edit2, Check } from 'lucide-react';

interface InlineEditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  style?: React.CSSProperties;
  className?: string;
  type?: 'income' | 'expense' | 'neutral';
  placeholder?: string;
}

export function InlineEditableText({
  value,
  onSave,
  style,
  className = '',
  type = 'neutral',
  placeholder = 'Escribir...',
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [showCheck, setShowCheck] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const glowColor = type === 'income' ? '#7ED4C1' : type === 'expense' ? '#C78C60' : '#0F3C3B';

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
        setIsEditing(false);
      }, 800);
    } else {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <div className={`relative inline-flex items-center gap-2 group ${className}`}>
        <span style={style} onDoubleClick={() => setIsEditing(true)}>
          {value}
        </span>
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing(true)}
          className="w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Editar (doble clic)"
        >
          <Edit2 className="w-3 h-3" style={{ color: glowColor }} />
        </motion.button>
        
        <AnimatePresence>
          {showCheck && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute -right-8"
            >
              <Check className="w-5 h-5" style={{ color: glowColor }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative inline-block"
    >
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-white/60 backdrop-blur-sm border-2 rounded-xl px-3 py-1 outline-none transition-all duration-300"
        style={{
          ...style,
          borderColor: `${glowColor}60`,
          boxShadow: `0 0 20px ${glowColor}40`,
        }}
      />
      
      {/* Soft cursor pulse effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-1 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}20, transparent)`,
        }}
      />
    </motion.div>
  );
}
