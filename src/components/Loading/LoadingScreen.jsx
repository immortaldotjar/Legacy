import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="mx-auto h-16 w-16 rounded-full border-4 border-zinc-700 border-t-white"
        />

        <h2 className="mt-10 font-serif text-3xl">
          Creating your documentary...
        </h2>

        <p className="mt-4 text-zinc-400">
          Revisiting memories...
        </p>
      </div>
    </main>
  );
}