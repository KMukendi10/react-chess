const PIECES = {
  wk: "♔",
  wq: "♕",
  wr: "♖",
  wb: "♗",
  wn: "♘",
  wp: "♙",
  bk: "♚",
  bq: "♛",
  br: "♜",
  bb: "♝",
  bn: "♞",
  bp: "♟",
};

export default function ChessSquare({
  square,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isCapture,
  isLastMove,
  isInCheck,
  onClick,
}) {
  const pieceSymbol = piece
    ? PIECES[piece.color + piece.type]
    : null;

  const classes = [
    "square",
    isLight ? "light" : "dark",
    isSelected && "selected",
    isLegalMove && "legal-move",
    isCapture && "capture-move",
    isLastMove && "last-move",
    isInCheck && "in-check",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={`${square}${piece ? `, ${piece.color === "w" ? "white" : "black"} ${piece.type}` : ""}`}
    >
      {pieceSymbol && (
        <span
          className={`piece ${piece.color === "w" ? "white-piece" : "black-piece"}`}
        >
          {pieceSymbol}
        </span>
      )}

      {isLegalMove && !piece && (
        <span className="move-dot" />
      )}
    </button>
  );
}
