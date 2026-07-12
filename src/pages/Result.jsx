export default function Result({ story }) {
  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No story generated.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold">
        {story.title}
      </h1>

      <p className="text-xl mt-3 text-gray-400">
        {story.tagline}
      </p>

      <blockquote className="mt-10 text-2xl italic">
        "{story.openingQuote}"
      </blockquote>

      <div className="mt-16 space-y-16">
        {story.chapters.map((chapter, index) => (
          <section key={index}>
            <h2 className="text-3xl font-semibold">
              {chapter.title}
            </h2>

            <p className="mt-4 leading-8 text-lg">
              {chapter.content}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-20 text-xl italic">
        {story.ending}
      </p>

    </main>
  );
}