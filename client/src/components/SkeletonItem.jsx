import { motion } from "framer-motion";

const SkeletonItem = () => {
  return (
    <motion.div
      className="relative rounded shadow-lg overflow-hidden bg-gradient-to-br from-[#043945] to-[#054a58] aspect-[3/4]"
      animate={{
        opacity: [0.6, 0.8, 0.6],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

export default SkeletonItem;