import type { HTMLAttributes } from 'react'
import styles from './EgyptianFrame.module.css'

export function EgyptianFrame({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={`${styles.frame} ${className}`} {...props} />
}
