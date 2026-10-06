import { ArrowUpRight, Linkedin, Mail } from "lucide-react"

const contacts = [
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/djonathan-krause-8981a788/" },
  { name: "email@djonathan.com", icon: Mail, url: "mailto:email@djonathan.com" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-3 sm:p-5">
      <div className="min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2.5rem)] rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter text-white">
          Djonathan <span className="text-primary">Krause</span>
        </h1>
        <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-white/60 text-pretty">
          Currently at soci.ai creating the tech support workflow, and building{" "}
          <a
            href="https://euler.software"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
          >
            euler.software
          </a>{" "}
          to bring modern engineering and AI to supply chain software.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {contacts.map((contact) => {
            const Icon = contact.icon
            return (
              <a
                key={contact.name}
                href={contact.url}
                target={contact.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {contact.name}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            )
          })}
        </div>
      </div>
    </main>
  )
}
