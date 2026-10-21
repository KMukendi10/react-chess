
export default function ChessClock({
  whiteTime,
  blackTime,
  activeColor,
}) {
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return (
    <div className="clocks">
      <div
        className={`clock ${activeColor === "b" ? "active-clock" : ""}`}
      >
        <span>Black</span>
        <strong>{formatTime(blackTime)}</strong>
      </div>

      <div
        className={`clock ${activeColor === "w" ? "active-clock" : ""}`}
      >
        <span>White</span>
        <strong>{formatTime(whiteTime)}</strong>
      </div>
    </div>
  );
}
