import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Sparkles({ className }: { className?: string }) {
  return (
    <motion.div 
      className={cn("absolute inset-0 pointer-events-none", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1
      }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          initial={{ 
            scale: 0,
            x: "50%",
            y: "50%"
          }}
          animate={{ 
            scale: [0, 1, 0],
            x: ["50%", `${35 + i * 15}%`, "50%"],
            y: ["50%", `${35 + i * 15}%`, "50%"]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            repeatDelay: 0.5
          }}
        />
      ))}
    </motion.div>
  );
}
