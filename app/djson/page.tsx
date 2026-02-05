"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent } from "react";

const SAMPLE_JSON = ``;

type TransformMode = "beautify" | "minify";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const looksLikeJson = (value: string) => {
  const trimmed = value.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
};

const highlightJson = (value: string) => {
  if (!value) {
    return "";
  }

  const escaped = escapeHtml(value);
  const tokenRegex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g;

  return escaped.replace(tokenRegex, (match) => {
    let className = "text-slate-100";

    if (match.startsWith(`"`)) {
      className = match.endsWith(":") ? "text-sky-300" : "text-emerald-300";
    } else if (match === "true" || match === "false") {
      className = "text-amber-300";
    } else if (match === "null") {
      className = "text-rose-300";
    } else {
      className = "text-violet-300";
    }

    return `<span class="${className}">${match}</span>`;
  });
};

const tryParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};

const escapeForJsonString = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");

const tryUnescapeJsonString = (value: string) => {
  try {
    const wrapped = `"${escapeForJsonString(value)}"`;
    const parsed = JSON.parse(wrapped);
    return typeof parsed === "string" ? parsed : null;
  } catch (err) {
    return null;
  }
};

const normalizeParsed = (value: unknown) => {
  if (typeof value === "string" && looksLikeJson(value)) {
    const parsed = tryParse(value);
    if (parsed !== null) {
      return parsed;
    }
  }

  return value;
};

const tryFixAndParse = (text: string) => {
  const direct = normalizeParsed(tryParse(text));
  if (direct !== null) {
    return direct;
  }

  const unescaped = tryUnescapeJsonString(text);
  if (unescaped !== null) {
    const unescapedParsed = normalizeParsed(tryParse(unescaped));
    if (unescapedParsed !== null) {
      return unescapedParsed;
    }
  }

  let fixed = text.replace(/\\\\"/g, '\\"');
  const fixEscapes = normalizeParsed(tryParse(fixed));
  if (fixEscapes !== null) {
    return fixEscapes;
  }

  fixed = text.replace(/'/g, '"');
  const fixQuotes = normalizeParsed(tryParse(fixed));
  if (fixQuotes !== null) {
    return fixQuotes;
  }

  fixed = text.replace(/,\s*([\]}])/g, "$1");
  const fixTrailingCommas = normalizeParsed(tryParse(fixed));
  if (fixTrailingCommas !== null) {
    return fixTrailingCommas;
  }

  fixed = text.replace(
    /(\{|\,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g,
    '$1"$2":',
  );
  const fixUnquotedKeys = normalizeParsed(tryParse(fixed));
  if (fixUnquotedKeys !== null) {
    return fixUnquotedKeys;
  }

  fixed = text
    .replace(/,\s*([\]}])/g, "$1")
    .replace(/(\{|\,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  const fixCombined = normalizeParsed(tryParse(fixed));
  if (fixCombined !== null) {
    return fixCombined;
  }

  return null;
};

const expandNestedJson = (value: unknown): unknown => {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => expandNestedJson(item));
  }

  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    if (typeof nested === "string") {
      const trimmed = nested.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        const parsed = tryParse(nested);
        result[key] = parsed !== null ? expandNestedJson(parsed) : nested;
        continue;
      }
    }

    result[key] = expandNestedJson(nested);
  }

  return result;
};

export default function JsonParserPage() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const inputRef = useRef(input);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const highlightedOutput = useMemo(() => highlightJson(output), [output]);

  const runTransform = useCallback((mode: TransformMode) => {
    const raw = inputRef.current.trim();

    if (!raw) {
      setOutput("");
      setErrorMessage("");
      return;
    }

    const parsed = tryFixAndParse(raw);
    if (parsed === null) {
      setOutput("");
      setErrorMessage("Invalid JSON input.");
      return;
    }

    const expanded = expandNestedJson(parsed);
    const spacing = mode === "beautify" ? 2 : 0;
    const result = JSON.stringify(expanded, null, spacing);
    setOutput(result);
    setErrorMessage("");
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInput(value);
    inputRef.current = value;
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleInputPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = event.clipboardData.getData("text");
    if (!pasted) {
      return;
    }

    const parsed = tryFixAndParse(pasted);
    if (parsed === null) {
      return;
    }

    const expanded = expandNestedJson(parsed);
    const formatted = JSON.stringify(expanded, null, 2);
    event.preventDefault();
    setInput(formatted);
    inputRef.current = formatted;
    setOutput(formatted);
    setErrorMessage("");
  };

  const handleOutputCopy = useCallback(async () => {
    if (!output || errorMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus("success");
    } catch (err) {
      setCopyStatus("error");
    }
  }, [errorMessage, output]);

  useEffect(() => {
    if (copyStatus === "idle") {
      return;
    }

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = setTimeout(() => {
      setCopyStatus("idle");
    }, 1800);

    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, [copyStatus]);

  useEffect(() => {
    runTransform("beautify");
  }, [runTransform]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.metaKey || event.ctrlKey;
      if (!isModifierPressed || event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      if (event.shiftKey) {
        runTransform("minify");
      } else {
        runTransform("beautify");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runTransform]);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,204,0,0.12),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(148,163,184,0.08),_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between text-sm text-slate-400"></div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold text-balance">
              djson
            </h1>
          </div>
        </header>

        <section className="mt-10 flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-150">
          <div className="rounded-2xl border border-slate-800 bg-[#0f1621]/80 p-5 shadow-[0_20px_60px_rgba(5,8,14,0.45)]">
            <div className="flex items-center justify-between mb-4">
              <label
                htmlFor="json-input"
                className="text-sm uppercase tracking-[0.2em] text-slate-400"
              >
                Input
              </label>
            </div>
            <textarea
              id="json-input"
              value={input}
              onChange={handleInputChange}
              onPaste={handleInputPaste}
              spellCheck={false}
              className="djson-scroll min-h-[260px] w-full resize-y rounded-xl border border-slate-800 bg-[#0b111a] p-4 font-mono text-sm text-slate-100 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0f1621]/80 p-5 shadow-[0_20px_60px_rgba(5,8,14,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span
                id="json-output-label"
                className="text-sm uppercase tracking-[0.2em] text-slate-400"
              >
                Output
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  aria-live="polite"
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    copyStatus === "success"
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300 opacity-100"
                      : copyStatus === "error"
                        ? "border-rose-400/40 bg-rose-400/10 text-rose-300 opacity-100"
                        : "border-transparent bg-transparent text-transparent opacity-0"
                  }`}
                >
                  {copyStatus === "success"
                    ? "Copied"
                    : copyStatus === "error"
                      ? "Copy failed"
                      : ""}
                </div>
                <button
                  type="button"
                  onClick={() => runTransform("beautify")}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-[#0b0f14] shadow-lg shadow-yellow-500/20 transition hover:translate-y-[-1px] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  Beautify
                </button>
                <button
                  type="button"
                  onClick={() => runTransform("minify")}
                  className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-primary/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  Minify
                </button>
              </div>
            </div>
            <div
              id="json-output"
              role="button"
              tabIndex={0}
              aria-labelledby="json-output-label"
              onClick={handleOutputCopy}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleOutputCopy();
                }
              }}
              className="djson-scroll min-h-[260px] w-full resize-y overflow-auto rounded-xl border border-slate-800 bg-[#0b111a] p-4 font-mono text-sm text-slate-100 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              {errorMessage ? (
                <pre className="whitespace-pre-wrap break-words text-rose-300">
                  {errorMessage}
                </pre>
              ) : (
                <pre
                  className="whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: highlightedOutput }}
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <style jsx global>{`
        .djson-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(250, 204, 21, 0.55) rgba(15, 23, 42, 0.7);
        }

        .djson-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .djson-scroll::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.7);
          border-radius: 999px;
          box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.15);
        }

        .djson-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(250, 204, 21, 0.9),
            rgba(250, 204, 21, 0.5)
          );
          border-radius: 999px;
          border: 2px solid rgba(15, 23, 42, 0.75);
          box-shadow: 0 0 12px rgba(250, 204, 21, 0.35);
        }

        .djson-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(250, 204, 21, 1),
            rgba(250, 204, 21, 0.65)
          );
        }
      `}</style>
    </div>
  );
}
