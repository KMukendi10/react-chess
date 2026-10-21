import ChessSquare from "./ChessSquare";

const FILES = "abcdefgh";

export default function ChessBoard({
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  checkedKing,
  onSquareClick,
}) {
  return (
    <div className="board">
      {board.map((rank, row) =>
        rank.map((piece, col) => {
          const square = `${FILES[col]}${8 - row}`;
          const isLight = (row + col) % 2 === 0;

          return (
            <ChessSquare
              key={square}
              square={square}
              piece={piece}
              isLight={isLight}
              isSelected={selectedSquare === square}
              isLegalMove={legalMoves.includes(square)}
              isCapture={
                legalMoves.includes(square) && piece !== null
              }
              isLastMove={
                lastMove?.from === square ||
                lastMove?.to === square
              }
              isInCheck={checkedKing === square}
              onClick={() => onSquareClick(square)}
            />
          );
        })
      )}
    </div>
  );
}
