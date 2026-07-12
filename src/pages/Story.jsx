import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";

import StoryHero from "../components/Story/StoryHero";
import StoryChapter from "../components/Story/StoryChapter";
import StoryEnding from "../components/Story/StoryEnding";
import { pageTransition } from "../animations/pageTransition";

export default function Story() {
  const [story] = useState(() => {
    const saved = localStorage.getItem("legacy-story");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const playhead = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    if (!story) {
      navigate("/");
    }
  }, [story, navigate]);

  if (!story) return null;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-ink text-paper"
    >
      <motion.div
        aria-hidden
        style={{ scaleX: playhead }}
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-rec"
      />

      <StoryHero
        title={story.title}
        tagline={story.tagline}
        quote={story.openingQuote}
        source={story.source}
      />

      <div className="relative isolate">
        {story.chapters.map((chapter, index) => (
          <StoryChapter
            key={index}
            chapter={chapter}
            index={index}
            image={story.images?.[index]?.image}
          />
        ))}
      </div>

      <StoryEnding ending={story.ending} />
    </motion.div>
  );
}