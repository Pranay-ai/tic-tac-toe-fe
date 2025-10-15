import React from "react";
import { useGame } from "../context/GameContext";

const GameStatus = () => {
  const { gameState, playerId } = useGame();

  if (!gameState) {
    return null;
  }

  let message = "";
  const isGameOver = gameState.status !== "playing";
  const isPlayerX = playerId && gameState.playerX === playerId;
  const isPlayerO = playerId && gameState.playerO === playerId;
  const mySymbol = isPlayerX ? "X" : isPlayerO ? "O" : null;
  const opponentSymbol = mySymbol === "X" ? "O" : mySymbol === "O" ? "X" : null;

  const sanitizeName = (raw) => {
    if (!raw || typeof raw !== "string") {
      return undefined;
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      return undefined;
    }
    const looksLikeUuid = /^[0-9a-fA-F-]{32,}$/.test(trimmed.replace(/-/g, ""));
    return looksLikeUuid ? undefined : trimmed;
  };

  const extractName = (value) => {
    if (!value) {
      return undefined;
    }
    if (typeof value === "string") {
      return sanitizeName(value);
    }
    if (typeof value === "object") {
      for (const key of ["name", "displayName", "playerName", "nickname", "label"]) {
        const candidate = value[key];
        const result = typeof candidate === "string" ? sanitizeName(candidate) : undefined;
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  };

  const opponentCandidates = [];
  if (opponentSymbol) {
    opponentCandidates.push(
      extractName(gameState[`player${opponentSymbol}Name`]),
      extractName(gameState[`player${opponentSymbol}`])
    );
  }

  if (Array.isArray(gameState.players)) {
    const opponentFromList = gameState.players.find((player) => {
      if (!player) {
        return false;
      }
      const ids = [player.id, player.playerId, player.uuid, player.identifier].filter(Boolean);
      if (ids.length === 0) {
        return false;
      }
      return !ids.includes(playerId);
    });
    opponentCandidates.push(extractName(opponentFromList));
  }

  opponentCandidates.push(
    extractName(gameState.opponentName),
    extractName(gameState.opponent)
  );

  const opponentName = opponentCandidates.find(Boolean);
  const opponentLabel = opponentName || "your opponent";

  switch (gameState.status) {
    case "win_x":
      message = mySymbol
        ? mySymbol === "X"
          ? "You Win! 🏆"
          : "You Lost 😔"
        : "X wins! 🏆";
      break;
    case "win_o":
      message = mySymbol
        ? mySymbol === "O"
          ? "You Win! 🏆"
          : "You Lost 😔"
        : "O wins! 🏆";
      break;
    case "draw":
      message = "It's a Draw! 🤝";
      break;
    default:
      // Turn status is now handled by the border
      break;
  }

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="game-status">
      {(mySymbol || opponentName) && (
        <p className="game-status__matchup">
          Playing with <span className="game-status__opponent">{opponentLabel}</span>
          {opponentSymbol ? ` (${opponentSymbol})` : ""}
          {mySymbol ? ` • You are ${mySymbol}` : ""}
        </p>
      )}
      <h2>{message}</h2>
      {isGameOver && (
        <button onClick={handlePlayAgain} className="play-again-button">
          Play Again
        </button>
      )}
    </div>
  );
};

export default GameStatus;
