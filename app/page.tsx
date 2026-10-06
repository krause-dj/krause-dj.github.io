"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { GeistMono } from "geist/font/mono"

const EMAIL = "email@djonathan.com"
const LINKEDIN = "https://www.linkedin.com/in/djonathan-krause-8981a788/"

const linkClass =
  "text-neutral-100 underline decoration-neutral-700 underline-offset-4 hover:text-primary hover:decoration-primary"

const step = (i: number): CSSProperties => ({ animationDelay: `${i * 90}ms` })

export default function Home() {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      window.location.href = `mailto:${EMAIL}`
      return
    }
    setCopied(true)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setCopied(false), 1800)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      if (e.key === "l") window.open(LINKEDIN, "_blank")
      if (e.key === "e") copyEmail()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <main
      className={`${GeistMono.className} min-h-screen bg-[#0c0c0c] px-6 py-24 sm:py-40 text-[13px] leading-relaxed text-neutral-400 antialiased`}
    >
      <div className="mx-auto max-w-[34rem] space-y-10 lowercase">
        <header className="rise" style={step(0)}>
          <h1 className="text-2xl text-neutral-100">
            djonathan krause<span className="cursor text-primary">_</span>
          </h1>
          <p className="text-neutral-600">software engineer</p>
        </header>

        <p className="rise" style={step(1)}>
          currently at{" "}
          <a href="https://soci.ai" target="_blank" rel="noopener noreferrer" className={linkClass}>
            soci.ai
          </a>{" "}
          creating the tech support workflow, and building{" "}
          <a
            href="https://euler.software"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            euler.software
          </a>{" "}
          to bring modern engineering and ai to supply chain software.
        </p>

        <nav className="rise flex gap-6" style={step(2)}>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="group text-neutral-100 hover:text-primary">
            <span className="text-neutral-600 group-hover:text-primary">[l]</span> linkedin
          </a>
          <button type="button" onClick={copyEmail} className="group lowercase text-neutral-100 hover:text-primary">
            <span className="text-neutral-600 group-hover:text-primary">[e]</span>{" "}
            {copied ? <span className="text-primary">copied {EMAIL} ✓</span> : "email"}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? "email copied to clipboard" : ""}
          </span>
        </nav>
      </div>
    </main>
  )
}
