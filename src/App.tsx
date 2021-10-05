import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { interval } from "rxjs";
import { scan, share, startWith } from "rxjs/operators";

import "./App.css";

const TIME_LEFT = 25 * 60;

// const countdown$ = interval(1000).pipe(
//   startWith(TIME_LEFT),
//   scan((time) => {
//     if (time >= 1) return time - 1;
//     return 0;
//   }),
//   share()
// );

function padTime(time: number) {
  return time.toString().padStart(2, "0");
}

function App() {
  const [timeLeft, setTimeLeft] = useState(TIME_LEFT);
  const [isRunning, setIsRunning] = useState(false);
  const subscriptionRef = useRef<Subscription | null>(null);

  const countdown$ = interval(1000).pipe(
    startWith(timeLeft),
    scan((time) => {
      if (time >= 1) return time - 1;
      return 0;
    }),
    share()
  );

  function startCountdown() {
    setIsRunning(true);
    subscriptionRef.current = countdown$.subscribe((val) => setTimeLeft(val));
  }

  function stopCountdown() {
    if (!subscriptionRef.current) return;
    setIsRunning(false);
    subscriptionRef.current.unsubscribe();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft - minutes * 60;
  return (
    <div className="app">
      <h2>Pomodoro!</h2>

      <div className="timer">
        <span>{padTime(minutes)}</span>
        <span>:</span>
        <span>{padTime(seconds)}</span>
      </div>

      <div className="buttons">
        {!isRunning ? (
          <button onClick={startCountdown}>Start</button>
        ) : (
          <button onClick={stopCountdown}>Stop</button>
        )}
        <button>Reset</button>
      </div>
    </div>
  );
}

export default App;
