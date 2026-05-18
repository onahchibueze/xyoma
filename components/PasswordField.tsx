'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  required = true,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="group relative">
      <label className="block text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2 group-focus-within:text-white transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          required={required}
          className="block w-full bg-zinc-950 border border-white/5 py-4 pl-5 pr-12 text-white text-xs tracking-wide placeholder:text-zinc-800 focus:outline-none focus:border-white/20 transition-all rounded-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors focus:outline-none p-1"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={showPassword ? "eye" : "eye-off"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
