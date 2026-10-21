import { useState } from "react";
import { Chess } from "chess.js";
import "./App.css";

const symbols = {
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

export default function App() {
  const [game, setGame] = useState(() => new Chess());
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  // Convert the chess engine's board into React-friendly data.
  const board = game.board();

  function handleSquareClick(row, col) {
    const square = `${"abcdefgh"[col]}${8 - row}`;
    const piece = board[row][col];

    // If a piece is selected, try to move it.
    if (selected) {
      try {
        const move = game.move({
          from: selected,
          to: square,
          promotion: "q",
        });

        if (move) {
          setGame(new Chess(game.fen()));
          setSelected(null);

          if (game.isCheckmate()) {
            setMessage(
              `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins!`
            );
          } else if (game.isDraw()) {
            setMessage("Game drawn!");
          } else {
            setMessage(game.isCheck() ? "Check!" : "");
          }

          return;
        }
      } catch {
        // The move is illegal. Let the player select another piece.
      }
    }

    // Select a piece belonging to the player whose turn it is.
    if (piece && piece.color === game.turn()) {
      setSelected(square);
      setMessage("");
    } else {
      setSelected(null);
    }
  }

  function restartGame() {
    setGame(new Chess());
    setSelected(null);
    setMessage("");
  }

  const gameOver = game.isGameOver();

  return (
    <main className="game">
      <h1>React Chess</h1>

      <p>
        {message ||
          (gameOver
            ? "Game over"
            : `${game.turn() === "w" ? "White" : "Black"} to move`)}
      </p>

      <div className="board">
        {board.map((rank, row) =>
          rank.map((piece, col) => {
            const square = `${"abcdefgh"[col]}${8 - row}`;
            const isLight = (row + col) % 2 === 0;
            const isSelected = selected === square;

            return (
              <button
                key={square}
                className={`square ${isLight ? "light" : "dark"} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => handleSquareClick(row, col)}
                aria-label={`${square}${
                  piece
                    ? ` ${piece.color === "w" ? "white" : "black"} ${
                        piece.type
                      }`
                    : ""
                }`}
              >
                {piece && symbols[piece.color + piece.type]}
              </button>
            );
          })
        )}
      </div>

      <button className="restart" onClick={restartGame}>
        New Game
      </button>
    </main>
  );
}
