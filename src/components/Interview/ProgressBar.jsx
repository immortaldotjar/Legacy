import { toTimecode } from "../../utils/timecode";

export default function ProgressBar({ current, total }) {
  return (
    <div className="mb-12">
      <div className="eyebrow mb-3 flex items-center justify-between text-xs text-paper-dim">
        <span>
          Scene {current + 1} of {total}
        </span>
        <span>{Math.round(((current + 1) / total) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i < current
                ? "bg-brass"
                : i === current
                ? "bg-rec"
                : "bg-ink-3"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
