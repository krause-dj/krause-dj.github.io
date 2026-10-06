"use client"

import { useState, useEffect } from "react"
import { Linkedin, Mail } from "lucide-react"

const contacts = [
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/djonathan-krause-8981a788/", color: "hover:text-blue-400" },
  { name: "email@djonathan.com", icon: Mail, url: "mailto:email@djonathan.com", color: "hover:text-primary" },
]

const highlightClass = "text-primary font-semibold hover:underline underline-offset-4"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <main
      className="min-h-screen bg-background relative overflow-hidden flex items-center px-6"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 215, 0, 0.03), transparent 40%)`,
      }}
    >
      <div
        className={`max-w-6xl mx-auto w-full transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
      >
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-balance">
          <span className="text-foreground">Djonathan</span>
          <br />
          <span className="text-primary">Krause</span>
        </h1>
        <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl text-pretty leading-relaxed">
          Currently at{" "}
          <a href="https://soci.ai" target="_blank" rel="noopener noreferrer" className={highlightClass}>
            soci.ai
          </a>{" "}
          creating the tech support workflow, and building{" "}
          <a href="https://euler.software" target="_blank" rel="noopener noreferrer" className={highlightClass}>
            euler.software
          </a>{" "}
          to bring modern engineering and AI to supply chain software.
        </p>
        <div className="flex flex-wrap gap-3">
          {contacts.map((contact) => {
            const Icon = contact.icon
            return (
              <a
                key={contact.name}
                href={contact.url}
                target={contact.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-2 h-12 px-4 rounded-lg bg-card border border-border hover:border-primary transition-all duration-300 ${contact.color}`}
              >
                <Icon className="h-5 w-5" />
                {contact.name}
              </a>
            )
          })}
        </div>
      </div>
    </main>
  )
}
