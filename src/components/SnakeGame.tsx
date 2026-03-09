import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const GRID_SIZE = 24;
const INITIAL_SPEED = 120;

type Direction = "up" | "down" | "left" | "right";

interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 12, y: 12 }]);
  const [food, setFood] = useState<Position>({ x: 18, y: 18 });
  const [direction, setDirection] = useState<Direction>("right");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef<Direction>("right");
  const foodRef = useRef<Position>({ x: 18, y: 18 });
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 12, y: 12 }]);
    setFood({ x: 18, y: 18 });
    setDirection("right");
    directionRef.current = "right";
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const dir = directionRef.current;
        let newHead: Position;

        switch (dir) {
          case "up":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "down":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "left":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "right":
            newHead = { x: head.x + 1, y: head.y };
            break;
          default:
            newHead = head;
        }

        newHead.x = ((newHead.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
        newHead.y = ((newHead.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;

        
        if (prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore((s) => s + 10);
          const nextFood = generateFood(newSnake);
          foodRef.current = nextFood;
          setFood(nextFood);
          setSpeed((sp) => Math.max(60, sp - 3));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, speed, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const dir = directionRef.current;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (dir !== "down") setDirection("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (dir !== "up") setDirection("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (dir !== "right") setDirection("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (dir !== "left") setDirection("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  return (
    <section id="snake-game" className="w-full px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-3 flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground tabular-nums">{score}</span>
          <Button onClick={resetGame} variant="ghost" size="icon" className="h-8 w-8">
            <RotateCcw size={14} />
          </Button>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[min(100%,85vh)] overflow-hidden rounded-xl border border-border/40">
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
              const isSnakeBody = snake.some(
                (s, idx) => idx > 0 && s.x === x && s.y === y
              );
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={i}
                  className={`${
                    isSnakeHead
                      ? "bg-foreground"
                      : isSnakeBody
                      ? "bg-foreground/60"
                      : isFood
                      ? "bg-foreground/80"
                      : "bg-transparent"
                  }`}
                />
              );
            })}
          </div>

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">{score}</p>
                <Button onClick={resetGame} variant="outline" size="sm">
                  <RotateCcw size={12} className="mr-1" />
                  Again
                </Button>
              </div>
            </div>
          )}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <button
                onClick={resetGame}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Click to start
              </button>
            </div>
          )}
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground/70">
          ↑↓←→ or WASD
        </p>
      </div>
    </section>
  );
};

export default SnakeGame;
