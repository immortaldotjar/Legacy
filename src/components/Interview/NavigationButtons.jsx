import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NavigationButtons({
  current,
  total,
  previous,
  next,
  onGenerate,
}) {
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
          border-white/10
          px-6
          py-3
          text-white
          transition
          hover:bg-white/5
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <button
        onClick={current === total - 1
          ? onGenerate
          : next
        }
        className="
          flex
          items-center
          gap-2
          rounded-full
          bg-white
          px-7
          py-3
          font-medium
          text-black
          transition
          hover:-translate-y-0.5
        "
      >
        {current === total - 1
          ? "Generate Legacy"
          : "Next"}

        <ArrowRight size={18} />
      </button>

    </div>
  );
}