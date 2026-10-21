export default function MoveHistory({ history }) {
  const moves = [];

  for (let i = 0; i < history.length; i += 2) {
    moves.push({
      number: i / 2 + 1,
      white: history[i],
      black: history[i + 1] ?? "",
    });
  }

  return (
    <section className="history-panel">
      <h2>Move History</h2>

      {moves.length === 0 ? (
        <p className="empty-history">No moves yet.</p>
      ) : (
        <ol className="history-list">
          {moves.map((move) => (
            <li key={move.number}>
              <span>{move.number}.</span>
              <span>{move.white}</span>
              <span>{move.black}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
