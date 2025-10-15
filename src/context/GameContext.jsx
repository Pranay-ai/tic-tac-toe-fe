import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  return (
    <GameContext.Provider
      value={{ gameState, setGameState, playerId, setPlayerId }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useGame = () => useContext(GameContext);
