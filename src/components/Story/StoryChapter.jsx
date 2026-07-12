import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
const BLANK_FRAME =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='500'%3E%3Crect width='100%25' height='100%25' fill='%2317140f'/%3E%3Cg stroke='%23b4923d' stroke-opacity='0.35' stroke-width='2'%3E%3Ccircle cx='360' cy='210' r='40'/%3E%3Cpath d='M330 240l60-60M330 180l60 60'/%3E%3C/g%3E%3Ctext x='360' y='320' fill='%238f887c' font-family='monospace' font-size='16' text-anchor='middle' letter-spacing='2'%3EFRAME NOT DEVELOPED%3C/text%3E%3C/svg%3E";

export default function StoryChapter({ chapter, index, image }) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "start start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

    // Top-left corner sits a little lower than the top-right while the card
    // is sliding in, so the top edge reads as a slight incline; both
    // corners converge back to 0 (a straight edge) once the card is fully
    // pinned at the top of the viewport (scrollYProgress -> 1).
    const tilt = useTransform(scrollYProgress, [0, 1], [46, 0]);
    const cardClipPath = useMotionTemplate`polygon(0px ${tilt}px, 100% 0px, 100% 100%, 0px 100%)`;

    return (
        <section
            ref={ref}
            style={{ zIndex: index + 1, clipPath: cardClipPath }}
            className="sticky top-0 flex min-h-screen items-center overflow-hidden bg-ink px-6 py-10"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:gap-16">


                <motion.div
                    style={{ y, opacity }}
                    className="order-2 w-full md:order-1 md:w-1/2"
                >
                    <p className="eyebrow mb-5 flex items-center gap-3 text-xs text-brass">
                        <span>Scene {index + 1}</span>
                        {chapter.mood && (
                            <>
                                <span className="text-paper-dim">·</span>
                                <span className="text-paper-dim">{chapter.mood}</span>
                            </>
                        )}
                    </p>

                    <h2 className="font-display text-4xl md:text-5xl">
                        {chapter.title}
                    </h2>

                    <div className="mt-5 max-h-55 overflow-y-auto pr-4 md:max-h-100 story-scroll">
                        <p className="whitespace-pre-line text-lg leading-8 text-paper/80 md:text-[16px] md:leading-8">
                            {chapter.content}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    style={{ opacity }}
                    className="relative order-1 w-full overflow-hidden rounded-3xl shadow-2xl md:order-2 md:w-1/2"
                >
                    <motion.img
                        style={{ scale: imageScale }}
                        src={image || BLANK_FRAME}
                        alt={chapter.title}
                        loading="lazy"
                        className="h-75 w-full object-cover md:h-100"
                        onError={(e) => {
                            e.target.src = BLANK_FRAME;
                        }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />
                </motion.div>

            </div>
        </section>
    );
}