"use client"

import React from "react"
import { NextUIProvider } from "@nextui-org/react"

export default function WaveAnimatedBackgroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="waves">
              <use xlinkHref="#wave" x="48" y="0" fill="rgba(128, 90, 213, 0.2)" transform="scale(-1,1) translate(-300, 0)" />
              <use xlinkHref="#wave" x="48" y="3" fill="rgba(167, 139, 250, 0.3)" />
              <use xlinkHref="#wave" x="48" y="5" fill="rgba(209, 213, 219, 0.1)" transform="scale(1,-1) translate(0, -50)" />
              <use xlinkHref="#wave" x="48" y="7" fill="rgba(255, 255, 255, 0.05)" />
              <use xlinkHref="#wave" x="48" y="10" fill="rgba(0, 128, 255, 0.15)" transform="scale(-1, -1) translate(-300, -50)" />
            </g>
          </svg>
        </div>
       {/* Scrollable Content Layer */}
       <div className="relative z-10 h-screen overflow-auto">
          {children}
        </div>
        <style jsx>{`
          .waves > use {
            animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
          }
          .waves > use:nth-child(1) {
            animation-delay: -2s;
            animation-duration: 7s;
          }
          .waves > use:nth-child(2) {
            animation-delay: -3s;
            animation-duration: 10s;
          }
          .waves > use:nth-child(3) {
            animation-delay: -4s;
            animation-duration: 13s;
          }
          .waves > use:nth-child(4) {
            animation-delay: -5s;
            animation-duration: 20s;
          }
          .waves > use:nth-child(5) {
            animation-delay: -6s;
            animation-duration: 17s;
          }
          @keyframes move-forever {
            0% {
              transform: translate3d(-90px,0,0);
            }
            100% { 
              transform: translate3d(85px,0,0);
            }
          }
        `}</style>
      </div>
    </NextUIProvider>
  )
}
