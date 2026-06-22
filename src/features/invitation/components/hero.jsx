import { Flower2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/features/invitation/hooks/use-config";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  EASE,
  useReducedMotionFlag,
} from "@/lib/motion";

// ── countdown ─────────────────────────────────────────────────────────────────

const CountdownTimer = ({ targetDate, scaleIn }) => {
  const calculateTimeLeft = useCallback(() => {
    const diff = +new Date(targetDate) - +new Date();
    if (diff <= 0) return {};
    return {
      Gün: Math.floor(diff / (1000 * 60 * 60 * 24)),
      Saat: Math.floor((diff / (1000 * 60 * 60)) % 24),
      Dakika: Math.floor((diff / 1000 / 60) % 60),
      Saniye: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const entries = Object.entries(timeLeft);
  if (entries.length === 0) return null;

  return (
    <div className={cn("w-full space-y-3")}>
      <p className={cn("text-center text-[9px] uppercase tracking-[4px] text-[#8BA052]")}>
        Nikaha Kalan
      </p>
      <div className={cn("grid grid-cols-4 gap-2")}>
        {entries.map(([label, value]) => (
          <motion.div
            key={label}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className={cn(
              "flex flex-col items-center py-3 rounded-2xl",
              "bg-white/60 backdrop-blur-sm border border-[#DCE8C0]/60",
            )}
          >
            <span className={cn("text-2xl font-serif text-[#4E6228] leading-none tabular-nums")}>
              {String(value).padStart(2, "0")}
            </span>
            <span className={cn("text-[9px] text-gray-400 mt-1 uppercase tracking-wide")}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

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

// ── floating balloons ─────────────────────────────────────────────────────────

const FloatingBalloons = () => {
  const [balloons] = useState(() =>
    [...Array(8)].map((_, i) => ({
      left: `${5 + i * 12}%`,
      size: 12 + (i % 3) * 6,
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
      delay: i * 0.9,
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
          transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" }}
        >
          <BalloonSvg size={b.size} />
        </motion.div>
      ))}
    </div>
  );
};

// ── ornament ──────────────────────────────────────────────────────────────────

const FlowerDivider = () => (
  <div className={cn("flex items-center justify-center gap-1.5")}>
    <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-[#C8D4A0]")} />
    <Flower2 className={cn("w-2.5 h-2.5 text-[#C8D4A0]")} />
    <Flower2 className={cn("w-3.5 h-3.5 text-[#8BA052]")} />
    <Flower2 className={cn("w-2.5 h-2.5 text-[#C8D4A0]")} />
    <div className={cn("h-px flex-1 bg-gradient-to-l from-transparent to-[#C8D4A0]")} />
  </div>
);

// ── person block ──────────────────────────────────────────────────────────────

const PersonBlock = ({ person, role, fadeUp }) => (
  <motion.div variants={fadeUp} className={cn("text-center space-y-1.5")}>
    <p className={cn("text-[11px] text-gray-400 leading-relaxed")}>
      <span className={cn("text-gray-500")}>{person.mother}</span>
      {" & "}
      <span className={cn("text-gray-500")}>{person.father}</span>
      {role === "oğlu" ? "'nin değerli oğlu" : "'nin değerli kızı"}
    </p>
    <p className={cn("text-3xl font-serif text-gray-800 leading-tight")}>
      {person.firstName}{" "}{person.lastName}
    </p>
  </motion.div>
);

// ── main ──────────────────────────────────────────────────────────────────────

export default function Hero() {
  const config = useConfig();
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  return (
    <section
      id="home"
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden",
      )}
      style={{ background: "linear-gradient(160deg, #fdfcf8 0%, #f5efe3 50%, #fdfcf8 100%)" }}
    >
      <div className={cn("absolute top-1/4 -left-16 w-56 h-56 bg-amber-100/40 rounded-full blur-3xl")} />
      <div className={cn("absolute bottom-1/4 -right-16 w-56 h-56 bg-yellow-50/50 rounded-full blur-3xl")} />

      {!reduceMotion && <FloatingBalloons />}

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className={cn("space-y-7 relative z-10 w-full max-w-xs mx-auto")}
      >
        <motion.p
          variants={fade}
          className={cn("text-[9px] uppercase tracking-[5px] text-[#8BA052]")}
        >
          Nikah Davetiyesi
        </motion.p>

        <motion.div variants={scaleIn}>
          <FlowerDivider />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={cn(
            "bg-white/60 backdrop-blur-sm rounded-3xl border border-[#DCE8C0]/70 px-6 py-8 space-y-6",
            "shadow-[0_4px_30px_rgba(107,122,58,0.08)]",
          )}
        >
          <PersonBlock person={config.bride} role="kızı" fadeUp={fadeUp} />

          <div className={cn("flex items-center justify-center gap-3")}>
            <div className={cn("h-px flex-1 bg-[#DCE8C0]")} />
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: LOOP.pulse, repeat: Infinity, ease: EASE.inOut }
              }
            >
              <Flower2 className={cn("w-5 h-5 text-[#8BA052]")} />
            </motion.div>
            <div className={cn("h-px flex-1 bg-[#DCE8C0]")} />
          </div>

          <PersonBlock person={config.groom} role="oğlu" fadeUp={fadeUp} />
        </motion.div>

        <motion.div variants={scaleIn}>
          <FlowerDivider />
        </motion.div>

        <CountdownTimer targetDate={config.nikah.date} scaleIn={scaleIn} />
      </motion.div>
    </section>
  );
}
