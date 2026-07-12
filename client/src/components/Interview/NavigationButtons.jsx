import { ArrowLeft, ArrowRight, Film } from "lucide-react";

export default function NavigationButtons({
  current,
  total,
  previous,
  next,
  onGenerate,
  disabled,
}) {
  const isLast = current === total - 1;

  return (
    <div className="mt-12 flex items-center justify-between">
      <button
        onClick={previous}
        disabled={current === 0}
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-paper/10
          px-6
          py-3
          text-paper
          transition
          hover:bg-paper/5
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <button
        onClick={isLast ? onGenerate : next}
        disabled={disabled}
        className="
          flex
          items-center
          gap-2
          rounded-full
          bg-paper
          px-7
          py-3
          font-medium
          text-ink
          transition
          hover:-translate-y-0.5
          disabled:cursor-not-allowed
          disabled:opacity-30
          disabled:hover:translate-y-0
        "
      >
        {isLast ? (
          <>
            <Film size={18} />
            Cut the Reel
          </>
        ) : (
          <>
            Next
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
