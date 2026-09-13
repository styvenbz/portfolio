/** Marks a case study as password protected. Used anywhere a project is listed. */
export function LockBadge() {
  return (
    <span className="bg-(--color-ink) text-(--color-bg) absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 label text-[0.6rem]">
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden>
        <path
          d="M1 4.5V3a3.5 3.5 0 1 1 7 0v1.5"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <rect x="0.5" y="4.5" width="8" height="6" rx="1" fill="currentColor" />
      </svg>
      Protected
    </span>
  )
}
