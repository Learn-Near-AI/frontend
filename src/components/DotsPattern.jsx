import React from 'react'

function DotsPattern() {
  // Grey color matching the binary pattern: #9CA3AF (rgba(156, 163, 175))
  return (
    <div className="absolute inset-0 opacity-[0.1] pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1' height='1' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='1'%3E%3Cpath d='M30 20h-5v5h-5v5h5v5h5v-5h5v-5h-5v-5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0",
        }}
      />
    </div>
  ) }

export default DotsPattern
