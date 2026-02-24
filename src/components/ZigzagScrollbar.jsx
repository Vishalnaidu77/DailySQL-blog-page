import { useState, useMemo, useEffect, useCallback } from 'react'

const ZigzagScrollbar = ({ scrollRef }) => {
  const [scrollRatio, setScrollRatio] = useState(0)
  const [thumbRatio, setThumbRatio] = useState(1)
  const height = 100 // percentage - fills container

  // Build zigzag path with sharp angular lines
  const zigzagAmplitude = 6
  const zigzagSegmentHeight = 40
  const svgWidth = 20
  const centerX = svgWidth / 2
  // We'll use a viewBox with a large fixed height and scale
  const pathHeight = 1000
  const segments = Math.floor(pathHeight / zigzagSegmentHeight)

  const buildPath = () => {
    let d = `M ${centerX} 0`
    for (let i = 0; i < segments; i++) {
      const dir = i % 2 === 0 ? 1 : -1
      const midY = i * zigzagSegmentHeight + zigzagSegmentHeight / 2
      const endY = (i + 1) * zigzagSegmentHeight
      // Diagonal to one side, then diagonal to the other
      d += ` L ${centerX + dir * zigzagAmplitude} ${midY}`
      d += ` L ${centerX - dir * zigzagAmplitude} ${endY}`
    }
    return d
  }

  const path = useMemo(buildPath, [])

  const updateScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll <= 0) {
      setScrollRatio(0)
      setThumbRatio(1)
      return
    }
    setScrollRatio(scrollTop / maxScroll)
    setThumbRatio(clientHeight / scrollHeight)
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScroll)
    window.addEventListener('resize', updateScroll)
    updateScroll()
    // Also observe content changes
    const observer = new MutationObserver(updateScroll)
    observer.observe(el, { childList: true, subtree: true })
    return () => {
      el.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
      observer.disconnect()
    }
  }, [scrollRef, updateScroll])

  // Calculate stroke-dasharray/offset for the thumb
  // Each segment has two diagonal lines; approximate each diagonal's length
  const diagLength = Math.sqrt(zigzagAmplitude * zigzagAmplitude + (zigzagSegmentHeight / 2) * (zigzagSegmentHeight / 2))
  const totalLength = segments * 2 * diagLength
  const thumbLength = thumbRatio * totalLength
  const thumbOffset = scrollRatio * (totalLength - thumbLength)

  if (thumbRatio >= 1) return null // no scrollbar needed

  return (
    <div className="zigzag-scrollbar">
      <svg
        viewBox={`0 0 ${svgWidth} ${pathHeight}`}
        preserveAspectRatio="none"
      >
        {/* Track */}
        <path d={path} className="zigzag-track" />
        {/* Thumb */}
        <path
          d={path}
          className="zigzag-thumb"
          strokeDasharray={`${thumbLength} ${totalLength}`}
          strokeDashoffset={`${-thumbOffset}`}
        />
      </svg>
    </div>
  )
}

export default ZigzagScrollbar
