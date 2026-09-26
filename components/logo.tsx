import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  variant = 'blue',
}: {
  className?: string
  variant?: 'blue' | 'dark' | 'light'
}) {
  return (
    <span className={cn('relative inline-flex h-16 w-28 shrink-0 items-center justify-center', className)}>
      <Image
        src={variant === 'light' ? '/images/master-build-logo-white.png' : '/images/master-build-logo-blue.png'}
        alt="Master Build"
        fill
        sizes="112px"
        className="object-contain"
        priority
      />
    </span>
  )
}
