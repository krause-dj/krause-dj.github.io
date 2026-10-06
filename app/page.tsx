import type { CSSProperties, ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"

function Row({ label, children, index }: { label: string; children: ReactNode; index: number }) {
  return (
    <section className="rise grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6" style={step(index)}>
      <h2 className="text-neutral-400">{label}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function OutLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-0.5 text-neutral-900 underline decoration-neutral-300 underline-offset-[3px] transition-colors hover:decoration-neutral-900"
    >
      {children}
      <ArrowUpRight
        className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-neutral-900"
        strokeWidth={1.75}
      />
    </a>
  )
}

const step = (i: number): CSSProperties => ({ animationDelay: `${i * 90}ms` })

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfbfa] px-6 py-24 sm:py-40 text-[14px] leading-relaxed text-neutral-600 antialiased">
      <div className="mx-auto max-w-[36rem] space-y-14">
        <header className="rise" style={step(0)}>
          <h1 className="font-medium text-neutral-900">Djonathan Krause</h1>
          <p className="text-neutral-400">Software Engineer</p>
        </header>

        <Row label="Now" index={1}>
          <p>
            Currently at soci.ai creating the tech support workflow, and building{" "}
            <OutLink href="https://euler.software">euler.software</OutLink> to bring modern engineering and AI
            to supply chain software.
          </p>
        </Row>

        <Row label="Contact" index={2}>
          <ul className="space-y-1">
            <li>
              <OutLink href="https://www.linkedin.com/in/djonathan-krause-8981a788/">LinkedIn</OutLink>
            </li>
            <li>
              <OutLink href="mailto:email@djonathan.com">email@djonathan.com</OutLink>
            </li>
          </ul>
        </Row>
      </div>
    </main>
  )
}
