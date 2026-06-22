import { Heart } from "lucide-react";
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
      <p className={cn("text-center text-[9px] uppercase tracking-[4px] text-rose-300")}>
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
              "bg-white/60 backdrop-blur-sm border border-rose-100/60",
            )}
          >
            <span className={cn("text-2xl font-serif text-rose-700 leading-none tabular-nums")}>
              {String(value).padStart(2, "0")}
            </span>
            <span className={cn("text-[9px] text-gray-400 mt-1 uppercase tracking-wide")}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ── floating hearts ───────────────────────────────────────────────────────────

const FloatingHearts = () => {
  const [hearts] = useState(() =>
    [...Array(8)].map((_, i) => ({
      left: `${5 + i * 12}%`,
      size: 12 + (i % 3) * 6,
      color:
        i % 3 === 0
          ? "text-rose-200"
          : i % 3 === 1
            ? "text-pink-200"
            : "text-rose-300",
      duration: 7 + (i % 4) * 2,
      delay: i * 0.9,
    })),
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none")}>
      {hearts.map((h, i) => (
        <motion.div
          key={i}
          className={cn("absolute", h.color)}
          style={{ left: h.left, bottom: "-5%" }}
          animate={{
            y: [0, -(typeof window !== "undefined" ? window.innerHeight * 1.15 : 800)],
          }}
          transition={{ duration: h.duration, repeat: Infinity, delay: h.delay, ease: "linear" }}
        >
          <Heart style={{ width: h.size, height: h.size }} fill="currentColor" opacity={0.45} />
        </motion.div>
      ))}
    </div>
  );
};

// ── ornament ──────────────────────────────────────────────────────────────────

const HeartDivider = () => (
  <div className={cn("flex items-center justify-center gap-1.5")}>
    <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-rose-200")} />
    <Heart className={cn("w-2.5 h-2.5 text-rose-200")} fill="currentColor" />
    <Heart className={cn("w-3.5 h-3.5 text-rose-300")} fill="currentColor" />
    <Heart className={cn("w-2.5 h-2.5 text-rose-200")} fill="currentColor" />
    <div className={cn("h-px flex-1 bg-gradient-to-l from-transparent to-rose-200")} />
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
      {person.firstName}{" "}
      <span className={cn("font-light text-2xl")}>{person.lastName}</span>
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
      style={{ background: "linear-gradient(160deg, #fdf8f6 0%, #fef0f0 50%, #fdf8f6 100%)" }}
    >
      <div className={cn("absolute top-1/4 -left-16 w-56 h-56 bg-rose-100/40 rounded-full blur-3xl")} />
      <div className={cn("absolute bottom-1/4 -right-16 w-56 h-56 bg-pink-100/40 rounded-full blur-3xl")} />

      {!reduceMotion && <FloatingHearts />}

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className={cn("space-y-7 relative z-10 w-full max-w-xs mx-auto")}
      >
        <motion.p
          variants={fade}
          className={cn("text-[9px] uppercase tracking-[5px] text-rose-300")}
        >
          Nikah Davetiyesi
        </motion.p>

        <motion.div variants={scaleIn}>
          <HeartDivider />
        </motion.div>

        {/* Family card */}
        <motion.div
          variants={fadeUp}
          className={cn(
            "bg-white/60 backdrop-blur-sm rounded-3xl border border-rose-100/70 px-6 py-8 space-y-6",
            "shadow-[0_4px_30px_rgba(244,63,94,0.08)]",
          )}
        >
          <PersonBlock person={config.groom} role="oğlu" fadeUp={fadeUp} />

          <div className={cn("flex items-center justify-center gap-3")}>
            <div className={cn("h-px flex-1 bg-rose-100")} />
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: LOOP.pulse, repeat: Infinity, ease: EASE.inOut }
              }
            >
              <Heart className={cn("w-5 h-5 text-rose-400")} fill="currentColor" />
            </motion.div>
            <div className={cn("h-px flex-1 bg-rose-100")} />
          </div>

          <PersonBlock person={config.bride} role="kızı" fadeUp={fadeUp} />
        </motion.div>

        <motion.div variants={scaleIn}>
          <HeartDivider />
        </motion.div>

        <CountdownTimer targetDate={config.nikah.date} scaleIn={scaleIn} />
      </motion.div>
    </section>
  );
}
