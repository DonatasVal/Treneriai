import { useReducedMotion } from "framer-motion";

export function useSafeMotion() {
  const reduced = useReducedMotion();

  const fadeUp = {
    initial: reduced ? false : { opacity: 0, y: 24 },
    animate: reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 },
    whileInView: reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.58, ease: [0.2, 0.8, 0.2, 1] },
    viewport: { once: true, margin: "-80px" },
  };

  return { reduced, fadeUp };
}
