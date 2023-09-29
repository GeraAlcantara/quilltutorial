import type { ClassValue } from 'clsx'

import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @param inputs - Class names to be merged
 * @returns - Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
