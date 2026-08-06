"use client";

import { motion, AnimatePresence } from "framer-motion";

export function AnimatedNumber({ value }: { value: number }) {
  const formatted = value.toLocaleString("id-ID");

  return (
    <span className="relative inline-flex overflow-hidden tabular-nums font-black h-[1.2em] leading-none items-center align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0, position: "absolute" }}
          animate={{ y: "0%", opacity: 1, position: "relative" }}
          exit={{ y: "-100%", opacity: 0, position: "absolute" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="inline-block whitespace-nowrap"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
