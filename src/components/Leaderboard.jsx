import React from "react";

const Leaderboard = ({ scores, isLoading, onRefresh }) => {
  const hasScores = Array.isArray(scores) && scores.length > 0;

  return (
    <div className="leaderboard card">
      <div className="leaderboard__header">
        <h2>Leaderboard</h2>
        <button
          className="ghost-button"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Refresh"}
        </button>
      </div>

      {isLoading && !hasScores ? (
        <p className="leaderboard__state">Fetching the latest records…</p>
      ) : hasScores ? (
        <ol className="leaderboard__list">
          {scores.map((entry, index) => (
            <li key={index}>
              <span className="leaderboard__rank">#{index + 1}</span>
              {/* Changed Member to name */}
              <span className="leaderboard__name">{entry.name}</span>
              {/* Changed Score to score */}
              <span className="leaderboard__score">{entry.score} wins</span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="leaderboard__empty">
          <p>No victories recorded yet.</p>
          <p className="leaderboard__hint">Queue up and claim the top spot!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
