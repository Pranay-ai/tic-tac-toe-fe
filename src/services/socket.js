let socket;
let openListeners = [];

const flushOpenListeners = () => {
  if (openListeners.length === 0) {
    return;
  }

  const listenersToCall = openListeners;
  openListeners = [];

  listenersToCall.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("Error running socket onOpen listener:", error);
    }
  });
};

export const connectSocket = (onOpen) => {
  if (typeof onOpen === "function") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      onOpen();
    } else {
      openListeners.push(onOpen);
    }
  }

  if (socket) {
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    ) {
      return;
    }
  }

  socket = new WebSocket("ws://localhost:8080/ws");

  socket.onopen = () => {
    console.log("WebSocket connection established successfully.");
    flushOpenListeners();
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed.");
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

  console.error("Socket is not connected.");
  return false;
};

export const subscribeToMessages = (callback) => {
  if (!socket) return;
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    callback(message);
  };
};
