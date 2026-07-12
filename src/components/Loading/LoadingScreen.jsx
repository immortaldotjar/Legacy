import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STAGES = [
  "Transcribing your answers…",
  "Writing the six scenes…",
  "Developing the photographs…",
  "Splicing the final reel…",
];

export default function LoadingScreen() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden grain fixed inset-0 flex flex-col items-center justify-center bg-ink text-paper h-screen w-screen">

      <div className="flex flex-col justify-center items-center">

        <div className="flex gap-2" aria-hidden>
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 1, 0],

              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
              className="h-14 w-10 rounded-sm border border-brass/40 bg-ink-2"
            />
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2">
          
          <span className="eyebrow text-xs text-paper-dim">Recording in progress</span>
        </div>

        <motion.h2
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 font-display text-2xl md:text-5xl"
        >
          {STAGES[stage]}
        </motion.h2>

        <p className="mt-4 text-sm text-paper-dim">
          <marquee behavior="infinite" direction="">This usually takes under a minute. Don't close this tab.</marquee>
        </p>
      </div>
    </div>
  );
}
