import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageHero, SiteLayout } from "@/components/Site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitEnquiry } from "@/lib/demo.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Axon 1Pro Solutions — SEMS" },
      { name: "description", content: "Contact Axon 1Pro Solutions for SEMS pricing, demonstrations, custom integrations or development-partner discussions." },
      { property: "og:title", content: "Contact Axon 1Pro Solutions" },
      { property: "og:description", content: "SEMS pricing, demos, integrations and development partnerships — support@axon.com.sg." },
      { property: "og:url", content: "https://sems.axon.com.sg/contact" },
      { property: "og:image", content: "https://sems.axon.com.sg/og-image.png" },
      { name: "twitter:image", content: "https://sems.axon.com.sg/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://sems.axon.com.sg/contact" }],
  }),
  component: Page,
});

const CARDS: [string, string, string][] = [
  ["Sales / SEMS Enquiries", "support@axon.com.sg", "mailto:support@axon.com.sg"],
  ["Technical / Integration", "support@axon.com.sg", "mailto:support@axon.com.sg"],
  ["Development Partnership / Council Meeting", "amit@axon.com.sg", "mailto:amit@axon.com.sg"],
  ["Website", "axon.com.sg", "https://axon.com.sg"],
  ["1Pro IT", "1proit.com", "https://1proit.com"],
  ["YouTube — CHATapa | No Hype Tech", "YouTube.com/@CHATapaNHT", "https://youtube.com/@CHATapaNHT"],
  ["SEMS Demo", "sems.axon.com.sg", "https://sems.axon.com.sg"],
];

const INTERESTS = ["Demo", "Pricing", "Integration", "Development Partnership", "Other"] as const;

function Page() {
  const send = useServerFn(submitEnquiry);
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", units: "", residents: "", interest: "Demo" as (typeof INTERESTS)[number], message: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ mode: string; message: string } | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setResult(null);
    try { setResult(await send({ data: f })); }
    catch { setResult({ mode: "error", message: "Please check the required fields (name, valid email, message) and try again." }); }
    finally { setBusy(false); }
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Axon 1Pro Solutions" title="Contact Axon 1Pro Solutions" sub="For SEMS pricing, demonstrations, custom integrations or development-partner discussions, contact us." />
      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(([t, v, href]) => (
            <a key={t} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-lg border bg-card p-5 transition hover:border-primary">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{t}</div>
              <div className="mt-1 font-semibold text-primary">{v}</div>
            </a>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">Send an enquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your enquiry is sent as a single notification to support@axon.com.sg. Please don't include sensitive personal data.</p>
            <div className="mt-6 rounded-lg border bg-muted/40 p-5">
              <h3 className="font-display font-bold text-navy">Need a provider or integration not listed?</h3>
              <p className="mt-2 text-sm text-muted-foreground">SEMS is open, not closed. If your preferred booking, resident, access, CCTV, accounting, email, SMS, WhatsApp, voice or other provider offers an API or integration method, Axon can assess and build a connector.</p>
              <Button asChild size="sm" className="mt-3"><a href="mailto:support@axon.com.sg?subject=SEMS%20Integration%20Assessment">Email support@axon.com.sg</a></Button>
            </div>
          </div>
          <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border bg-card p-6 sm:grid-cols-2">
            <div><Label>Name *</Label><Input required maxLength={100} value={f.name} onChange={set("name")} /></div>
            <div><Label>Company / MCST</Label><Input maxLength={150} value={f.company} onChange={set("company")} /></div>
            <div><Label>Email *</Label><Input required type="email" maxLength={150} value={f.email} onChange={set("email")} /></div>
            <div><Label>Phone</Label><Input maxLength={40} value={f.phone} onChange={set("phone")} /></div>
            <div><Label>Number of units</Label><Input inputMode="numeric" maxLength={20} value={f.units} onChange={set("units")} /></div>
            <div><Label>Approx residents</Label><Input inputMode="numeric" maxLength={20} value={f.residents} onChange={set("residents")} /></div>
            <div className="sm:col-span-2"><Label>Interested in</Label>
              <select className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm" value={f.interest} onChange={set("interest")}>
                {INTERESTS.map((i) => <option key={i}>{i}</option>)}
              </select></div>
            <div className="sm:col-span-2"><Label>Message *</Label><Textarea required rows={5} maxLength={2000} value={f.message} onChange={set("message")} /></div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit Enquiry"}</Button>
              {result && (
                <span className={`text-sm ${result.mode === "live" ? "text-success" : result.mode === "error" ? "text-destructive" : "text-muted-foreground"}`}>
                  {result.mode === "live" ? "Submitted: " : result.mode === "simulation" ? "Demo: " : ""}{result.message}
                </span>
              )}
            </div>
          </form>
        </section>
      </main>
    </SiteLayout>
  );
}