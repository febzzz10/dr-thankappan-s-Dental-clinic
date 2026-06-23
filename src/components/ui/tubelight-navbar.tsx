"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PiCalendarBlank } from "react-icons/pi"
import type { IconType } from "react-icons/lib"

interface NavItem {
  name: string
  url: string
  icon: IconType
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2",
        className,
      )}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/80 px-2 py-1.5 shadow-ambient backdrop-blur-2xl supports-[backdrop-filter]:bg-white/70">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none",
                "text-slate-500 hover:text-teal-700 hover:bg-teal-50",
                isActive && "bg-teal-50 text-teal-700",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden flex items-center justify-center" aria-hidden="true">
                <Icon size={18} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-teal-600 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-teal-400/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-teal-400/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-teal-400/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
        <Link
          href="/book"
          aria-label="Book Appointment"
          className="md:hidden group relative flex cursor-pointer items-center gap-1 rounded-full bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-teal-700 active:scale-[0.97]"
        >
          <PiCalendarBlank size={16} />
        </Link>
      </div>
    </div>
  )
}
