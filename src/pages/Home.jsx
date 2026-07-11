import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fadeUp } from "../animations/fadeUp";
import { stagger } from "../animations/stagger";

export default function Home() {
    const nav = useNavigate();

    return (
        <div className="relative center h-screen bg-zinc-950 text-white ">
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        x: [-20, 20, -20],
                        y: [10, -10, 10],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                    className="absolute left-0 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/30 blur-[180px]" />
                <motion.div
                    animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.2, 0.35, 0.2],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }} className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/30 blur-[180px]" />
                <motion.div
                    animate={{
                        x: [20, -20, 20],
                        y: [-10, 10, -10],
                    }}
                    transition={{
                        duration: 24,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }} className="absolute left-full top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/30 blur-[180px]" />
                    
            </div>

            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-4xl px-6 text-center"
            >

                <motion.p
                    variants={fadeUp}
                    className=" uppercase tracking-[30px] text-white font-bold "
                >
                    Legacy
                </motion.p>

                <motion.h1
                    variants={fadeUp}
                    className="font-serif text-6xl font-semibold md:text-8xl"
                >
                    Every Passion
                    <br />
                    Has a Story.
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    className="mx-auto mt-8 max-w-2xl text-lg text-zinc-300"
                >
                    Answer a few thoughtful questions and let AI transform
                    your memories into a cinematic documentary that feels
                    like your own movie.
                </motion.p>

                <motion.button
                    variants={fadeUp}
                    whileHover={{
                        scale: 1.02
                    }}
                    whileTap={{
                        scale: 0.98
                    }}
                    onClick={() => nav("/interview")}
                    className="group mt-10 inline-flex items-center gap-3 rounded-lg bg-white px-8 py-3 font-medium text-black transition"
                >
                    Begin Your Story

                    <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                </motion.button>

                <motion.p
                    variants={fadeUp}
                    className="mt-10 italic text-zinc-200"
                >
                    Every great journey begins with a single moment.
                </motion.p>

            </motion.div>

        </div>
    )
}