import { motion } from "framer-motion";

export default function StoryChapter({

    chapter,

    index

}) {

    return (

        <motion.section

            initial={{
                opacity: 0,
                y: 80
            }}

            whileInView={{
                opacity: 1,
                y: 0
            }}

            viewport={{
                once: true,
                amount: .3
            }}

            transition={{
                duration: .8
            }}

            className="flex min-h-screen items-center px-6"

        >

            <div className="mx-auto max-w-5xl">

                <p className="mb-5 uppercase tracking-[0.4em] text-amber-400">

                    Chapter {index + 1}

                </p>

                <h2 className="font-serif text-6xl">

                    {chapter.title}

                </h2>

                <p className="mt-10 text-xl leading-10 text-zinc-300">

                    {chapter.content}

                </p>

            </div>

        </motion.section>

    )

}