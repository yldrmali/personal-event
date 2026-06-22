import { useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  EASE,
  useReducedMotionFlag,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── helpers ──────────────────────────────────────────────────────────────────

const parseDate = (isoDate) => {
  const d = new Date(isoDate);
  const tz = "Europe/Istanbul";
  return {
    day: d.toLocaleDateString("tr-TR", { day: "2-digit", timeZone: tz }),
    month: d.toLocaleDateString("tr-TR", { month: "long", timeZone: tz }),
    year: d.toLocaleDateString("tr-TR", { year: "numeric", timeZone: tz }),
    weekday: d.toLocaleDateString("tr-TR", { weekday: "long", timeZone: tz }),
  };
};

// ── olive branch corner svg ───────────────────────────────────────────────────

const OliveBranch = ({ style }) => (
  <svg
    viewBox="0 0 170 170"
    className="w-full h-full"
    style={style}
    fill="none"
  >
    {/* Main stems */}
    <path d="M 0 18 C 35 15 75 14 115 16 C 138 17 155 18 170 17" stroke="#4E6228" strokeWidth="1.7" strokeLinecap="round"/>
    <path d="M 18 0 C 15 35 14 75 16 115 C 17 138 18 155 17 170" stroke="#4E6228" strokeWidth="1.7" strokeLinecap="round"/>
    {/* Inner diagonal sub-branch */}
    <path d="M 22 22 C 38 42 54 60 64 78" stroke="#5D7230" strokeWidth="1.1" strokeLinecap="round"/>
    {/* Small branch off horizontal */}
    <path d="M 78 16 C 84 8 90 3 98 1" stroke="#5D7230" strokeWidth="1.0" strokeLinecap="round"/>

    {/* Leaves on horizontal branch – alternating above/below */}
    {[30, 52, 74, 96, 118, 142].map((x, i) => (
      i % 2 === 0 ? (
        <path key={`h${x}`}
          d={`M ${x} 18 C ${x-5} 27 ${x-4} 34 ${x} 36 C ${x+4} 34 ${x+5} 27 ${x} 18 Z`}
          fill={i % 3 === 0 ? "#8BA052" : "#7A9245"} opacity="0.82"/>
      ) : (
        <path key={`h${x}`}
          d={`M ${x} 18 C ${x-5} 9 ${x-4} 2 ${x} 0 C ${x+4} 2 ${x+5} 9 ${x} 18 Z`}
          fill={i % 3 === 1 ? "#6B8038" : "#7A9245"} opacity="0.80"/>
      )
    ))}

    {/* Leaves on vertical branch – alternating right/left */}
    {[30, 52, 74, 96, 118, 142].map((y, i) => (
      i % 2 === 0 ? (
        <path key={`v${y}`}
          d={`M 18 ${y} C 27 ${y-5} 34 ${y-4} 36 ${y} C 34 ${y+4} 27 ${y+5} 18 ${y} Z`}
          fill={i % 3 === 0 ? "#8BA052" : "#7A9245"} opacity="0.82"/>
      ) : (
        <path key={`v${y}`}
          d={`M 18 ${y} C 9 ${y-5} 2 ${y-4} 0 ${y} C 2 ${y+4} 9 ${y+5} 18 ${y} Z`}
          fill={i % 3 === 1 ? "#6B8038" : "#7A9245"} opacity="0.80"/>
      )
    ))}

    {/* Leaves on diagonal sub-branch */}
    <path d="M 30 32 C 22 26 20 18 25 14 C 32 17 34 26 30 32 Z" fill="#7A9245" opacity="0.85"/>
    <path d="M 34 28 C 42 20 50 20 52 25 C 48 32 38 32 34 28 Z" fill="#8BA052" opacity="0.82"/>
    <path d="M 46 50 C 36 46 34 38 38 33 C 46 36 50 46 46 50 Z" fill="#6B8038" opacity="0.85"/>
    <path d="M 50 48 C 58 40 66 40 68 45 C 64 52 54 52 50 48 Z" fill="#7A9245" opacity="0.82"/>
    <path d="M 58 66 C 50 62 48 55 52 50 C 60 53 62 62 58 66 Z" fill="#8BA052" opacity="0.80"/>
    <path d="M 62 64 C 70 56 78 57 79 62 C 76 69 66 69 62 64 Z" fill="#7A9245" opacity="0.78"/>

    {/* Olive berries – horizontal branch */}
    {[42, 63, 85, 107, 130].map((x) => (
      <circle key={`bh${x}`} cx={x} cy={17} r="2.3" fill="#9BB840" opacity="0.55"/>
    ))}
    {/* Olive berries – vertical branch */}
    {[42, 63, 85, 107, 130].map((y) => (
      <circle key={`bv${y}`} cx={17} cy={y} r="2.3" fill="#9BB840" opacity="0.55"/>
    ))}
    {/* Berries on diagonal */}
    <circle cx="40" cy="40" r="2.5" fill="#A8C040" opacity="0.52"/>
    <circle cx="54" cy="60" r="2" fill="#9BB840" opacity="0.52"/>

    {/* Corner 5-petal flower at (18, 18) */}
    <g transform="translate(18,18)">
      {[0, 72, 144, 216, 288].map((rot) => (
        <g key={`p${rot}`} transform={`rotate(${rot})`}>
          <ellipse cx="0" cy="-7" rx="2.5" ry="4.5" fill="#C8E878" opacity="0.88"/>
        </g>
      ))}
      <circle r="3.5" fill="#EDD840" opacity="0.92"/>
      <circle r="1.5" fill="#C8A820" opacity="0.80"/>
    </g>

    {/* Tiny 3-petal flower at sub-branch tip */}
    <g transform="translate(98,1)">
      {[0, 120, 240].map((rot) => (
        <g key={`sp${rot}`} transform={`rotate(${rot})`}>
          <ellipse cx="0" cy="-5" rx="2" ry="3.5" fill="#D8F0A0" opacity="0.85"/>
        </g>
      ))}
      <circle r="2.5" fill="#EDD840" opacity="0.82"/>
    </g>
  </svg>
);

// ── balloon svg ───────────────────────────────────────────────────────────────

const BalloonSvg = ({ size, className }) => (
  <svg
    width={size}
    height={Math.round(size * 1.5)}
    viewBox="0 0 20 30"
    className={className}
    fill="currentColor"
  >
    <ellipse cx="10" cy="10" rx="9" ry="10" />
    <polygon points="8.5,19.5 11.5,19.5 10,22" />
    <path d="M10 22 Q7 25.5 10 29" fill="none" stroke="currentColor" strokeWidth="0.9" />
  </svg>
);

// ── decorative components ─────────────────────────────────────────────────────

const FloatingBalloons = () => {
  const [balloons] = useState(() =>
    [...Array(10)].map((_, i) => ({
      left: `${6 + i * 9}%`,
      size: 14 + (i % 3) * 6,
      colorClass:
        i % 5 === 0
          ? "text-amber-400"
          : i % 5 === 1
            ? "text-orange-300"
            : i % 5 === 2
              ? "text-yellow-400"
              : i % 5 === 3
                ? "text-amber-300"
                : "text-orange-400",
      duration: 7 + (i % 4) * 2,
      delay: i * 0.8,
    })),
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none")}>
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          className={cn("absolute", b.colorClass)}
          style={{ left: b.left, bottom: "-5%" }}
          animate={{ y: [0, -(typeof window !== "undefined" ? window.innerHeight * 1.15 : 800)] }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "linear",
          }}
        >
          <BalloonSvg size={b.size} />
        </motion.div>
      ))}
    </div>
  );
};

const FlowerDivider = ({ className }) => (
  <div className={cn("flex items-center justify-center gap-1.5", className)}>
    <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-[#C8D4A0]")} />
    <Flower2 className={cn("w-2.5 h-2.5 text-[#C8D4A0]")} />
    <Flower2 className={cn("w-3.5 h-3.5 text-[#8BA052]")} />
    <Flower2 className={cn("w-2.5 h-2.5 text-[#C8D4A0]")} />
    <div className={cn("h-px flex-1 bg-gradient-to-l from-transparent to-[#C8D4A0]")} />
  </div>
);

// ── event date display ────────────────────────────────────────────────────────

const EventColumn = ({ label, event }) => {
  const { day, month, year, weekday } = parseDate(event.date);
  return (
    <div className={cn("flex-1 flex flex-col items-center gap-2 text-center")}>
      <p className={cn("text-[9px] uppercase tracking-[3px] font-semibold text-[#6B7A3A]")}>
        {label}
      </p>

      <div className={cn("h-px w-8 bg-[#C8D4A0]")} />

      <div className={cn("space-y-0")}>
        <p className={cn("text-5xl font-serif text-gray-800 leading-none tabular-nums")}>
          {day}
        </p>
        <p className={cn("text-sm text-gray-600 font-medium capitalize mt-1")}>
          {month}
        </p>
        <p className={cn("text-xs text-gray-400")}>{year}</p>
      </div>

      <div className={cn("h-px w-8 bg-[#DCE8C0]")} />

      <div className={cn("space-y-0.5")}>
        <p className={cn("text-[10px] text-gray-400 capitalize")}>{weekday}</p>
        <p className={cn("text-[11px] font-medium text-gray-500")}>
          {event.startTime} – {event.endTime}
        </p>
      </div>
    </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────

const LandingPage = ({ onOpenInvitation }) => {
  const config = useConfig();
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="visible"
      className={cn("min-h-screen relative overflow-hidden")}
      style={{ background: "linear-gradient(160deg, #fdfcf8 0%, #f5efe3 50%, #fdfcf8 100%)" }}
    >
      {/* Olive branch corner decorations */}
      <div className="absolute top-0 left-0 w-44 h-44 pointer-events-none opacity-70">
        <OliveBranch />
      </div>
      <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none opacity-70">
        <OliveBranch style={{ transform: "scaleX(-1)" }} />
      </div>
      <div className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none opacity-70">
        <OliveBranch style={{ transform: "scaleY(-1)" }} />
      </div>
      <div className="absolute bottom-0 right-0 w-44 h-44 pointer-events-none opacity-70">
        <OliveBranch style={{ transform: "scale(-1,-1)" }} />
      </div>

      {/* Soft glow blobs */}
      <div className={cn("absolute top-1/4 -left-20 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl")} />
      <div className={cn("absolute bottom-1/4 -right-20 w-64 h-64 bg-yellow-50/50 rounded-full blur-3xl")} />

      {!reduceMotion && <FloatingBalloons />}

      <div className={cn("relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12")}>
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className={cn("w-full max-w-xs")}
        >

          <motion.p
            variants={fade}
            className={cn("text-center text-[10px] uppercase tracking-[5px] text-[#8BA052] mb-6")}
          >
            Nikah Davetiyesi
          </motion.p>

          <motion.div variants={scaleIn}>
            <FlowerDivider className={cn("mb-8")} />
          </motion.div>

          <motion.div variants={fadeUp} className={cn("text-center mb-8")}>
            <h1
              className={cn("font-serif text-gray-800 leading-none")}
              style={{ fontSize: "clamp(2.5rem, 10vw, 3.5rem)" }}
            >
              {config.bride.firstName}
            </h1>
            <motion.p
              animate={reduceMotion ? undefined : { scale: [1, 1.12, 1] }}
              transition={reduceMotion ? undefined : { duration: LOOP.pulse, repeat: Infinity, ease: EASE.inOut }}
              className={cn("font-serif text-[#8BA052] my-2")}
              style={{ fontSize: "clamp(1.75rem, 7vw, 2.5rem)" }}
            >
              &amp;
            </motion.p>
            <h1
              className={cn("font-serif text-gray-800 leading-none")}
              style={{ fontSize: "clamp(2.5rem, 10vw, 3.5rem)" }}
            >
              {config.groom.firstName}
            </h1>
          </motion.div>

          <motion.div variants={scaleIn}>
            <FlowerDivider className={cn("mb-8")} />
          </motion.div>

          <motion.div variants={fadeUp} className={cn("flex items-center mb-8")}>
            <EventColumn label="Kına" event={config.kina} />

            <div className={cn("flex flex-col items-center gap-1 self-stretch py-2 mx-3")}>
              <div className={cn("flex-1 w-px bg-[#DCE8C0]")} />
              <motion.div
                animate={reduceMotion ? undefined : { scale: [1, 1.2, 1] }}
                transition={reduceMotion ? undefined : { duration: LOOP.pulse, repeat: Infinity, ease: EASE.inOut }}
              >
                <Flower2 className={cn("w-3 h-3 text-[#8BA052]")} />
              </motion.div>
              <div className={cn("flex-1 w-px bg-[#DCE8C0]")} />
            </div>

            <EventColumn label="Nikah" event={config.nikah} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenInvitation}
              className={cn(
                "w-full py-4 rounded-2xl text-sm font-medium tracking-wide",
                "bg-[#6B7A3A] text-white",
                "shadow-[0_6px_24px_rgba(107,122,58,0.32)]",
                "hover:bg-[#5A6830] transition-colors duration-300",
                "flex items-center justify-center gap-3",
              )}
            >
              <Flower2 className={cn("w-3.5 h-3.5")} />
              <span>Davetiyeyi Aç</span>
              <Flower2 className={cn("w-3.5 h-3.5")} />
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
