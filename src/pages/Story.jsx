import { useEffect, useState } from "react";

import StoryHero from "../components/Story/StoryHero";
import StoryChapter from "../components/Story/StoryChapter";
import StoryEnding from "../components/Story/StoryEnding";
export default function Story() {

  const [story, setStory] = useState(null);

  useEffect(() => {

    const saved = localStorage.getItem("legacy-story");

    if (saved) {

      setStory(JSON.parse(saved));

    }

  }, []);

  if (!story)

    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        No story found.
      </div>
    );

  return (

    <div className="bg-black text-white">

      <StoryHero

        title={story.title}

        tagline={story.tagline}

        quote={story.openingQuote}

      />

      {story.chapters.map((chapter, index) => (

        <StoryChapter

          key={index}

          chapter={chapter}

          index={index}

        />

      ))}

      <StoryEnding

        ending={story.ending}

      />

    </div>

  );

}