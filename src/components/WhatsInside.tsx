import FadeUp from "@/components/FadeUp";

const codeLines = [
  { key: "name", value: '"Alex Chen"', indent: false },
  { key: "role", value: '"Product designer & founder"', indent: false },
  { key: "tone", value: '"Direct, warm, no jargon"', indent: false },
  { key: "context", value: '"Building a dev tool startup, Series A"', indent: false },
  { key: "preferences", value: "", indent: false },
  { key: "format", value: '"Bullet points over paragraphs"', indent: true },
  { key: "length", value: '"Concise — never more than 3 paragraphs"', indent: true },
  { key: "goals", value: "", indent: false },
  { key: "current", value: '"Ship v2 by March, close funding round"', indent: true },
];

const WhatsInside = () => (
  <section id="spec" className="py-24 md:py-32 bg-mauve/20">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-3">What's inside</p>
        <p className="text-muted-foreground text-sm mb-10">A preview of a sample you.md identity bundle.</p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="bg-dusk rounded-xl p-6 md:p-10 overflow-x-auto">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-sand/10">
            <div className="w-2.5 h-2.5 rounded-full bg-sand/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-sand/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-sand/20" />
            <span className="ml-3 text-sand/30 text-xs font-mono">you.md</span>
          </div>
          <pre className="font-mono text-sm leading-[2]">
            <code>
              {codeLines.map((line, i) => (
                <div key={i}>
                  <span className="text-sand/30">{line.indent ? "  " : ""}</span>
                  <span className={line.indent ? "text-sand/30" : "text-sand/50"}>{line.key}</span>
                  {line.value ? (
                    <>
                      <span className="text-sand/20">{": "}</span>
                      <span className="text-teal">{line.value}</span>
                    </>
                  ) : (
                    <span className="text-sand/20">:</span>
                  )}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </FadeUp>
    </div>
  </section>
);

export default WhatsInside;
