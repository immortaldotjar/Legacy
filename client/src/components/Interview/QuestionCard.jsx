export default function QuestionCard({
  question,
  value,
  updateAnswer,
  answers,
  updateField,
}) {
  if (!question) return null;

  const isShortAnswer = question.type === "text";
  const extra = question.extraField;

  return (
    <div>
      <p className="eyebrow text-sm text-brass">
        {question.chapter}
      </p>

      <h2 className="mt-5 font-display text-4xl leading-tight">
        {question.question}
      </h2>

      <div className="relative mt-5">
        {isShortAnswer ? (
          <div className={extra ? "flex flex-col gap-4 sm:flex-row" : ""}>
            <input
              type="text"
              value={value}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder={question.placeholder}
              autoFocus
              className="
                w-full
                rounded-xl
                border
                border-paper/10
                bg-ink-2
                px-6
                py-3
                text-xl
                text-paper
                outline-none
                transition
                placeholder:text-paper-dim/60
                
              "
            />

            {extra && (
              <div className="sm:w-56 sm:shrink-0">
                <select
                  value={answers?.[extra.key] ?? ""}
                  onChange={(e) => updateField(extra.key, e.target.value)}
                  className="
                    h-full
                    w-full
                    cursor-pointer
                    rounded-xl
                    border
                    border-paper/10
                    bg-ink-2
                    px-6
                    py-3
                    text-lg
                    text-paper
                    outline-none
                    transition
                  "
                >
                  {extra.options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-ink-2 text-paper">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : (
          <>
            <textarea
              rows={7}
              value={value}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder={question.placeholder}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-paper/10
                bg-ink-2
                p-6
                pb-10
                text-lg
                text-paper
                outline-none
                transition
                placeholder:text-paper-dim/60
                
              "
            />
            <span className="eyebrow pointer-events-none absolute bottom-5 right-6 text-xs text-paper-dim">
              {(value || "").length}
            </span>
          </>
        )}
      </div>

      {extra && (
        <p className="mt-3 text-sm text-paper-dim">{extra.helper}</p>
      )}
    </div>
  );
}
