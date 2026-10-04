import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, ClipboardList, Footprints, MessageSquare, ShieldCheck, Sparkles, Truck, UserCheck } from "lucide-react";
import { SiteLayout } from "@/components/Site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Axon 1Pro Smart Estate Management System v2.0 — Pandan Valley Demo" },
      { name: "description", content: "Live demo for MCST 581 Pandan Valley: work orders, vendor attendance, contractor passes, resident tickets, patrol and SLA." },
      { property: "og:title", content: "Axon 1Pro Smart Estate Management System v2.0" },
      { property: "og:description", content: "Enterprise estate management demo for MCST 581 Pandan Valley Condominium." },
      { property: "og:url", content: "https://sems.axon.com.sg/" },
      { property: "og:image", content: "https://sems.axon.com.sg/og-image.png" },
      { name: "twitter:image", content: "https://sems.axon.com.sg/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://sems.axon.com.sg/" }],
  }),
  component: Landing,
});

const CAPS = ["Resident Master & Unit Directory", "Resident PWA / client login", "Issue reporting with photo upload", "Ticket tracking, follow-ups, reopen & escalation", "MA public replies + private internal notes", "Notices, circulars & monthly archive", "Targeted mass email", "Optional SMS (subscription / usage fees)", "Vendor attendance, geo-fence & re-entry", "Work orders + before/after evidence", "MA sign-off & rectification", "Contractor/mover workflow + QR pass", "NFC + GPS patrol / cleaning / landscape", "MA Tasks / Work Queue / escalation", "Automation Centre", "Excel/CSV import → structured workflows", "SLA / demerit / compliance recommendations", "Council / management reporting", "SEA-LION AI assistance", "Integration/API layer (Homeplus & others)"];
const ROLES = ["MA/Admin", "Security", "Vendor", "Resident", "Council"];
const MODULES = [
  { i: ClipboardList, t: "Work Orders", d: "15 categories, before + after evidence, MA approval, 3-year retention." },
  { i: UserCheck, t: "Vendor Attendance", d: "Per-worker gate records, 30-min grace, re-entry, MA alerts." },
  { i: Truck, t: "Contractor & Mover Passes", d: "Deposit, approval, multiple entry, email + SMS." },
  { i: MessageSquare, t: "Resident Tickets", d: "Login-only submissions, MA-controlled assignment and replies." },
  { i: Footprints, t: "NFC/GPS Patrol", d: "≈50 checkpoints with pending and missed tracking." },
  { i: ShieldCheck, t: "SLA & Demerits", d: "Human-approved demerits against contract thresholds." },
];

function Landing() {
  return (
    <SiteLayout>
      <section className="bg-hero grid-pattern text-navy-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" /> MCST 581 · Pandan Valley Condominium
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Axon 1Pro Smart Estate Management <span className="text-sidebar-primary">v2.0</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg opacity-85">
            One workspace for the Managing Agent, Security, Vendors, Residents and Council — built around how 623 units, 3 gates and ~20 regular vendors actually run today.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" variant="destructive" className="h-14 px-8 text-base font-bold tracking-wide">
              <Link to="/app">VIEW ACTUAL DEMO <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/how-it-works" className="underline-offset-4 opacity-85 hover:underline">How It Works</Link>
              <Link to="/quotations" className="underline-offset-4 opacity-85 hover:underline">Module Quotations</Link>
              <Link to="/requirements" className="underline-offset-4 opacity-85 hover:underline">Requirements Discovery</Link>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {ROLES.map((r) => <span key={r} className="rounded-md border border-navy-foreground/25 bg-navy-foreground/10 px-3 py-1.5 text-sm font-medium">{r}</span>)}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/40">
        <div className="mx-auto w-full max-w-[1448px] px-6 py-16 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">System Overview</div>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">SEMS at a Glance</h2>
          <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">See how Axon 1Pro Smart Estate Management System connects Residents, MA/Admin, Security, Vendors, Council, communications, automation, AI and third-party integrations in one platform.</p>
          <div className="mx-auto mt-8 w-full max-w-[1400px]">
            <img
              src="https://amitaxonsg.github.io/Pandanvalley/axon-smart-estate-management-singapore.png"
              alt="Axon 1Pro Smart Estate Management System overview infographic"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-xl border bg-card shadow-card"
            />
          </div>
          <div className="mx-auto mt-6 grid max-w-5xl gap-3 text-left md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-card">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-semibold text-navy">Integrate first. Replace only if there is a business reason.</p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-card">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">Resident PWA, operations workflows, Email/SMS/WhatsApp/Voice communications, SEA-LION AI and dedicated client deployment in one platform.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <h2 className="font-display text-3xl font-bold text-navy">Smarter estate operations — without throwing away systems you already paid for.</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">Axon 1Pro Smart Estate Management System is an add-on smart operations, automation and accountability layer. Keep existing booking, gate/access, CCTV and payment systems unless there is a business reason to replace them. At Pandan Valley, Homeplus remains current for resident, facility, visitor and LPR functions (API integration assessment pending).</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {([["Keep existing systems", <>Homeplus booking, visitors and LPR, CCTV and payments stay in place.</>], ["Connect data and workflows", <>API, import or connector — integrate first, replace only if there is a business reason.</>], ["Automate manual Excel/email work", <>Turn recurring spreadsheets, reminders and email chasing into tracked workflows.</>], ["Resident self-service PWA", <>Report issues with photos, track tickets, read notices — installable on phones and desktops.</>], ["AI-assisted operations", <>AI Assistance powered by SEA-LION — AI Singapore, with human approval for sensitive actions.</>], ["Dedicated client environment", <>Recommended production model: your own secure VPS per MCST, running at <strong className="font-bold text-navy">https://SEMS.yourdomainname.com</strong> — dedicated app, database and storage, not a shared tenancy.</>]] as [string, ReactNode][]).map(([t, d]) => (
            <div key={t} className="rounded-lg border-t-4 border-primary bg-card p-5 shadow-card"><div className="font-semibold text-navy">{t}</div><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
        <h2 className="mt-14 font-display text-3xl font-bold text-navy">What SEMS does</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">An add-on smart operations, automation and accountability platform for condominiums and MCSTs. Integrate first. Replace only if there is a business reason.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CAPS.map((c) => <div key={c} className="flex items-start gap-2 rounded-md border bg-card p-3 text-sm"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />{c}</div>)}
        </div>
        <Button asChild size="lg" className="mt-6"><Link to="/app">VIEW ACTUAL DEMO <ArrowRight className="h-5 w-5" /></Link></Button>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {[["623", "units"], ["≈1,200", "resident users"], ["3 gates", "≈50 checkpoints"], ["≈20", "regular vendors"]].map(([a, b]) => (
            <div key={b} className="rounded-lg border bg-card p-5 shadow-card"><div className="font-display text-3xl font-extrabold text-navy">{a}</div><div className="text-sm text-muted-foreground">{b}</div></div>
          ))}
        </div>
        <h2 className="mt-16 font-display text-3xl font-bold text-navy">Additional capabilities</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {MODULES.map((m) => (
            <div key={m.t} className="rounded-lg border bg-card p-5 shadow-card">
              <m.i className="h-6 w-6 text-primary" />
              <div className="mt-3 font-semibold text-navy">{m.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><Sparkles className="h-4 w-4" /> AI proof of concept</div>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy">Powered by SEA-LION, AI Singapore</h2>
            <p className="mt-3 text-muted-foreground">Regional language model for ticket classification, duplicate detection, summaries, draft replies, attendance anomalies and monthly reports. Every sensitive action stays with a human.</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="rounded-md border p-4"><b className="text-navy">Current: free trial</b> — limited to 10 requests per minute.</div>
            <div className="rounded-md border p-4"><b className="text-navy">Production</b> — subject to an approved production arrangement.</div>
            <div className="rounded-md border p-4"><b className="text-navy">Human approval</b> — locked on for replies, approvals and demerits.</div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}