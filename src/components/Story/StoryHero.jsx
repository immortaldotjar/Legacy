import { motion } from "framer-motion";

export default function StoryHero({
    title,
    tagline,
    quote
}) {

    return (

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">

            {/* Background Glow */}

            <motion.div
                animate={{
                    x: [-40, 40, -40],
                    y: [20, -20, 20]
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity
                }}
                className="absolute h-[700px] w-[700px] rounded-full bg-violet-600/20 blur-[180px]"
            />

            <div className="relative z-10 max-w-5xl text-center">

                <motion.h1

                    initial={{ opacity: 0, y: 30 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 1 }}

                    className="font-serif text-7xl md:text-8xl"

                >
                    {title}
                </motion.h1>

                <motion.p

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: .4 }}

                    className="mt-8 text-2xl text-zinc-400"

                >
                    {tagline}
                </motion.p>

                <motion.blockquote

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: .8 }}

                    className="mx-auto mt-20 max-w-3xl text-3xl italic text-zinc-300"

                >
                    "{quote}"
                </motion.blockquote>

            </div>

        </section>

    )

}