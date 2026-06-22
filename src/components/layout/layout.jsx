import { motion } from "framer-motion";
import BottomBar from "@/components/layout/bottom-bar";
import { useMotionPreset } from "@/lib/motion";
import { cn } from "@/lib/utils";

const Layout = ({ children }) => {
  const fade = useMotionPreset("fade");

  return (
    <div
      className={cn(
        "relative min-h-screen w-full md:flex md:items-center md:justify-center",
      )}
    >
      <motion.div
        className={cn(
          "w-full md:max-w-[430px] min-h-screen bg-white relative overflow-hidden md:border md:border-gray-200 md:shadow-lg",
        )}
        variants={fade}
        initial="hidden"
        animate="visible"
      >
        <main className={cn("relative h-full w-full pb-24")}>
          {children}
        </main>
        <BottomBar />
      </motion.div>
    </div>
  );
};

export default Layout;
