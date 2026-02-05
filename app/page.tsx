"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, Download, ExternalLink } from "lucide-react"
import { socialNetworks } from "../data/SOCIAL_NETWORKS"
import { projects } from "../data/PROJECTS"

export default function DJPortfolio() {
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
    <div
      className="min-h-screen bg-background relative overflow-hidden flex flex-col"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 215, 0, 0.03), transparent 40%)`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-1 h-1 bg-primary/20 rounded-full transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute w-0.5 h-0.5 bg-primary/10 rounded-full transition-all duration-1500 ease-out"
          style={{
            left: `${mousePosition.x * 0.8}%`,
            top: `${mousePosition.y * 0.9}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="flex-1">
        <section className="pt-32 pb-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div
                className={`flex-1 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
              >
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-balance">
                  <span className="text-foreground">Djonathan</span>
                  <br />
                  <span className="text-primary">Krause</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground mb-8 text-pretty">
                  Hi, you can call me <span className="text-primary font-semibold">DJ!</span> • Software Engineer
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => window.open("/cv.pdf", "_blank")}>
                    <Download className="mr-2 h-5 w-5" />
                    Resume
                  </Button>
                  <div className="flex gap-3">
                    {socialNetworks.map((social) => {
                      const Icon = social.icon
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center w-12 h-12 rounded-lg bg-card border border-border hover:border-primary transition-all duration-300 ${social.color} group`}
                          title={social.name}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 flex justify-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
              >
                <div className="relative">
                  <img
                    src="/images/dj-portrait.png"
                    alt="DJ - Djonathan Krause"
                    className="w-80 h-80 object-cover rounded-full float-animation glow-animation"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group cursor-pointer relative overflow-hidden"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${project.title}`}
                  onClick={() => window.open(project.link, "_blank")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      window.open(project.link, "_blank")
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = ((e.clientX - rect.left) / rect.width) * 100
                    const y = ((e.clientY - rect.top) / rect.height) * 100
                    e.currentTarget.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 215, 0, 0.05), transparent 70%)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = ""
                  }}
                >
                  <h3 className="text-xl font-semibold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={(event) => {
                        event.stopPropagation()
                        window.open(project.link, "_blank")
                      }}
                    >
                      View Project
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {project.repo && (
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={(event) => {
                          event.stopPropagation()
                          window.open(project.repo, "_blank")
                        }}
                      >
                        View Code
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">email@djonathan.com</p>
        </div>
      </footer>
    </div>
  )
}
