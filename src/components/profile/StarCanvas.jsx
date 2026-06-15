import { useEffect, useRef } from "react";

const StarCanvas = () => {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");

    let W = (c.width = window.innerWidth);
    let H = (c.height = window.innerHeight);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.003,
    }));

    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      stars.forEach((s) => {
        s.a += s.da;

        if (s.a <= 0 || s.a >= 1) {
          s.da *= -1;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,255,${s.a * 0.45})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default StarCanvas;