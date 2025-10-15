import { v4 as uuidv4 } from "uuid";

const PLAYER_ID_KEY = "tic-tac-toe-player-id";
const PLAYER_NAME_KEY = "tic-tac-toe-player-name";

// Get Player ID, persisting it in localStorage
export const getPlayerId = () => {
  // CHANGED: from sessionStorage to localStorage
  let playerId = localStorage.getItem(PLAYER_ID_KEY);

  if (!playerId) {
    playerId = uuidv4();
    localStorage.setItem(PLAYER_ID_KEY, playerId);
  }

  return playerId;
};

// Set the player's name in localStorage
export const setPlayerName = (name) => {
  if (!name || name.trim() === "") {
    name = `Player${Math.floor(Math.random() * 9000) + 1000}`;
  }
  // CHANGED: from sessionStorage to localStorage
  localStorage.setItem(PLAYER_NAME_KEY, name);
  return name;
};

// Get the player's name from localStorage
export const getPlayerName = () => {
  // CHANGED: from sessionStorage to localStorage
  return localStorage.getItem(PLAYER_NAME_KEY);
};
