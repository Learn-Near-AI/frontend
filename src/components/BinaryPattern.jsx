import { useEffect, useRef } from 'react'

function BinaryPattern({ className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current 
    const chars = ['0', '1']
    // Increase rows to fill more height - reduce divisor to get more rows
    const rows = Math.ceil(window.innerHeight / 20)
    const cols = Math.ceil(window.innerWidth / 20)
    
    let text = ''
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + ' '
      }
      text += '\n'
    }
    
    const element = document.createElement('div')
    element.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: rgba(156, 163, 175, 0.25);
      white-space: pre;
      overflow: hidden;
      line-height: 1.4;
      padding: 40px;
      letter-spacing: 6px;
      transform: rotate(-1deg);
      pointer-events: none;
      z-index: 0;
    `
    element.textContent = text
    container.appendChild(element)
    
    return () => {
      if (container.contains(element)) {
        container.removeChild(element)
      }
    }
  }, [])

  return <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} />
}

export default BinaryPattern
