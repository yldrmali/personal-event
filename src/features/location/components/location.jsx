import { useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import {
  Clock,
  MapPin,
  CalendarCheck,
  ExternalLink,
  Map,
  Flame,
  Heart,
  CalendarPlus,
  X,
  Chrome,
  Apple,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatEventDate } from "@/lib/format-event-date";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

const isValidEmbedUrl = (url) =>
  typeof url === "string" && url.startsWith("https://www.google.com/maps/embed");

const buildCalendarMeta = (event, label, config) => {
  const title = `${config.bride.firstName} ve ${config.groom.firstName}'nin Düğünü`;
  const description =
    `${label}\n` +
    `${event.location}\n` +
    `${event.address}\n` +
    `${formatEventDate(event.date)} • ${event.startTime} – ${event.endTime}`;
  return { title, description };
};

const googleCalendarLink = (event, label, config) => {
  const { title, description } = buildCalendarMeta(event, label, config);
  const start = new Date(`${event.date}T${event.startTime}:00`);
  const end = new Date(`${event.date}T${event.endTime}:00`);
  const fmt = (d) => d.toISOString().replace(/[-:.]|\d{3}/g, "").slice(0, 15) + "Z";
  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${fmt(start)}/${fmt(end)}` +
    `&location=${encodeURIComponent(event.address)}` +
    `&details=${encodeURIComponent(description)}`
  );
};

const generateICS = (event, label, config) => {
  const { title, description } = buildCalendarMeta(event, label, config);
  const start = new Date(`${event.date}T${event.startTime}:00`);
  const end = new Date(`${event.date}T${event.endTime}:00`);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return (
    `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n` +
    `DTSTART:${fmt(start)}\nDTEND:${fmt(end)}\n` +
    `SUMMARY:${title}\n` +
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}\n` +
    `LOCATION:${event.address}\n` +
    `END:VEVENT\nEND:VCALENDAR`
  );
};

const downloadICS = (event, label, config) => {
  const { title } = buildCalendarMeta(event, label, config);
  const blob = new Blob([generateICS(event, label, config)], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title.toLowerCase().replace(/ /g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ── calendar modal ────────────────────────────────────────────────────────────

const CalendarModal = ({ isOpen, onClose, event, label, config }) => {
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const { title } = buildCalendarMeta(event, label, config);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className={cn("fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]")}
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn("fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[88%] max-w-sm")}
          >
            <div className={cn("bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-5")}>
              <div className={cn("flex justify-between items-center")}>
                <h3 className={cn("text-base font-serif text-gray-800")}>Takvime Ekle</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={cn("text-gray-400 hover:text-gray-600 p-1")}
                >
                  <X className={cn("w-4 h-4")} />
                </motion.button>
              </div>

              <p className={cn("text-xs text-gray-400 -mt-2")}>{title}</p>

              <div className={cn("space-y-2.5")}>
                {[
                  {
                    icon: Chrome,
                    label: "Google Takvim",
                    color: "text-rose-500",
                    action: () => window.open(googleCalendarLink(event, label, config), "_blank"),
                  },
                  {
                    icon: Apple,
                    label: "Apple Takvim",
                    color: "text-gray-900",
                    action: () => downloadICS(event, label, config),
                  },
                  {
                    icon: CalendarIcon,
                    label: "Outlook Takvim",
                    color: "text-blue-500",
                    action: () => downloadICS(event, label, config),
                  },
                ].map(({ icon: Icon, label: optionLabel, color, action }) => (
                  <motion.button
                    key={optionLabel}
                    whileTap={{ scale: 0.98 }}
                    onClick={action}
                    className={cn(
                      "flex items-center gap-3 w-full p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left",
                    )}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0", color)} />
                    <span className={cn("text-sm font-medium text-gray-700")}>{optionLabel}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── venue card ────────────────────────────────────────────────────────────────

const VenueCard = ({ label, icon: Icon, accentClass, event, fadeUp, config }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn("space-y-4")}
      >
        {/* Map or fallback */}
        {isValidEmbedUrl(event.maps_embed) ? (
          <div className={cn("w-full h-52 rounded-2xl overflow-hidden shadow-md border-4 border-white")}>
            <iframe
              src={event.maps_embed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${label} konum haritası`}
            />
          </div>
        ) : (
          <a
            href={event.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex flex-col items-center justify-center gap-3 w-full h-52 rounded-2xl",
              "border-2 border-dashed border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors",
            )}
          >
            <Map className={cn("w-7 h-7 text-rose-300")} />
            <span className={cn("text-sm font-medium text-rose-400")}>Haritada Aç</span>
          </a>
        )}

        {/* Details */}
        <div className={cn("bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-rose-100/60 space-y-4")}>
          <div className={cn("flex items-center gap-2.5")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", accentClass.bg)}>
              <Icon className={cn("w-4 h-4", accentClass.icon)} />
            </div>
            <div>
              <p className={cn("text-[9px] uppercase tracking-[3px] font-semibold", accentClass.icon)}>{label}</p>
              <h3 className={cn("text-base font-serif text-gray-800 leading-tight")}>{event.location}</h3>
            </div>
          </div>

          <div className={cn("space-y-2.5 text-sm text-gray-500")}>
            <div className={cn("flex items-start gap-3")}>
              <MapPin className={cn("w-4 h-4 text-rose-300 mt-0.5 shrink-0")} />
              <p>{event.address}</p>
            </div>
            <div className={cn("flex items-center gap-3")}>
              <CalendarCheck className={cn("w-4 h-4 text-rose-300 shrink-0")} />
              <p>{formatEventDate(event.date)}</p>
            </div>
            <div className={cn("flex items-center gap-3")}>
              <Clock className={cn("w-4 h-4 text-rose-300 shrink-0")} />
              <p>{event.startTime} – {event.endTime}</p>
            </div>
          </div>

          {/* Two action buttons */}
          <div className={cn("grid grid-cols-2 gap-2")}>
            <motion.a
              href={event.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors",
                accentClass.btn,
              )}
            >
              <ExternalLink className={cn("w-3.5 h-3.5")} />
              Yol Tarifi
            </motion.a>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCalendar(true)}
              className={cn(
                "flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors",
                "bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 active:bg-rose-100",
              )}
            >
              <CalendarPlus className={cn("w-3.5 h-3.5")} />
              Takvime Ekle
            </motion.button>
          </div>
        </div>
      </motion.div>

      <CalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        event={event}
        label={label}
        config={config}
      />
    </>
  );
};

// ── main ──────────────────────────────────────────────────────────────────────

export default function Location() {
  const config = useConfig();
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  return (
    <section
      id="location"
      className={cn("relative overflow-hidden")}
      style={{ background: "linear-gradient(160deg, #fdf8f6 0%, #fef0f0 50%, #fdf8f6 100%)" }}
    >
      <div className={cn("container mx-auto px-5 py-16 relative z-10")}>
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={cn("text-center space-y-3 mb-12")}
        >
          <motion.span variants={fadeUp} className={cn("inline-block text-rose-400 font-medium text-sm")}>
            Mekan Bilgileri
          </motion.span>
          <motion.h2 variants={fadeUp} className={cn("text-3xl font-serif text-gray-800")}>
            Konumlar
          </motion.h2>
          <motion.div variants={scaleIn} className={cn("flex items-center justify-center gap-4 pt-2")}>
            <div className={cn("h-px w-10 bg-rose-200")} />
            <MapPin className={cn("w-4 h-4 text-rose-300")} />
            <div className={cn("h-px w-10 bg-rose-200")} />
          </motion.div>
        </motion.div>

        <div className={cn("max-w-sm mx-auto space-y-10")}>
          <VenueCard
            label="Kına Gecesi"
            icon={Flame}
            accentClass={{
              bg: "bg-orange-100",
              icon: "text-orange-500",
              btn: "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700",
            }}
            event={config.kina}
            fadeUp={fadeUp}
            config={config}
          />
          <VenueCard
            label="Nikah Töreni"
            icon={Heart}
            accentClass={{
              bg: "bg-rose-100",
              icon: "text-rose-500",
              btn: "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700",
            }}
            event={config.nikah}
            fadeUp={fadeUp}
            config={config}
          />
        </div>
      </div>
    </section>
  );
}
