export function ChildAvatar({
  name,
  gender,
  size = 44,
}: {
  name: string
  gender?: 'male' | 'female'
  size?: number
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const bg = gender === 'female' ? '#d4849a' : gender === 'male' ? '#5b9bd5' : '#2d8a64'

  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
        fontSize: size * 0.32,
        boxShadow: `0 2px 8px ${bg}40`,
      }}
      aria-hidden
    >
      {initials}
    </div>
  )
}
