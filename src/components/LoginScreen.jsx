import React, { useState } from "react";

const LoginScreen = ({ onNameSet }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onNameSet(name);
  };

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength="15"
        />
        <button type="submit" className="primary-button login-button">
          Play
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
