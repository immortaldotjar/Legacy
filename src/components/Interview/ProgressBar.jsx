import { motion } from "framer-motion";

export default function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="mb-12">

      <div className="mb-3 flex items-center justify-between text-sm text-zinc-400">
        <span>
          Question {current + 1} of {total}
        </span>

        <span>{Math.round(progress)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
        />

      </div>

    </div>
  );
}