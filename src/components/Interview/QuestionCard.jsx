export default function QuestionCard({
  question,
  value,
  updateAnswer,
}) {
  if (!question) return null;

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.35em] text-amber-400">
        {question.chapter}
      </p>

      <h2 className="mt-5 text-4xl font-serif leading-tight">
        {question.question}
      </h2>

      <textarea
        rows={7}
        value={value}
        onChange={(e) => updateAnswer(e.target.value)}
        placeholder={question.placeholder}
        className="
          mt-10
          w-full
          resize-none
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-6
          text-lg
          text-white
          outline-none
          backdrop-blur-md
          transition
          focus:border-amber-400
          focus:bg-white/10
        "
      />
    </div>
  );
}