import React from "react";
import Pusher from "pusher-js";
import "./App.css";

const pusher = new Pusher("40ebca8b93d271070a0a", {
  cluster: "us3",
  forceTLS: true
});

const channel = pusher.subscribe("my-channel");
channel.bind("my-event", function(data) {
  alert(JSON.stringify(data));
});

function box(ctx, x, y, w, h, line) {
  ctx.beginPath();
  ctx.lineWidth = line;
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w, y + w);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function horizontalExit(ctx, x, y, w, line) {
  ctx.beginPath();
  ctx.lineWidth = line;
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}

function VerticalExit(ctx, x, y, w, h, line) {}

function useCanvas() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 24;
    const height = 28;

    const x = 22,
      y = 14,
      w = 26,
      h = 26,
      line = 2,
      offset = 15,
      sizeX = w + line,
      sizeY = h + line;

    box(
      ctx,
      x * sizeX + (x + 1) * offset,
      y * sizeY + (y + 1) * offset,
      w,
      h,
      line
    );
    //     for (let y = 0; y <= height; y++) {
    //       for (let x = 0; x <= width; x++) {
    //         const line = 2;
    //         const w = 26;
    //         const h = 26;
    //         const sizeX = line + w;
    //         const sizeY = line + h;
    //         const offset = 15;
    //         box(
    //           ctx,
    //           x * sizeX + (x + 1) * offset,
    //           y * sizeY + (y + 1) * offset,
    //           w,
    //           h,
    //           line
    //         );
    //       }
    //     }

    // for (let y = 1; y <= height; y++) {
    //   for (let x = 1; x <= width; x++) {
    //     const size = 15;
    //     const line = 6;
    //     const offset = 26;
    //     horizontalExit(
    //       ctx,
    //       x * (offset + 2) - 1 + x * size,
    //       y * 27 + offset,
    //       size,
    //       line
    //     );
    //     VerticalExit(ctx);
    //   }
    // }
  });
  return [canvasRef];
}

function App() {
  const [canvasRef] = useCanvas();
  // draw(canvasRef);
  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 1}
        height={window.innerHeight - 4}
      />
    </>
  );
}
export default App;
