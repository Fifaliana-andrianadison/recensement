type LogoProps = {
  className?: string
}

export default function Logo({ className = "h-9 w-9" }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="white" />
      <path d="M20 6v28M6 20h28" stroke="#007ACC" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
