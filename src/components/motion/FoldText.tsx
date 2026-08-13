import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FoldTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function FoldText({ text, className = '', delay = 0, as: Tag = 'h1' }: FoldTextProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.28em]">
          {word.split('').map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="fold-char"
              initial={{ opacity: 0, rotateX: -90, y: 24 }}
              animate={
                inView
                  ? { opacity: 1, rotateX: 0, y: 0 }
                  : { opacity: 0, rotateX: -90, y: 24 }
              }
              transition={{
                duration: 0.55,
                delay: delay + wi * 0.06 + ci * 0.018,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ perspective: 600 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
