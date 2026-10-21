import { useEffect, useState } from "react";
import { Chess } from "chess.js";

import ChessBoard from "./components/ChessBoard";
import MoveHistory from "./components/MoveHistory";
import ChessClock from "./components/ChessClock";

import "./App.css";

const INITIAL_TIME = 5 * 60;

export default function App() {
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);

  const [history, setHistory] = useState([]);
  const [moveRecords, setMoveRecords] = useState([]);
  const [positionHistory, setPositionHistory] = useState([]);

  const [whiteTime, setWhiteTime] = useState(INITIAL_TIME);
  const [blackTime, setBlackTime] = useState(INITIAL_TIME);
  const [flagged, setFlagged] = useState(null);
  const [gameId, setGameId] = useState(0);

  const activeColor = game.turn();
  const gameOver = game.isGameOver() || flagged !== null;

  // Find the legal destinations for the selected piece.
  const legalMoves = selectedSquare
    ? game
        .moves({ square: selectedSquare, verbose: true })
        .map((move) => move.to)
    : [];

  const board = game.board();

  const lastMove = moveRecords[moveRecords.length - 1] ?? null;

  // Find the king's square when that king is in check.
  let checkedKing = null;

  if (game.isCheck()) {
    board.forEach((rank, row) => {
      rank.forEach((piece, col) => {
        if (
          piece?.type === "k" &&
          piece.color === activeColor
        ) {
          checkedKing = `${"abcdefgh"[col]}${8 - row}`;
        }
      });
    });
  }

  // Run the clock for the active player.
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      if (activeColor === "w") {
        setWhiteTime((time) => Math.max(0, time - 1));
      } else {
        setBlackTime((time) => Math.max(0, time - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeColor, gameOver, gameId]);

  // Detect when a player's time runs out.
  useEffect(() => {
    if (!gameOver && whiteTime === 0) {
      setFlagged("w");
    } else if (!gameOver && blackTime === 0) {
      setFlagged("b");
    }
  }, [whiteTime, blackTime, gameOver]);

  function handleSquareClick(square) {
    if (gameOver) return;

    const piece = game.get(square);

    // If the selected piece can legally move here, make the move.
    if (selectedSquare && legalMoves.includes(square)) {
      const nextGame = new Chess(game.fen());

      const move = nextGame.move({
        from: selectedSquare,
        to: square,
        promotion: "q",
      });

      if (move) {
        setPositionHistory((previous) => [
          ...previous,
          game.fen(),
        ]);

        setHistory((previous) => [...previous, move.san]);
        setMoveRecords((previous) => [...previous, move]);

        setGame(nextGame);
        setSelectedSquare(null);
      }

      return;
    }

    // Otherwise, select a piece belonging to the current player.
    if (piece && piece.color === activeColor) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  }

  function undoMove() {
    if (positionHistory.length === 0 || flagged !== null) return;

    const previousFen =
      positionHistory[positionHistory.length - 1];

    setGame(new Chess(previousFen));
    setPositionHistory((previous) => previous.slice(0, -1));
    setHistory((previous) => previous.slice(0, -1));
    setMoveRecords((previous) => previous.slice(0, -1));
    setSelectedSquare(null);
    setFlagged(null);
  }

  function restartGame() {
    setGame(new Chess());
    setSelectedSquare(null);
    setHistory([]);
    setMoveRecords([]);
    setPositionHistory([]);
    setWhiteTime(INITIAL_TIME);
    setBlackTime(INITIAL_TIME);
    setFlagged(null);
    setGameId((id) => id + 1);
  }

  let status;

  if (flagged) {
    status = `${flagged === "w" ? "White" : "Black"} ran out of time. ${
      flagged === "w" ? "Black" : "White"
    } wins!`;
  } else if (game.isCheckmate()) {
    status = `Checkmate! ${activeColor === "w" ? "Black" : "White"} wins!`;
  } else if (game.isStalemate()) {
    status = "Draw by stalemate.";
  } else if (game.isDraw()) {
    status = "The game is a draw.";
  } else if (game.isCheck()) {
    status = `${activeColor === "w" ? "White" : "Black"} is in check!`;
  } else {
    status = `${activeColor === "w" ? "White" : "Black"} to move`;
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">TWO-PLAYER GAME</p>
          <h1>React Chess</h1>
          <p className="subtitle">
            Think ahead. Make your move.
          </p>
        </div>

        <button className="new-game" onClick={restartGame}>
          New Game
        </button>
      </header>

      <div className="game-layout">
        <section className="game-area">
          <div className="game-status">
            <span
              className={`turn-indicator ${
                activeColor === "w" ? "white-indicator" : "black-indicator"
              }`}
            />
            <span>{status}</span>
          </div>

          <ChessClock
            whiteTime={whiteTime}
            blackTime={blackTime}
            activeColor={activeColor}
          />

          <ChessBoard
            board={board}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            checkedKing={checkedKing}
            onSquareClick={handleSquareClick}
          />

          <div className="board-footer">
            <span>White: bottom</span>
            <span>Moves: {history.length}</span>
          </div>

          <div className="game-actions">
            <button
              className="secondary-button"
              onClick={undoMove}
              disabled={positionHistory.length === 0 || flagged !== null}
            >
              Undo Move
            </button>

            <button className="secondary-button" onClick={restartGame}>
              Restart
            </button>
          </div>
        </section>

        <aside className="sidebar">
          <MoveHistory history={history} />

          <div className="rules-note">
            <h3>How to play</h3>
            <p>Select one of your pieces, then select a highlighted
              destination to move it.</p>
            <p>Each player gets five minutes. The clock pauses when
              the game ends.</p>
          </div>
        </aside>
      </div>

      <footer className="app-footer">
        Built with React and chess.js
      </footer>
    </main>
  );
}
