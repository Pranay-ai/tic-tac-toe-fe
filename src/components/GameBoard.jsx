import React from "react";
import Cell from "./Cell";
import { useGame } from "../context/GameContext";
import { sendMessage } from "../services/socket";

const GameBoard = () => {
  const { gameState, playerId } = useGame();

  if (!gameState || !gameState.board) {
    return <div>Loading game...</div>;
  }

  const handleCellClick = (index) => {
    if (gameState.status !== "playing" || gameState.board[index]) {
      return;
    }
    sendMessage({
      type: "move",
      payload: {
        gameId: gameState.id,
        index: index,
      },
    });
  };

  // Determine if it's this client's turn
  const isMyTurn =
    (gameState.turn === "X" && gameState.playerX === playerId) ||
    (gameState.turn === "O" && gameState.playerO === playerId);

  const boardClassName = `game-board ${
    isMyTurn && gameState.status === "playing" ? "my-turn" : ""
  }`;

  return (
    <div className={boardClassName}>
      {gameState.board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => handleCellClick(index)}
        />
      ))}
    </div>
  );
};

export default GameBoard;
