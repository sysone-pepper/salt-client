import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Outlet } from "react-router-dom";
import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    let width,
      height,
      largeHeader,
      canvas,
      ctx,
      points,
      target,
      animateHeader = true;

    const initHeader = () => {
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      target = { x: width / 2, y: height / 2 };

      largeHeader = headerRef.current;
      largeHeader.style.height = `${height}px`;

      canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");

      points = [];
      const pointSpacingX = width / 20;
      const pointSpacingY = height / 20;
      for (let x = 0; x < width; x += pointSpacingX) {
        for (let y = 0; y < height; y += pointSpacingY) {
          const px = x + Math.random() * pointSpacingX;
          const py = y + Math.random() * pointSpacingY;
          const p = { x: px, originX: px, y: py, originY: py };
          points.push(p);
        }
      }

      for (let i = 0; i < points.length; i++) {
        const closest = [];
        const p1 = points[i];
        for (let j = 0; j < points.length; j++) {
          const p2 = points[j];
          if (!(p1 === p2)) {
            let placed = false;
            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (closest[k] === undefined) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }

            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
          }
        }
        p1.closest = closest;
      }

      for (let i in points) {
        const c = new Circle(
          points[i],
          2 + Math.random() * 2,
          "rgba(255,255,255,0.3)"
        );
        points[i].circle = c;
      }
    };

    const addListeners = () => {
      if (!("ontouchstart" in window)) {
        window.addEventListener("mousemove", mouseMove);
      }
      window.addEventListener("scroll", scrollCheck);
      window.addEventListener("resize", resize);
    };

    const mouseMove = (e) => {
      target.x = e.clientX + window.scrollX;
      target.y = e.clientY + window.scrollY;
    };

    const scrollCheck = () => {
      animateHeader = true;
    };

    const resize = () => {
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      largeHeader.style.height = `${height}px`;
      canvas.width = width;
      canvas.height = height;

      initHeader();
      initAnimation();
    };

    const initAnimation = () => {
      animate();
      for (let i in points) {
        shiftPoint(points[i]);
      }
    };

    const animate = () => {
      if (animateHeader) {
        ctx.clearRect(0, 0, width, height);
        for (let i in points) {
          if (Math.abs(getDistance(target, points[i])) < 4000) {
            points[i].active = 0.3;
            points[i].circle.active = 0.6;
          } else if (Math.abs(getDistance(target, points[i])) < 20000) {
            points[i].active = 0.1;
            points[i].circle.active = 0.3;
          } else if (Math.abs(getDistance(target, points[i])) < 40000) {
            points[i].active = 0.02;
            points[i].circle.active = 0.1;
          } else {
            points[i].active = 0;
            points[i].circle.active = 0;
          }

          drawLines(points[i]);
          points[i].circle.draw();
        }
      }
      requestAnimationFrame(animate);
    };

    const shiftPoint = (p) => {
      gsap.to(p, {
        duration: 1 + 1 * Math.random(),
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        ease: "circ.inOut",
        onComplete: () => {
          shiftPoint(p);
        },
      });
    };

    const drawLines = (p) => {
      if (!p.active) return;
      for (let i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
        ctx.stroke();
      }
    };

    class Circle {
      constructor(pos, rad, color) {
        this.pos = pos || null;
        this.radius = rad || null;
        this.color = color || null;
      }

      draw() {
        if (!this.active) return;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = `rgba(156,217,249,${this.active})`;
        ctx.fill();
      }
    }

    const getDistance = (p1, p2) => {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    };

    initHeader();
    initAnimation();
    addListeners();

    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newHeight = document.documentElement.scrollHeight;
        if (height !== newHeight) {
          resize();
        }
      }
    });

    resizeObserverRef.current.observe(document.body);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("scroll", scrollCheck);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div id="large-header" className="large-header" ref={headerRef}>
      <canvas id="demo-canvas" ref={canvasRef}></canvas>
      <Outlet />
    </div>
  );
};

export default AnimatedBackground;
