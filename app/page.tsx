"use client"

import { useEffect, type CSSProperties } from "react"
import { GeistMono } from "geist/font/mono"

const links = [
  { key: "l", name: "linkedin", url: "https://www.linkedin.com/in/djonathan-krause-8981a788/" },
  { key: "e", name: "email", url: "mailto:email@djonathan.com" },
]

const step = (i: number): CSSProperties => ({ animationDelay: `${i * 90}ms` })

export default function Home() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const link = links.find((l) => l.key === e.key)
      if (link) window.open(link.url, link.url.startsWith("http") ? "_blank" : "_self")
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
          currently at soci.ai creating the tech support workflow, and building{" "}
          <a
            href="https://euler.software"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-100 underline decoration-neutral-700 underline-offset-4 hover:text-primary hover:decoration-primary"
          >
            euler.software
          </a>{" "}
          to bring modern engineering and ai to supply chain software.
        </p>

        <nav className="rise flex gap-6" style={step(2)}>
          {links.map((link) => (
            <a
              key={link.key}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group text-neutral-100 hover:text-primary"
            >
              <span className="text-neutral-600 group-hover:text-primary">[{link.key}]</span> {link.name}
            </a>
          ))}
        </nav>
      </div>
    </main>
  )
}
