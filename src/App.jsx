import React, { useEffect, useState, useCallback } from "react";
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
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [appStatus, setAppStatus] = useState("loading"); // "loading", "reconnecting", "ready"

  useEffect(() => {
    const playerId = getPlayerId();
    setPlayerId(playerId);
    // CHANGED: from sessionStorage to localStorage
    const activeGameId = localStorage.getItem("activeGameId");

    if (activeGameId) {
      setAppStatus("reconnecting");
    } else {
      setAppStatus("ready");
    }

    const onSocketOpen = () => {
      if (activeGameId) {
        sendMessage({
          type: "reconnect",
          payload: {
            playerId: playerId,
            gameId: activeGameId,
          },
        });
      }
    };

    connectSocket(onSocketOpen);

    subscribeToMessages((message) => {
      console.log("Received message:", message);
      switch (message.type) {
        case "match_found":
        case "game_update":
          setAppStatus("ready");
          setIsSearching(false);
          setGameState(message.payload);

          if (
            message.payload.status === "playing" ||
            message.payload.status.includes("disconnected")
          ) {
            // CHANGED: from sessionStorage to localStorage
            localStorage.setItem("activeGameId", message.payload.id);
          } else {
            // CHANGED: from sessionStorage to localStorage
            localStorage.removeItem("activeGameId");
          }
          break;
        case "leaderboard_update":
          setLeaderboard(message.payload);
          setIsLeaderboardLoading(false);
          break;
        default:
          break;
      }
    });
  }, [setGameState, setPlayerId]);

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
      payload: { playerId, playerName },
    });
  };

  const handleViewLeaderboard = useCallback(() => {
    setIsLeaderboardLoading(true);
    sendMessage({ type: "get_leaderboard" });
  }, []);

  const renderMainContent = () => {
    if (appStatus === "reconnecting") {
      return (
        <div className="card">
          <h2>Reconnecting...</h2>
          <p>Attempting to rejoin your active game.</p>
        </div>
      );
    }
    if (!playerName) {
      return (
        <div className="card">
          <h2>Jump into the arena</h2>
          <p>Pick a display name to start.</p>
          <LoginScreen onNameSet={handleNameSet} />
        </div>
      );
    }
    if (gameState) {
      return (
        <div className="card card--game">
          <GameBoard />
          <GameStatus />
        </div>
      );
    }
    return (
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
    );
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
        <main className="main-stage">{renderMainContent()}</main>
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
