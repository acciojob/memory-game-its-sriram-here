import React, { useState, useEffect } from "react";
import "./../styles/App.css";

const levels = {
  easy: 4,
  normal: 8,
  hard: 16,
};

const App = () => {
  const [level, setLevel] = useState(null); // selected difficulty
  const [tiles, setTiles] = useState([]); // all shuffled tiles
  const [flipped, setFlipped] = useState([]); // currently flipped indices
  const [matched, setMatched] = useState([]); // matched tile indices
  const [attempts, setAttempts] = useState(0);

  // Generate shuffled tiles when level changes
  useEffect(() => {
    if (level) {
      const pairs = levels[level];
      const numbers = Array.from({ length: pairs }, (_, i) => i + 1);
      const allTiles = [...numbers, ...numbers]
        .sort(() => Math.random() - 0.5)
        .map((num, index) => ({ id: index, value: num }));
      setTiles(allTiles);
      setFlipped([]);
      setMatched([]);
      setAttempts(0);
    }
  }, [level]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  // Check match logic
  useEffect(() => {
    if (flipped.length === 2) {
      setAttempts((prev) => prev + 1);
      const [first, second] = flipped;
      if (tiles[first].value === tiles[second].value) {
        setMatched((prev) => [...prev, first, second]);
      }
      // flip back after delay
      setTimeout(() => setFlipped([]), 800);
    }
  }, [flipped, tiles]);

  const allMatched = matched.length === tiles.length && tiles.length > 0;

  return (
    <div className="game">
      {/* Do not remove the main div */}

      {!level && (
        <div className="levels_container">
          <h2>Select Difficulty</h2>
          <label>
            <input
              type="radio"
              name="level"
              id="easy"
              onChange={() => setLevel("easy")}
            />
            Easy
          </label>
          <label>
            <input
              type="radio"
              name="level"
              id="normal"
              onChange={() => setLevel("normal")}
            />
            Normal
          </label>
          <label>
            <input
              type="radio"
              name="level"
              id="hard"
              onChange={() => setLevel("hard")}
            />
            Hard
          </label>
        </div>
      )}

      {level && (
        <div className="game_container">
          <div className="cells_container">
            {tiles.map((tile, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              return (
                <div
                  key={tile.id}
                  className={`tile ${isFlipped ? "flipped" : ""}`}
                  onClick={() => handleFlip(index)}
                >
                  {isFlipped ? tile.value : "?"}
                </div>
              );
            })}
          </div>
          <p>Attempts: {attempts}</p>
          {allMatched && <h3>🎉 You solved it in {attempts} attempts!</h3>}
        </div>
      )}
    </div>
  );
};

export default App;
