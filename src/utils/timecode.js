// Formats a scene/question index as a documentary-style timecode label,
// e.g. index 2 -> "00:02". Purely cosmetic, but used consistently
// across Home / Interview / Story to tie the "recording a life" motif together.
export function toTimecode(index) {
  const value = Math.max(0, index);
  return `00:${String(value).padStart(2, "0")}`;
}
