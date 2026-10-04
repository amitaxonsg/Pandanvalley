import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/Site";
import { SubscriptionPitch } from "@/components/SubscriptionPitch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "SEMS Pricing — Axon 1Pro Smart Estate Management" },
      { name: "description", content: "Indicative subscription pricing for SEMS: setup, monthly platform tiers by resident count, and annual dedicated infrastructure." },
      { property: "og:title", content: "SEMS Pricing — Axon 1Pro" },
      { property: "og:description", content: "Flexible, indicative pricing for condominiums, MCSTs and property-management teams." },
      { property: "og:url", content: "https://sems.axon.com.sg/pricing" },
      { property: "og:image", content: "https://sems.axon.com.sg/og-image.png" },
      { name: "twitter:image", content: "https://sems.axon.com.sg/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://sems.axon.com.sg/pricing" }],
  }),
  component: Page,
});

const TIERS = [
  ["Up to 500 residents", "SGD 200 / month"],
  ["501–700 residents", "SGD 300 / month"],
  ["701–1,000 residents", "SGD 400 / month"],
  ["1,001–3,000 residents", "SGD 400 / month"],
  ["Above 3,000 residents", "Custom Pricing"],
];

const COMPARE = [
  ["Setup / deployment (one-time)", "SGD 4,000", "SGD 2,000 (50% development-partner discount)"],
  ["Monthly platform subscription", "SGD 400 / month (1,001–3,000 residents tier)", "SGD 150 / month fixed for agreed initial scope"],
  ["Annual maintenance / dedicated VPS / updates", "SGD 2,000 / year", "SGD 2,000 / year"],
  ["Third-party API / provider subscriptions", "Client-paid directly", "Excluded — client-paid directly"],
  ["Hardware, on-site work, major custom integrations", "Quoted separately", "Quoted separately"],
];

function Page() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Indicative / prototype pricing" title="SEMS Pricing" sub="Flexible pricing for condominiums, MCSTs and property-management teams." />
      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        <div className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
          All prices are <b>indicative / prototype pricing</b>, in SGD, subject to final scope and a formal quotation. Nothing on this page is contractually final.
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            ["Why subscription?", "AI, security standards, integrations and technology evolve continuously. A subscription lets Axon maintain and improve the platform, instead of leaving you with a custom-built system that becomes obsolete and expensive to maintain."],
            ["Keep what you already have", "Existing facility booking, gate / LPR, CCTV and payment systems do not have to be replaced. SEMS integrates first."],
            ["Quoted separately", "Custom API integrations, hardware (e.g. NFC tags, devices) and on-site work are quoted separately."],
            ["Third-party providers", "SMS, WhatsApp, ElevenLabs, email campaign providers and similar subscriptions are paid directly by the client unless otherwise agreed."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-lg border bg-card p-5"><h3 className="font-display font-bold text-navy">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-navy">Standard pricing</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-5"><div className="text-xs uppercase tracking-wide text-muted-foreground">Setup / deployment</div><div className="mt-2 font-display text-3xl font-extrabold text-navy">SGD 4,000</div><div className="text-sm text-muted-foreground">one-time</div></div>
            <div className="rounded-lg border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Monthly platform subscription</div>
              <ul className="mt-2 space-y-2 text-sm">
                {TIERS.map(([a, b]) => <li key={a} className="flex justify-between gap-2 border-b pb-1 last:border-0"><span>{a}</span><b className="text-navy">{b}</b></li>)}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">Based on total resident/user records. Above 3,000: email <a className="text-primary underline" href="mailto:support@axon.com.sg">support@axon.com.sg</a>.</p>
            </div>
            <div className="rounded-lg border bg-card p-5"><div className="text-xs uppercase tracking-wide text-muted-foreground">Annual maintenance / dedicated infrastructure</div><div className="mt-2 font-display text-3xl font-extrabold text-navy">SGD 2,000</div><div className="text-sm text-muted-foreground">per year</div>
              <p className="mt-2 text-xs text-muted-foreground">Includes the baseline dedicated production environment / VPS allocation, maintenance and system updates for your deployment. Extra high-volume storage, third-party API fees or custom infrastructure may be quoted separately.</p></div>
          </div>
        </section>

        <section className="rounded-xl border-2 border-primary bg-primary/5 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Development partner</div>
          <h2 className="mt-1 font-display text-2xl font-bold text-navy">Special Development-Partner Arrangement — MCST 581 Pandan Valley</h2>
          <p className="mt-3 text-sm text-muted-foreground">Pandan Valley has worked with Axon for many years and is helping validate and refine this prototype and operational workflow. Subject to final agreement and council approval, Axon is prepared to offer:</p>
          <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            <li>Standard setup: <s>SGD 4,000</s></li>
            <li>50% development-partner discount</li>
            <li><b>Special setup: SGD 2,000 one-time</b></li>
            <li><b>Special monthly platform subscription: SGD 150 / month</b>, fixed for the agreed initial scope/resident base during the arrangement</li>
            <li>Annual maintenance / dedicated VPS / system updates: SGD 2,000 / year</li>
            <li>Third-party API/provider subscriptions excluded — paid directly by client unless otherwise agreed</li>
            <li className="md:col-span-2">Custom hardware, on-site work, major custom integrations, native app-store packaging and special third-party services quoted separately</li>
          </ul>
          <div className="mt-4 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-navy">Proposed special arrangement — subject to final scope, council approval and formal quotation.</div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-navy">Standard vs Pandan Valley arrangement</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left"><tr><th className="p-3">Item</th><th className="p-3">Standard (indicative)</th><th className="p-3 text-primary">Pandan Valley (proposed)</th></tr></thead>
              <tbody>{COMPARE.map(([a, b, c]) => <tr key={a} className="border-t"><td className="p-3 font-medium">{a}</td><td className="p-3">{b}</td><td className="p-3 font-semibold text-navy">{c}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Pandan Valley (623 units, ≈1,200 resident users) falls under the 1,001–3,000 standard tier at SGD 400 / month, but receives the proposed development-partner SGD 150 / month rate for the agreed initial scope.</p>
        </section>

        <SubscriptionPitch />

        <section className="rounded-xl bg-navy p-8 text-navy-foreground">
          <h2 className="font-display text-2xl font-bold">Custom pricing</h2>
          <p className="mt-2 max-w-2xl opacity-85">For estates above 3,000 residents, special integrations, enterprise requirements or custom deployment, contact Axon for a tailored quotation.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="secondary"><a href="mailto:support@axon.com.sg?subject=SEMS%20Custom%20Pricing">Email support@axon.com.sg</a></Button>
            <Button asChild variant="outline" className="bg-transparent text-navy-foreground"><a href="https://axon.com.sg" target="_blank" rel="noreferrer">Visit axon.com.sg</a></Button>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}