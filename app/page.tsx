import type { CSSProperties, ReactNode } from "react"
import { Linkedin, Mail, type LucideIcon } from "lucide-react"

function InlineLink({
  href,
  icon: Icon,
  badge,
  children,
}: {
  href: string
  icon?: LucideIcon
  badge?: string
  children: ReactNode
}) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-baseline gap-1 font-medium text-neutral-100 transition-colors hover:text-primary"
    >
      {Icon && <Icon className="h-3.5 w-3.5 self-center" strokeWidth={1.75} />}
      {badge && (
        <span className="grid h-3.5 w-3.5 self-center place-items-center rounded-[3px] bg-neutral-100 text-[9px] font-semibold text-black">
          {badge}
        </span>
      )}
      {children}
    </a>
  )
}

const step = (i: number): CSSProperties => ({ animationDelay: `${i * 90}ms` })

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-24 sm:py-40 text-[15px] leading-relaxed text-neutral-400 antialiased">
      <div className="mx-auto max-w-[34rem] space-y-8">
        <header className="rise flex items-center gap-3" style={step(0)}>
          <img src="/images/dj-avatar-96.png" alt="" className="h-9 w-9 rounded-full bg-neutral-800" />
          <div className="leading-tight">
            <h1 className="font-medium text-neutral-100">Djonathan Krause</h1>
            <p className="text-neutral-500">Software Engineer</p>
          </div>
        </header>

        <p className="rise" style={step(1)}>
          Currently at soci.ai creating the tech support workflow, and building{" "}
          <InlineLink href="https://euler.software" badge="E">
            euler.software
          </InlineLink>{" "}
          to bring modern engineering and AI to supply chain software.
        </p>

        <p className="rise" style={step(2)}>
          You can find me on{" "}
          <InlineLink href="https://www.linkedin.com/in/djonathan-krause-8981a788/" icon={Linkedin}>
            LinkedIn
          </InlineLink>{" "}
          or reach me via{" "}
          <InlineLink href="mailto:email@djonathan.com" icon={Mail}>
            email
          </InlineLink>
          .
        </p>
      </div>
    </main>
  )
}
