import { v4 as uuidv4 } from "uuid";

const PLAYER_ID_KEY = "tic-tac-toe-player-id";
const PLAYER_NAME_KEY = "tic-tac-toe-player-name";

// Get Player ID (no changes here)
export const getPlayerId = () => {
  let playerId = sessionStorage.getItem(PLAYER_ID_KEY);
  if (!playerId) {
    playerId = uuidv4();
    sessionStorage.setItem(PLAYER_ID_KEY, playerId);
  }
  return playerId;
};

// --- NEW FUNCTIONS ---

// Set the player's name in sessionStorage
export const setPlayerName = (name) => {
  if (!name || name.trim() === "") {
    // If name is empty, generate a random one
    name = `Player${Math.floor(Math.random() * 9000) + 1000}`;
  }
  sessionStorage.setItem(PLAYER_NAME_KEY, name);
  return name;
};

// Get the player's name
export const getPlayerName = () => {
  return sessionStorage.getItem(PLAYER_NAME_KEY);
};
