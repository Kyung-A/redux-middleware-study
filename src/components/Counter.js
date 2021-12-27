import React from "react";

function Counter({ number, onIncrease, onDecrease }) {
  return (
    <div>
      <h1>{number}</h1>
      <button type="button" onClick={onIncrease}>
        +
      </button>
      <button type="button" onClick={onDecrease}>
        -
      </button>
    </div>
  );
}

export default Counter;
