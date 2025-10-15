let socket;
let onOpenCallbacks = [];
const websocketUrl =
  import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080/ws";

// This function will be called once the socket is open.
const executeOnOpenCallbacks = () => {
  if (onOpenCallbacks.length > 0) {
    onOpenCallbacks.forEach((callback) => callback());
    onOpenCallbacks = []; // Clear callbacks after execution
  }
};

export const connectSocket = (onOpen) => {
  // If a valid callback is provided, add it to the list.
  if (typeof onOpen === "function") {
    onOpenCallbacks.push(onOpen);
  }

  // If the socket is already open, immediately run the callbacks.
  if (socket && socket.readyState === WebSocket.OPEN) {
    executeOnOpenCallbacks();
    return;
  }

  // If the socket is already trying to connect, just wait.
  if (socket && socket.readyState === WebSocket.CONNECTING) {
    return;
  }

  // If there's no socket or it's closed, create a new one.
  socket = new WebSocket(websocketUrl);

  socket.onopen = () => {
    console.log("WebSocket connection established successfully.");
    // Run all pending onOpen callbacks.
    executeOnOpenCallbacks();
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed.");
    socket = null; // Clear the socket on close
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
    return true;
  }
  console.error("Socket is not connected or ready.");
  return false;
};

export const subscribeToMessages = (callback) => {
  // The onmessage handler can be set at any time.
  // We'll rely on the app's effect hook to set this up.
  if (socket) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      callback(message);
    };
  }
};
