import { motion } from "framer-motion";

export default function StoryHero({
    title,
    tagline,
    quote,
    source
}) {

    return (

        <section className="grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-10">

            <motion.div
                aria-hidden
                animate={{
                    x: [-40, 40, -40],
                    y: [20, -20, 20]
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity
                }}
                className="pointer-events-none absolute h-[700px] w-[700px] rounded-full bg-rec/10 blur-[180px]"
            />

            <div className="relative z-10 max-w-5xl text-center">

                <motion.h1

                    initial={{ opacity: 0, y: 30 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 1 }}

                    className="font-display text-4xl font-semibold md:text-8xl"

                >
                    {title}
                </motion.h1>

                <motion.p

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: .4 }}

                    className="mt-8 text-2xl text-paper-dim"

                >
                    {tagline}
                </motion.p>

                <motion.blockquote

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: .8 }}

                    className="mx-auto mt-20 max-w-3xl font-display text-3xl italic text-paper/90"

                >
                    "{quote}"
                </motion.blockquote>

            </div>

        </section>

    )

}
