import * as React from "react"

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 170 120"
      width="170"
      height="120"
      {...props}
    >
      <defs>
        <filter id="shadow-1" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
        </filter>
        <filter id="shadow-2" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>
      <g transform="translate(10, 10)">
        <g transform="scale(0.8)">
          <path d="M 50 0 C 22.38 0 0 22.38 0 50 L 50 50 Z" fill="#78C2A4" />
          <path d="M 50 0 C 77.62 0 100 22.38 100 50 L 50 50 Z" fill="#4B9A9A" />
          <path d="M 0 50 C 0 77.62 22.38 100 50 100 L 50 50 Z" fill="#60A96D" />
          <path d="M 100 50 C 100 77.62 77.62 100 50 100 L 50 50 Z" fill="#2E8B57" />
          <path d="M125 40 L 100 40 L 100 100 L 125 100 Z" fill="#1E5945" />
          <path d="M140 60 L 125 60 L 125 100 L 140 100 Z" fill="#3E6B56" />
        </g>

        <path d="M10 85 H 160 L 140 110 H 30 Z" fill="#10344F" filter="url(#shadow-2)" />

        <g transform="translate(45, 15)" fill="#FFFFFF" filter="url(#shadow-1)">
          <path d="M35,10 A25,25 0 1 1 35,60 A25,25 0 0 1 35,10 M35,15 A20,20 0 1 0 35,55 A20,20 0 0 0 35,15 Z" />
          <circle cx="35" cy="35" r="10" />
          <rect x="32" y="35" width="6" height="35" />
        </g>

        <g transform="translate(20, 70)">
          <rect x="10" y="5" width="10" height="10" fill="white" />
          <rect x="25" y="10" width="5" height="5" fill="white" />
          <rect x="35" y="8" width="5" height="7" fill="white" />
          <rect x="90" y="0" width="15" height="15" fill="white" />
          <rect x="110" y="5" width="8" height="10" fill="white" />
        </g>

        <text
          x="85"
          y="102"
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fill="white"
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="1"
        >
          DATA BATAM
        </text>
      </g>
    </svg>
  )
}
