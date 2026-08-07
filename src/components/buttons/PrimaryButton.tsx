import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
}

export function PrimaryButton({ className = '', fullWidth = false, type = 'button', ...props }: PrimaryButtonProps) {
  const classes = [styles.button, styles.primary, fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} type={type} {...props} />
}
