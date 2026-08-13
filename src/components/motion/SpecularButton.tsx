import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: 'primary' | 'gold' | 'ghost' | 'coral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variants = {
  primary: 'specular-btn',
  gold:
    'relative overflow-hidden isolation-auto bg-gradient-to-br from-amber to-gold text-ink border-none cursor-pointer shadow-md hover:shadow-lg transition-all duration-300',
  ghost:
    'bg-transparent border border-forest/20 text-forest hover:bg-forest/5 cursor-pointer transition-all duration-300',
  coral:
    'relative overflow-hidden bg-gradient-to-br from-coral to-[#c45d45] text-white border-none cursor-pointer shadow-md',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl font-medium',
  md: 'px-6 py-3 text-base rounded-2xl font-semibold',
  lg: 'px-8 py-4 text-lg rounded-2xl font-semibold',
}

export function SpecularButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 justify-center">
        {children}
      </span>
    </motion.button>
  )
}
