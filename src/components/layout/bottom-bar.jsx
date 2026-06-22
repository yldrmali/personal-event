import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DURATION, useReducedMotionFlag } from "@/lib/motion";

const menuItems = [
  { icon: Home, label: "Ana Sayfa", href: "#home", id: "home" },
  { icon: MapPin, label: "Konum", href: "#location", id: "location" },
];

const BottomBar = () => {
  const [active, setActive] = React.useState("home");
  const reduceMotion = useReducedMotionFlag();

  const handleMenuClick = useCallback((e, href, id) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      setActive(id);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (menuItems.find((item) => item.id === sectionId)) {
              setActive(sectionId);
            }
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -80% 0px", threshold: 0 },
    );

    menuItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4",
      )}
    >
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: DURATION.base }
            : { duration: DURATION.base, type: "spring", stiffness: 100 }
        }
      >
        <div
          className={cn(
            "backdrop-blur-md bg-white/90 border border-gray-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.07)] px-2 py-2",
          )}
        >
          <nav className={cn("flex items-center gap-1")}>
            {menuItems.map((item) => (
              <motion.a
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 px-4 rounded-xl transition-all duration-300",
                  "active:bg-gray-100 cursor-pointer min-w-[72px]",
                  active === item.id ? "bg-rose-50" : "hover:bg-gray-50/80",
                )}
                whileTap={{ scale: 0.93 }}
                onClick={(e) => handleMenuClick(e, item.href, item.id)}
              >
                <motion.div
                  animate={{ scale: active === item.id ? 1.1 : 1 }}
                  transition={{ duration: DURATION.fast }}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 mb-1 transition-all duration-300",
                      active === item.id
                        ? "stroke-rose-500 stroke-[2.5px]"
                        : "stroke-gray-500 stroke-2",
                    )}
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-[11px] font-medium transition-all duration-300",
                    active === item.id ? "text-rose-500" : "text-gray-500",
                  )}
                >
                  {item.label}
                </span>
              </motion.a>
            ))}
          </nav>
        </div>
      </motion.div>
    </div>
  );
};

export default BottomBar;
