import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "./brand";
import { Button } from "./ui/button";

const NAV = [
  ["/", "Home"],
  ["/how-it-works", "How It Works"],
  ["/pricing", "Pricing"],
  ["/quotations", "Module Quotations"],
  ["/requirements", "Requirements Discovery"],
  ["/contact", "Contact Us"],
] as const;

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="underline-offset-2 hover:underline">{children}</a>
);

export function SiteFooter() {
  return (
    <footer className="border-t bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
        <div><Logo inverted /><p className="mt-3 text-sm opacity-80">Axon 1Pro Smart Estate Management System v2.0</p><p className="text-sm opacity-80">Axon 1Pro Solutions</p></div>
        <div className="space-y-1 text-sm opacity-85">
          <div><A href="https://axon.com.sg">axon.com.sg</A> | <A href="https://1proit.com">1proit.com</A></div>
          <div><A href="mailto:support@axon.com.sg">support@axon.com.sg</A></div>
          <div>SEMS Demo: <A href="https://sems.axon.com.sg">sems.axon.com.sg</A></div>
          <div>YouTube: <A href="https://youtube.com/@CHATapaNHT">YouTube.com/@CHATapaNHT</A></div>
        </div>
        <div className="space-y-2 text-sm opacity-85">
          <div className="font-semibold">Powered by Axon and 1Pro (Singapore / Philippines)</div>
          <div className="text-xs opacity-85">Custom one-off development available by quotation — <A href="mailto:support@axon.com.sg">support@axon.com.sg</A>.</div>
          <p className="text-xs opacity-80">Third-party services connect via API. Provider subscriptions/usage fees are client-paid unless otherwise agreed.</p>
          <p className="text-xs opacity-70">All names and data in this demo are fictional.</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <Link to="/"><Logo /></Link>
          <nav className="ml-auto hidden items-center gap-4 text-sm lg:flex">
            {NAV.map(([to, label]) => (
              <Link key={to} to={to} className="text-muted-foreground hover:text-navy" activeOptions={{ exact: true }} activeProps={{ className: "font-semibold text-navy" }}>{label}</Link>
            ))}
          </nav>
          <Button asChild size="sm" className="ml-auto lg:ml-0 font-bold"><Link to="/app">VIEW ACTUAL DEMO</Link></Button>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t px-6 py-2 text-xs lg:hidden">
          {NAV.map(([to, label]) => (
            <Link key={to} to={to} className="whitespace-nowrap text-muted-foreground" activeOptions={{ exact: true }} activeProps={{ className: "font-semibold text-navy" }}>{label}</Link>
          ))}
        </nav>
      </header>
      {children}
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <section className="bg-hero grid-pattern text-navy-foreground">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">{eyebrow}</div>
        <h1 className="mt-2 font-display text-4xl font-extrabold">{title}</h1>
        <p className="mt-3 max-w-2xl opacity-80">{sub}</p>
      </div>
    </section>
  );
}