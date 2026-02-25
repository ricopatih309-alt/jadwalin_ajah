import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import { motion, AnimatePresence, type Transition, type VariantLabels, type Target, type TargetAndTransition} from 'motion/react';

function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');}

export interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface RotatingTextProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.span>,
    'children' | 'transition' | 'initial' | 'animate' | 'exit'
  > {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: Target | VariantLabels;
  rotationInterval?: number;
  staggerDuration?: number;
  loop?: boolean;
  auto?: boolean;
  mainClassName?: string;
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(
  (
    {
      texts,
      transition = { type: 'spring', damping: 25, stiffness: 200 },
      initial = { y: '10%', opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: '-10%', opacity: 0 },
      rotationInterval = 2000,
      staggerDuration = 0.04,
      loop = true,
      auto = true,
      mainClassName,
      ...rest
    },
    ref
  ) => {
    const [index, setIndex] = useState(0);

    
    const next = useCallback(() => {
      setIndex(i => (i === texts.length - 1 ? (loop ? 0 : i) : i + 1));
    }, [texts.length, loop]);

    const previous = useCallback(() => {
      setIndex(i => (i === 0 ? (loop ? texts.length - 1 : i) : i - 1));
    }, [texts.length, loop]);

    const jumpTo = useCallback(
      (i: number) => {
        if (i >= 0 && i < texts.length) setIndex(i);
      },
      [texts.length]
    );

    const reset = useCallback(() => setIndex(0), []);

    
    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset
      }),
      [next, previous, jumpTo, reset]
    );

    useEffect(() => {
      if (!auto) return;
      const id = setInterval(next, rotationInterval);
      return () => clearInterval(id);
    }, [next, rotationInterval, auto]);

    const chars = useMemo(() => Array.from(texts[index]), [texts, index]);

    return (
      <motion.span
        className={cn('inline-flex whitespace-pre', mainClassName)}
        {...rest}
      >
        <AnimatePresence mode="wait">
          <motion.span key={index} className="inline-flex">
            {chars.map((char, i) => (
              <motion.span
                key={i}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: i * staggerDuration
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    );
  }
);

RotatingText.displayName = 'RotatingText';
export default RotatingText;
