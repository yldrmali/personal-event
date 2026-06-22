import { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMotionPreset } from "@/lib/motion";
import { cn } from "@/lib/utils";

const Layout = lazy(() => import("@/components/layout/layout"));
const MainContent = lazy(
  () => import("@/features/invitation/components/main-content"),
);
const LandingPage = lazy(
  () => import("@/features/invitation/components/landing-page"),
);

function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const pageEnter = useMotionPreset("pageEnter");
  const pageExit = useMotionPreset("pageExit");

  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f7]",
          )}
        >
          <div className={cn("text-center")}>
            <p
              className={cn(
                "font-serif text-xs text-gray-400 tracking-[6px] uppercase",
              )}
            >
              Preparing
            </p>
            <div className={cn("h-px w-[44px] bg-rose-600 mx-auto mt-4")} />
          </div>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {!isInvitationOpen ? (
          <motion.div
            key="landing"
            variants={pageEnter}
            initial="hidden"
            animate="visible"
            exit={pageExit}
          >
            <LandingPage onOpenInvitation={() => setIsInvitationOpen(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            variants={pageEnter}
            initial="hidden"
            animate="visible"
            exit={pageExit}
          >
            <Layout>
              <MainContent />
            </Layout>
          </motion.div>
        )}
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
