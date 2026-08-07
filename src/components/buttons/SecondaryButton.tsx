import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
}

export function SecondaryButton({ className = '', fullWidth = false, type = 'button', ...props }: SecondaryButtonProps) {
  const classes = [styles.button, styles.secondary, fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} type={type} {...props} />
}
