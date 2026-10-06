const linkClass = "underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center px-6">
      <div className="max-w-xl mx-auto w-full space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Djonathan Krause</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Currently at{" "}
          <a href="https://soci.ai" target="_blank" rel="noopener noreferrer" className={linkClass}>
            soci.ai
          </a>{" "}
          creating the tech support workflow, and building{" "}
          <a href="https://euler.software" target="_blank" rel="noopener noreferrer" className={linkClass}>
            euler.software
          </a>{" "}
          to bring modern engineering and AI to supply chain software.
        </p>
        <p className="text-lg text-muted-foreground">
          <a
            href="https://www.linkedin.com/in/djonathan-krause-8981a788/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            LinkedIn
          </a>
          {" · "}
          <a href="mailto:email@djonathan.com" className={linkClass}>
            email@djonathan.com
          </a>
        </p>
      </div>
    </main>
  )
}
