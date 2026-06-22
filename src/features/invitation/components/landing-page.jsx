import { useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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

// ── decorative components ─────────────────────────────────────────────────────

const FloatingHearts = () => {
  const [hearts] = useState(() =>
    [...Array(10)].map((_, i) => ({
      left: `${8 + i * 9}%`,
      size: 10 + (i % 3) * 6,
      color:
        i % 3 === 0
          ? "text-rose-200"
          : i % 3 === 1
            ? "text-pink-200"
            : "text-rose-300",
      duration: 6 + (i % 4) * 2,
      delay: i * 0.8,
    })),
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none")}>
      {hearts.map((h, i) => (
        <motion.div
          key={i}
          className={cn("absolute", h.color)}
          style={{ left: h.left, bottom: "-5%" }}
          animate={{ y: [0, -(typeof window !== "undefined" ? window.innerHeight * 1.15 : 800)] }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "linear",
          }}
        >
          <Heart
            style={{ width: h.size, height: h.size }}
            fill="currentColor"
            opacity={0.5}
          />
        </motion.div>
      ))}
    </div>
  );
};

const HeartDivider = ({ className }) => (
  <div className={cn("flex items-center justify-center gap-1.5", className)}>
    <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-rose-200")} />
    <Heart className={cn("w-2.5 h-2.5 text-rose-200")} fill="currentColor" />
    <Heart className={cn("w-3.5 h-3.5 text-rose-300")} fill="currentColor" />
    <Heart className={cn("w-2.5 h-2.5 text-rose-200")} fill="currentColor" />
    <div className={cn("h-px flex-1 bg-gradient-to-l from-transparent to-rose-200")} />
  </div>
);

// ── event date display ────────────────────────────────────────────────────────

const EventColumn = ({ label, event }) => {
  const { day, month, year, weekday } = parseDate(event.date);
  return (
    <div className={cn("flex-1 flex flex-col items-center gap-2 text-center")}>
      <p className={cn("text-[9px] uppercase tracking-[3px] text-rose-400 font-semibold")}>
        {label}
      </p>

      <div className={cn("h-px w-8 bg-rose-200")} />

      <div className={cn("space-y-0")}>
        <p className={cn("text-5xl font-serif text-gray-800 leading-none tabular-nums")}>
          {day}
        </p>
        <p className={cn("text-sm text-gray-600 font-medium capitalize mt-1")}>
          {month}
        </p>
        <p className={cn("text-xs text-gray-400")}>{year}</p>
      </div>

      <div className={cn("h-px w-8 bg-rose-100")} />

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
      style={{ background: "linear-gradient(160deg, #fdf8f6 0%, #fef0f0 50%, #fdf8f6 100%)" }}
    >
      {/* Soft glow blobs */}
      <div className={cn("absolute top-1/4 -left-20 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl")} />
      <div className={cn("absolute bottom-1/4 -right-20 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl")} />

      {/* Floating hearts */}
      {!reduceMotion && <FloatingHearts />}

      {/* Content */}
      <div className={cn("relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12")}>
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className={cn("w-full max-w-xs")}
        >

          {/* Label */}
          <motion.p
            variants={fade}
            className={cn("text-center text-[10px] uppercase tracking-[5px] text-rose-300 mb-6")}
          >
            Nikah Davetiyesi
          </motion.p>

          {/* Top ornament */}
          <motion.div variants={scaleIn}>
            <HeartDivider className={cn("mb-8")} />
          </motion.div>

          {/* Couple names */}
          <motion.div variants={fadeUp} className={cn("text-center mb-8")}>
            <h1
              className={cn(
                "font-serif text-gray-800 leading-none",
              )}
              style={{ fontSize: "clamp(2.5rem, 10vw, 3.5rem)" }}
            >
              {config.bride.firstName}
            </h1>
            <motion.p
              animate={reduceMotion ? undefined : { scale: [1, 1.12, 1] }}
              transition={reduceMotion ? undefined : { duration: LOOP.pulse, repeat: Infinity, ease: EASE.inOut }}
              className={cn("font-serif text-rose-300 my-2")}
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

          {/* Bottom ornament */}
          <motion.div variants={scaleIn}>
            <HeartDivider className={cn("mb-8")} />
          </motion.div>

          {/* Dates */}
          <motion.div variants={fadeUp} className={cn("flex items-center mb-8")}>
            <EventColumn label="Kına" event={config.kina} />

            {/* Vertical divider */}
            <div className={cn("flex flex-col items-center gap-1 self-stretch py-2 mx-3")}>
              <div className={cn("flex-1 w-px bg-rose-100")} />
              <motion.div
                animate={reduceMotion ? undefined : { scale: [1, 1.2, 1] }}
                transition={reduceMotion ? undefined : { duration: LOOP.pulse, repeat: Infinity, ease: EASE.inOut }}
              >
                <Heart className={cn("w-3 h-3 text-rose-300")} fill="currentColor" />
              </motion.div>
              <div className={cn("flex-1 w-px bg-rose-100")} />
            </div>

            <EventColumn label="Nikah" event={config.nikah} />
          </motion.div>

          {/* CTA button */}
          <motion.div variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenInvitation}
              className={cn(
                "w-full py-4 rounded-2xl text-sm font-medium tracking-wide",
                "bg-rose-500 text-white",
                "shadow-[0_6px_24px_rgba(244,63,94,0.30)]",
                "hover:bg-rose-600 transition-colors duration-300",
                "flex items-center justify-center gap-3",
              )}
            >
              <Heart className={cn("w-3.5 h-3.5")} fill="currentColor" />
              <span>Davetiyeyi Aç</span>
              <Heart className={cn("w-3.5 h-3.5")} fill="currentColor" />
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
