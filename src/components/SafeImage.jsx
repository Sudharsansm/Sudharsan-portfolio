import { useState } from 'react'

// <img> that degrades gracefully: if a (third-party) image fails to load, the broken-image
// icon is hidden and the parent's placeholder background shows instead.
export default function SafeImage({ src, alt = '', className, onError, ...rest }) {
  const [failedSrc, setFailedSrc] = useState(null)

  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      style={failedSrc === src ? { visibility: 'hidden' } : undefined}
      onError={(e) => {
        setFailedSrc(src)
        onError?.(e)
      }}
      {...rest}
    />
  )
}
