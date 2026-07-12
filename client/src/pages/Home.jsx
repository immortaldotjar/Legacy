import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fadeUp } from "../animations/fadeUp";
import { stagger } from "../animations/stagger";

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="grain relative flex h-screen flex-col items-center justify-center overflow-hidden bg-ink text-paper">
      <motion.div
        aria-hidden
        animate={{ x: ["-130%", "130%", "-130%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 3,delay:2 }}
        className="pointer-events-none absolute top-0 h-full w-1/3 bg-linear-to-r from-transparent via-rec/10 to-transparent blur-2xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: ["130%", "-130%", "130%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay:3,delay:2 }}
        className="pointer-events-none absolute top-0 h-full w-1/3 bg-linear-to-r from-transparent via-rec/10 to-transparent blur-2xl "
      />
      <motion.div
        aria-hidden
        animate={{ y: ["-130%", "130%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 0,delay:6 }}
        className="pointer-events-none absolute top-0 h-11/12 w-full bg-linear-to-t from-transparent via-violet-500/5 to-transparent blur-2xl mx-50"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl px-6 text-center "
      >
        <motion.p variants={fadeUp} className="eyebrow text-sm text-brass">
          Legacy — A Documentary of you
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-6 font-display text-6xl font-semibold leading-[0.95] md:text-8xl"
        >
          Every Passion
          <br />
          Has a Story.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-paper-dim"
        >
          Answer Seven questions about the life you've lived. Legacy cuts your
          memories into Seven scenes — a short, cinematic story of your own
          making.
        </motion.p>

        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav("/interview")}
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-rec px-8 py-2 font-medium text-paper transition hover:bg-rec/90"
        >

          Begin Your Story
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </motion.button>

        <motion.p variants={fadeUp} className="mt-8 font-display italic text-paper-dim">
          Seven questions. Seven scenes. One story.
        </motion.p>
      </motion.div>
    </div>
  );
}
