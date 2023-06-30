import { useRef, useState, useEffect } from "react";
import { fromEvent, Subscription } from "rxjs";
import { interval } from "rxjs";
import { scan, share, startWith, takeWhile, takeUntil } from "rxjs/operators";

import "./App.css";

const TIME_LEFT = 25 * 60;

function padTime(time: number) {
  return time.toString().padStart(2, "0");
}

const stop$ = fromEvent(
  document.getElementById("stop") as HTMLButtonElement,
  "click"
);

function App() {
  const [title, setTitle] = useState("Let the countdown begin!");
  const [timeLeft, setTimeLeft] = useState(TIME_LEFT);
  const [isRunning, setIsRunning] = useState(false);
  const subscriptionRef = useRef<Subscription | null>(null);

  const countdown$ = interval(1000).pipe(
    startWith(timeLeft),
    scan((time) => time - 1),
    takeWhile((time) => time >= 0),
    takeUntil(stop$),
    share()
  );

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    };
  }, []);

  function startCountdown() {
    setIsRunning(true);
    setTitle("You're doing great");
    subscriptionRef.current = countdown$.subscribe((val) => setTimeLeft(val));
  }

  function stopCountdown() {
    if (!subscriptionRef.current) return;
    setIsRunning(false);
    subscriptionRef.current.unsubscribe();
  }

  function resetCountdown() {
    if (!subscriptionRef.current) return;
    setTimeLeft(TIME_LEFT);
    setIsRunning(false);
    setTitle("Ready for the another round!");
    subscriptionRef.current.unsubscribe();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft - minutes * 60;
  return (
    <div className="app">
      <h2>{title}</h2>

      <div className="timer">
        <span>{padTime(minutes)}</span>
        <span>:</span>
        <span>{padTime(seconds)}</span>
      </div>

      <div className="buttons">
        {/* {!isRunning ? ( */}
        <button onClick={startCountdown}>Start</button>
        {/* ) : ( */}
        <button id="stop" onClick={stopCountdown}>
          Stop
        </button>
        {/* )} */}
        <button onClick={resetCountdown}>Reset</button>
      </div>
    </div>
  );
}

export default App;
