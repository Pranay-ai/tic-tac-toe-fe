import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import GameStatus from "./components/GameStatus";
import LoginScreen from "./components/LoginScreen";
import Leaderboard from "./components/Leaderboard";
import {
  connectSocket,
  sendMessage,
  subscribeToMessages,
} from "./services/socket";
import { useGame } from "./context/GameContext";
import {
  getPlayerId,
  setPlayerName,
  getPlayerName,
} from "./services/playerService";

function App() {
  const { gameState, setGameState, setPlayerId } = useGame();
  const [playerName, setPlayerNameState] = useState(getPlayerName());
  const [isSearching, setIsSearching] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const previousStatusRef = useRef(null);

  const handleViewLeaderboard = useCallback(() => {
    setIsLeaderboardLoading(true);

    const didSend = sendMessage({ type: "get_leaderboard" });

    if (!didSend) {
      setIsLeaderboardLoading(false);
    }
  }, []);

  useEffect(() => {
    connectSocket(handleViewLeaderboard);
    setPlayerId(getPlayerId());

    subscribeToMessages((message) => {
      console.log("Received message:", message);

      switch (message.type) {
        case "match_found":
        case "game_update":
          setIsSearching(false);
          setGameState(message.payload);
          break;
        case "leaderboard_update":
          setLeaderboard(message.payload);
          setIsLeaderboardLoading(false);
          break;
        default:
          break;
      }
    });
  }, [handleViewLeaderboard, setGameState, setPlayerId]);

  useEffect(() => {
    const currentStatus = gameState?.status ?? null;
    const previousStatus = previousStatusRef.current;
    const isFinished = currentStatus && currentStatus !== "playing";

    if (isFinished && currentStatus !== previousStatus) {
      handleViewLeaderboard();
    }

    previousStatusRef.current = currentStatus;
  }, [gameState, handleViewLeaderboard]);

  const handleNameSet = (name) => {
    const finalName = setPlayerName(name);
    setPlayerNameState(finalName);
  };

  const handleFindMatch = () => {
    setIsSearching(true);
    const playerId = getPlayerId();
    const playerName = getPlayerName();
    sendMessage({
      type: "find_match",
      payload: {
        playerId: playerId,
        playerName: playerName,
      },
    });
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="title-group">
          <h1>Arcade Tic-Tac-Toe</h1>
          <p className="tagline">Queue up, play fast, climb the board.</p>
        </div>
        {playerName && (
          <div className="header-actions">
            <span className="player-chip">{playerName}</span>
            <button
              className="ghost-button"
              onClick={handleViewLeaderboard}
              disabled={isLeaderboardLoading}
            >
              {isLeaderboardLoading ? "Loading..." : "Refresh Leaderboard"}
            </button>
          </div>
        )}
      </header>

      <div className="app-content">
        <main className="main-stage">
          {!playerName ? (
            <div className="card">
              <h2>Jump into the arena</h2>
              <p>Pick a display name and you&apos;re seconds away from your first match.</p>
              <LoginScreen onNameSet={handleNameSet} />
            </div>
          ) : gameState ? (
            <div className="card card--game">
              <GameBoard />
              <GameStatus />
            </div>
          ) : (
            <div className="card">
              <h2>Ready when you are</h2>
              <p>Matchmaking finds you the next available challenger.</p>
              <button
                className="primary-button"
                onClick={handleFindMatch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Find Match"}
              </button>
            </div>
          )}
        </main>

        <aside className="sidebar">
          <Leaderboard
            scores={leaderboard}
            isLoading={isLeaderboardLoading}
            onRefresh={handleViewLeaderboard}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
