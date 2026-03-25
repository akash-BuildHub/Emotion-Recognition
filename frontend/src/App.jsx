import { useRef, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

import robotImage from "./assets/images/robot_image.png";
import angryEmoji from "./assets/icons/angry.png";
import thinkingEmoji from "./assets/icons/thinking.png";
import surpriseEmoji from "./assets/icons/suprise.png";
import cryEmoji from "./assets/icons/cry.png";
import fearEmoji from "./assets/icons/fear.png";
import happyEmoji from "./assets/icons/happy.png";
import sadEmoji from "./assets/icons/sad.png";

/* ── Emoji thread config ── */
const EMOJIS = [
  { src: happyEmoji, alt: "Happy", left: "20%", threadH: 210 },
  { src: thinkingEmoji, alt: "Thinking", left: "30%", threadH: 308 },
  { src: fearEmoji, alt: "Scared", left: "36.5%", threadH: 150 },
  { src: angryEmoji, alt: "Angry", left: "43%", threadH: 415, imgOffset: -14 },
  { src: surpriseEmoji, alt: "Surprised", left: "50%", threadH: 160 },
  { src: sadEmoji, alt: "Sad", left: "57%", threadH: 270 },
  { src: cryEmoji, alt: "Crying", left: "65%", threadH: 200 },
];

/* ── Particle data ── */
const PARTICLES = [
  { w: 6, color: "rgba(100,200,255,0.6)", top: "40%", right: "18%", delay: 0 },
  { w: 4, color: "rgba(180,100,255,0.5)", top: "55%", right: "12%", delay: 1.2 },
  { w: 8, color: "rgba(100,220,255,0.4)", top: "30%", right: "22%", delay: 0.6 },
  { w: 5, color: "rgba(220,100,255,0.5)", top: "65%", right: "8%", delay: 2.0 },
  { w: 3, color: "rgba(140,200,255,0.6)", top: "48%", right: "26%", delay: 1.8 },
  { w: 7, color: "rgba(200,140,255,0.4)", top: "35%", right: "15%", delay: 0.4 },
];

/* ── Hanging Emoji Component ── */
function HangingEmoji({ src, alt, left, threadH, mouseX, imgOffset = -2 }) {
  const springConfig = { stiffness: 80, damping: 12, mass: 0.8 };
  const rotation = useSpring(0, springConfig);

  // Convert left % to a numeric value for distance calculation
  const leftNum = parseFloat(left);

  // Transform mouse X position to rotation based on proximity
  const handleMouseInfluence = useCallback(
    (mx) => {
      if (mx === null) {
        rotation.set(0);
        return;
      }
      const emojiCenter = (leftNum / 100) * window.innerWidth;
      const distance = mx - emojiCenter;
      const maxDist = 300;
      const influence = Math.max(0, 1 - Math.abs(distance) / maxDist);
      const angle = (distance / maxDist) * 25 * influence;
      rotation.set(angle);
    },
    [leftNum, rotation]
  );

  // Use ref to store latest handler
  const handlerRef = useRef(handleMouseInfluence);
  handlerRef.current = handleMouseInfluence;

  // Subscribe to mouseX changes
  useTransform(mouseX, (v) => {
    handlerRef.current(v);
    return v;
  });

  return (
    <motion.div
      className="emoji-thread"
      style={{
        left,
        rotate: rotation,
      }}
    >
      <div className="thread-line" style={{ height: threadH }} />
      <motion.img
        src={src}
        alt={alt}
        className="emoji-img"
        style={{ marginTop: `${imgOffset}px` }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 2.5 + Math.random(),
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

/* ── Main App ── */
function App() {
  const mouseX = useSpring(null, { stiffness: 100, damping: 20 });

  const handleMouseMove = useCallback(
    (e) => {
      mouseX.set(e.clientX);
    },
    [mouseX]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(null);
  }, [mouseX]);

  return (
    <div
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Left Content ── */}
      <div className="relative z-10 flex flex-col justify-center px-[6%] mt-[27vh] max-w-[50%] max-md:max-w-[90%]">
        <h1 className="hero-heading">
          ꜰᴀᴄᴇ ᴇᴍᴏᴛɪᴏɴ ʀᴇᴄᴏɢɴɪᴛɪᴏɴ
        </h1>
        <p className="mt-4 text-[#c9c3d4]/80 text-base md:text-lg leading-relaxed max-w-[480px]">
          Read the Face. Reveal the Feeling
        </p>
        <div className="mt-8">
          <button type="button" className="cta-button">
            Start Recognize
          </button>
        </div>
      </div>

      {/* ── Hanging Emojis ── */}
      {EMOJIS.map((emoji) => (
        <HangingEmoji key={emoji.alt} {...emoji} mouseX={mouseX} />
      ))}

      {/* ── Robot ── */}
      <motion.div
        className="robot-container"
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img src={robotImage} alt="AI Robot" className="robot-image" />
      </motion.div>

      {/* ── Glowing Particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.w,
            height: p.w,
            background: p.color,
            top: p.top,
            right: p.right,
            boxShadow: `0 0 ${p.w * 3}px ${p.color}`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default App;
