import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, ExternalLink, KeyRound, Lock, RotateCcw, Send, Sparkles } from "lucide-react";
import { PageTitle } from "@/components/AppShell";
import { DemoNote, Panel, StatusBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDemoMutations } from "@/lib/useDemo";
import { getSecretStatus, renderEmailHtml, resetDemo, runAi, sendTestEmail, TABLES } from "@/lib/demo.functions";
import { Field, NSelect, type PageProps } from "./common";
import { AddonBanner } from "./addon";
import { OpenApiCard, ProviderCards } from "./campaigns";
import { ProviderRegistry } from "./registry";

const setting = (d: PageProps["d"], k: string) => d.settings.find((s) => s.key === k)?.value ?? {};
function useSecrets() {
  const f = useServerFn(getSecretStatus);
  return useQuery({ queryKey: ["secrets"], queryFn: () => f() });
}

/* ---------------- Integrations ---------------- */
const CONNECTORS = [
  { key: "facility", name: "A · Resident / Property Systems", opts: ["Homeplus (Current)", "iCondo", "BuildingLink", "Excel/CSV", "Custom API", "Axon Resident Master"] },
  { key: "booking", name: "B · Facility Booking", opts: ["Homeplus (Current)", "iCondo", "BuildingLink", "Custom API", "Standalone Axon (optional)"] },
  { key: "gate", name: "C · Gate / Access / LPR", opts: ["Homeplus LPR (Current)", "Hikvision", "Dahua", "Suprema", "ZKTeco", "Custom API"] },
  { key: "cctv", name: "D · CCTV", opts: ["Existing CCTV", "Hikvision", "Dahua", "Custom API"] },
  { key: "finance", name: "E · Finance / Accounting", opts: ["Excel/CSV", "Custom API", "Xero", "QuickBooks"] },
  { key: "identity", name: "Facial / Identity", opts: ["Axon Selfie Verification", "Suprema", "ZKTeco", "Custom API", "Disabled"] },
  { key: "patrol", name: "Security / Patrol", opts: ["Axon NFC+GPS", "Existing Provider", "Custom API"] },
];

type Tone = "success" | "info" | "warning" | "danger" | "muted";
function connectorStatus(v: string): { label: string; status: string; api: string; tone: Tone } {
  if (v.startsWith("Homeplus")) return { label: "Current", status: "Current system · integration assessment pending", api: "API access required", tone: "warning" };
  if (v === "Existing CCTV" || v === "Existing Provider") return { label: "Current", status: "Current system · not integrated", api: "To be assessed", tone: "warning" };
  if (v === "Axon NFC+GPS" || v === "Axon Resident Master") return { label: "Connected", status: "Axon module (demo)", api: "Native", tone: "success" };
  if (v === "Excel/CSV") return { label: "Optional", status: "File import / export (demo)", api: "No API needed", tone: "info" };
  if (v.startsWith("Standalone Axon")) return { label: "Optional", status: "Only if the client needs it", api: "Native", tone: "info" };
  if (v === "Axon Selfie Verification") return { label: "Pending API", status: "Pending PDPA/biometric confirmation", api: "Native", tone: "warning" };
  if (v === "Disabled" || v === "None") return { label: "Optional", status: "Disabled", api: "—", tone: "muted" };
  if (v === "Custom API") return { label: "Pending API", status: "Requires API spec", api: "To be provided", tone: "warning" };
  return { label: "Coming Soon", status: "Example only · not integrated", api: "Vendor API availability to confirm", tone: "info" };
}

export function Integrations({ d, role }: PageProps) {
  const { update } = useDemoMutations();
  const sec = useSecrets();
  const cfg = setting(d, "integrations");
  const [configure, setConfigure] = useState<string | null>(null);
  const save = (k: string, v: string) => update.mutate({ table: "settings", id: "integrations", patch: { value: { ...cfg, [k]: v } }, action: `Integration ${k} set to ${v}` });
  const fixed: { name: string; rows: [string, string, Tone, string][] }[] = [
    { name: "F · Communications", rows: [
      ["Axon SMTP (Mailtrap)", sec.data?.mailtrap ? "Connected" : "Pending API", sec.data?.mailtrap ? "success" : "warning", sec.data?.mailtrap ? "Server secret configured (hidden)" : "Secret not configured — simulation"],
      ["SMS gateway", "Optional", "warning", "Subscription required — usage charges apply"],
      ["WhatsApp Business / API", "Coming Soon", "info", "Not integrated"],
    ] },
    { name: "G · AI", rows: [["SEA-LION — AI Singapore", sec.data?.seaLion ? "Connected · POC" : "Pending API", sec.data?.seaLion ? "success" : "warning", "Free development API, 10 req/min — not a production entitlement"]] },
  ];
  return (
    <div className="space-y-4">
      <PageTitle title="Integrations / API Settings" sub="Integrate first. Replace only if there is a business reason." />
      <AddonBanner />
      <DemoNote>Only Axon SMTP (Mailtrap) and SEA-LION make live calls. Every other connector is Current, Pending API, Coming Soon or Optional — Test Connection is a simulation.</DemoNote>
      <ProviderRegistry d={d} role={role} />
      <h3 className="pt-2 font-display text-lg font-bold text-navy">Active connector selection</h3>
      <OpenApiCard />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CONNECTORS.map((c) => {
          const v = cfg[c.key] ?? c.opts[0];
          const s = connectorStatus(v);
          return (
            <div key={c.key} className="flex flex-col rounded-lg border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between gap-2"><div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.name}</div><StatusBadge value={s.label} kind={s.tone} /></div>
              <NSelect className="mt-2" value={v} onChange={(e) => save(c.key, e.target.value)} options={c.opts} />
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-2"><span className="text-muted-foreground">Status</span><span className="text-right font-medium">{s.status}</span></div>
                <div className="flex justify-between gap-2"><span className="text-muted-foreground">API availability</span><span className="text-right font-medium">{s.api}</span></div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info(`Demo test for ${v}: no live endpoint configured. Integration not yet available.`)}>Test Connection (demo)</Button>
                <Button size="sm" variant="ghost" onClick={() => setConfigure(c.name)}><KeyRound className="h-3.5 w-3.5" /> Configure API</Button>
              </div>
            </div>
          );
        })}
        {fixed.map((g) => (
          <div key={g.name} className="rounded-lg border bg-card p-4 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.name}</div>
            <ul className="mt-2 space-y-2 text-xs">{g.rows.map(([n, l, t, note]) => <li key={n}><div className="flex items-center justify-between gap-2"><span className="font-medium text-navy">{n}</span><StatusBadge value={l} kind={t} /></div><div className="text-muted-foreground">{note}</div></li>)}</ul>
          </div>
        ))}
      </div>
      <Dialog open={!!configure} onOpenChange={(o) => !o && setConfigure(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-navy">Configure API — {configure}</DialogTitle></DialogHeader>
          <Field label="Base URL"><Input placeholder="https://api.provider.example" disabled /></Field>
          <Field label="API key"><Input placeholder="Stored as a server secret in production" disabled /></Field>
          <DemoNote>Credentials are never entered in the browser. In production, keys are stored as server-side secrets after the provider grants API access.</DemoNote>
        </DialogContent>
      </Dialog>
      <h3 className="pt-2 font-display text-lg font-bold text-navy">Email / Marketing · SMS · WhatsApp · Voice / AI Voice</h3>
      <ProviderCards d={d} cats={["Email", "SMS", "WhatsApp", "Voice"]} />
    </div>
  );
}

/* ---------------- AI ---------------- */
const AI_TOGGLES: [string, string, string?][] = [
  ["ticket_classification", "Ticket classification"], ["duplicate_detection", "Duplicate detection"], ["summaries", "Summaries"], ["draft_replies", "Draft replies"],
  ["attendance_anomalies", "Attendance anomalies"], ["vendor_scoring", "Vendor scoring"], ["maintenance_patterns", "Maintenance patterns"], ["monthly_reports", "Monthly reports"],
  ["before_after_review", "Before/after photo review", "Multimodal deployment to be confirmed"],
];

export function AiSettings({ d }: PageProps) {
  const { update } = useDemoMutations();
  const sec = useSecrets();
  const cfg = setting(d, "ai");
  const ai = useServerFn(runAi);
  const [input, setInput] = useState("There are cockroaches near the refuse chute on level 7, please help.");
  const [task, setTask] = useState<"classify" | "draft_reply" | "summary" | "anomaly">("classify");
  const [out, setOut] = useState<{ mode: string; output: string } | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="max-w-5xl space-y-5">
      <PageTitle title="AI Settings" sub="AI Assistance powered by SEA-LION — AI Singapore" />
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <Panel title="AI Assistance powered by SEA-LION — AI Singapore"><p className="text-sm text-muted-foreground">Current demo uses the free POC/development API (10 requests/minute) — not a production or commercial entitlement. Human approval stays ON for sensitive actions. The key stays on the server.</p></Panel>
        <Panel title="Why SEA-LION"><ul className="list-disc pl-5 text-sm text-muted-foreground"><li>Built for Southeast Asian languages and local context (Singlish, Malay, Tagalog, Mandarin and more).</li><li>Part of Singapore's national AI ecosystem (AI Singapore).</li><li>Optional secure/private deployment strategy, subject to the production architecture.</li></ul></Panel>
      </div>
      <Panel>
        <div className="grid gap-4 md:grid-cols-4">
          <div><div className="text-xs text-muted-foreground">Provider</div><div className="font-semibold text-navy">SEA-LION — AI Singapore</div></div>
          <div><div className="text-xs text-muted-foreground">Plan</div><div className="font-semibold">POC free trial</div></div>
          <div><div className="text-xs text-muted-foreground">Rate limit</div><div className="font-semibold">10 requests / min</div></div>
          <div><div className="text-xs text-muted-foreground">Server secret SEA_LION_API_KEY</div>{sec.isLoading ? "…" : sec.data?.seaLion ? <StatusBadge value="Configured (value hidden)" kind="success" /> : <StatusBadge value="Not configured — simulation" kind="warning" />}</div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Production use is subject to an approved production arrangement. <a className="inline-flex items-center gap-1 text-primary underline" href="https://playground.sea-lion.ai/" target="_blank" rel="noreferrer">SEA-LION playground <ExternalLink className="h-3 w-3" /></a></p>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Features">
          <div className="divide-y">
            {AI_TOGGLES.map(([k, l, note]) => (
              <div key={k} className="flex items-center justify-between py-2.5">
                <div><div className="text-sm font-medium">{l}</div>{note && <div className="text-xs text-warning-foreground">{note}</div>}</div>
                <Switch checked={!!cfg[k]} onCheckedChange={(v) => update.mutate({ table: "settings", id: "ai", patch: { value: { ...cfg, [k]: v } }, action: `AI ${l} ${v ? "on" : "off"}` })} />
              </div>
            ))}
            <div className="flex items-center justify-between py-2.5">
              <div><div className="flex items-center gap-1.5 text-sm font-medium"><Lock className="h-3.5 w-3.5" /> Human approval for sensitive actions</div><div className="text-xs text-muted-foreground">Locked ON — AI never approves, deducts or replies on its own</div></div>
              <Switch checked disabled />
            </div>
          </div>
        </Panel>
        <Panel title="Try it">
          <div className="space-y-3">
            <NSelect value={task} onChange={(e) => setTask(e.target.value as any)} options={[{ v: "classify", l: "Ticket classification" }, { v: "draft_reply", l: "Draft reply" }, { v: "summary", l: "Summary" }, { v: "anomaly", l: "Attendance anomalies" }]} />
            <Textarea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
            <Button disabled={busy || !input} onClick={async () => { setBusy(true); setOut(await ai({ data: { task, input } })); setBusy(false); }}><Sparkles className="h-4 w-4" /> {busy ? "Running…" : "Run"}</Button>
            {out && <div className="rounded-md border bg-muted/50 p-3"><StatusBadge value={out.mode === "live" ? "LIVE · SEA-LION" : out.mode.toUpperCase()} kind={out.mode === "live" ? "success" : "warning"} /><pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{out.output}</pre></div>}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Email ---------------- */
export function EmailSettings({ d }: PageProps) {
  const { update } = useDemoMutations();
  const sec = useSecrets();
  const cfg = setting(d, "email");
  const [name, setName] = useState<string>(cfg.display_name);
  const [tpl, setTpl] = useState<Record<string, string>>(cfg.templates ?? {});
  const [prev, setPrev] = useState("work_order");
  const [to, setTo] = useState("");
  const send = useServerFn(sendTestEmail);
  const sample = (s: string) => s.replace("{{work_order}}", "WO-2026-102").replace("{{pass_id}}", "CP-4002").replace("{{ticket_id}}", "TK-3003");
  const html = renderEmailHtml(sample(tpl[prev] ?? ""), "Dear Recipient,<br/><br/>This is an automated update from the Pandan Valley estate management system. Please review the details in the Axon portal.", "View in Axon Portal");
  return (
    <div className="space-y-5">
      <PageTitle title="Email / SMTP Settings" sub="Notification emails from the verified axon.com.sg domain" />
      <Panel>
        <div className="grid gap-4 md:grid-cols-4 text-sm">
          <div><div className="text-xs text-muted-foreground">Provider</div><div className="font-semibold text-navy">Axon SMTP API (Mailtrap)</div></div>
          <div><div className="text-xs text-muted-foreground">Verified sender domain</div><div className="font-semibold">axon.com.sg <StatusBadge value="Verified" kind="success" /></div></div>
          <div><div className="text-xs text-muted-foreground">Sender</div><div className="font-mono">amit@axon.com.sg</div></div>
          <div><div className="text-xs text-muted-foreground">Server secret MAILTRAP</div>{sec.isLoading ? "…" : sec.data?.mailtrap ? <StatusBadge value="Configured (token hidden)" kind="success" /> : <StatusBadge value="Not configured — simulation" kind="warning" />}</div>
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Templates">
          <div className="space-y-3">
            <Field label="Default display name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            {Object.entries(tpl).map(([k, v]) => <Field key={k} label={k.replace("_", " ").toUpperCase()}><Input className="font-mono text-xs" value={v} onFocus={() => setPrev(k)} onChange={(e) => setTpl({ ...tpl, [k]: e.target.value })} /></Field>)}
            <Button onClick={() => update.mutate({ table: "settings", id: "email", patch: { value: { ...cfg, display_name: name, templates: tpl } }, action: "Updated email templates" })}>Save templates</Button>
            <div className="border-t pt-3">
              <Field label="Send test email to"><div className="flex gap-2"><Input type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="you@example.com" /><Button variant="outline" disabled={!to.includes("@")} onClick={async () => { try { const r = await send({ data: { to, subject: sample(tpl[prev] ?? ""), displayName: name } }); (r.mode === "live" ? toast.success : r.mode === "error" ? toast.error : toast.info)(r.message); } catch { toast.error("Invalid email address"); } }}><Send className="h-4 w-4" /> Send test</Button></div></Field>
            </div>
            <div className="border-t pt-3">
              <div className="mb-2 text-xs font-semibold text-muted-foreground">Example triggers (manual, demo only — sends one email to the address above)</div>
              <div className="flex flex-wrap gap-2">
                {[["work_order", "Work order assigned", "Work order WO-2026-102 (Landscape pruning, Block 3) has been assigned to your company. Please upload before/after evidence in the Axon portal."], ["contractor_pass", "Contractor pass approved", "Contractor pass CP-4002 for unit #05-12 has been approved by the Managing Agent. Present the QR pass at the gate; deposit terms apply."], ["ticket", "Ticket update", "Your ticket TK-3003 has a new reply from the Managing Agent. Log in to view the update."], ["sla", "SLA alert", "Ticket TK-3003 is approaching its SLA due time. Please review and reassign if needed."]].map(([k, l, b]) => {
                  const key = Object.keys(tpl).find((x) => x.startsWith(k!.split("_")[0]!)) ?? k!;
                  return <Button key={k} size="sm" variant="secondary" disabled={!to.includes("@")} onClick={async () => { setPrev(key); const r = await send({ data: { to, subject: sample(tpl[key] ?? l!), displayName: name, body: b } }); (r.mode === "live" ? toast.success : r.mode === "error" ? toast.error : toast.info)(r.message); }}>{l}</Button>;
                })}
              </div>
            </div>
          </div>
        </Panel>
        <Panel title="Preview">
          <div className="mb-2 text-xs text-muted-foreground">From: {name} &lt;amit@axon.com.sg&gt; · Subject: <b>{sample(tpl[prev] ?? "")}</b></div>
          <iframe title="Email preview" srcDoc={html} className="h-[420px] w-full rounded-md border" />
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Demo Data ---------------- */
export function DemoData({ d }: PageProps) {
  const qc = useQueryClient();
  const reset = useServerFn(resetDemo);
  const [t, setT] = useState<string>("work_orders");
  const [busy, setBusy] = useState(false);
  const download = () => {
    const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), estate: "MCST 581 Pandan Valley (demo)", data: d }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `axon-pandan-valley-demo-${Date.now()}.json`;
    a.click();
  };
  return (
    <div className="space-y-5">
      <PageTitle title="Demo Data" sub="Database counts, JSON export and reset" actions={<>
        <Button variant="outline" onClick={download}><Download className="h-4 w-4" /> Download JSON</Button>
        <Button variant="destructive" disabled={busy} onClick={async () => { if (!confirm("Reset all demo data to the original seed? All changes will be lost.")) return; setBusy(true); await reset(); await qc.invalidateQueries({ queryKey: ["demo"] }); setBusy(false); toast.success("Demo reset to seed"); }}><RotateCcw className="h-4 w-4" /> {busy ? "Resetting…" : "Reset to seed"}</Button>
      </>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {TABLES.map((k) => (
          <button key={k} onClick={() => setT(k)} className={`rounded-lg border bg-card p-3 text-left shadow-card ${t === k ? "border-primary ring-2 ring-primary/20" : ""}`}>
            <div className="font-mono text-[11px] text-muted-foreground">{k}</div>
            <div className="font-display text-2xl font-bold text-navy">{d[k].length}</div>
          </button>
        ))}
      </div>
      <Panel title={`JSON preview — ${t}`}>
        <pre className="max-h-[480px] overflow-auto rounded bg-navy p-3 font-mono text-xs text-navy-foreground">{JSON.stringify(d[t as keyof typeof d], null, 2)}</pre>
      </Panel>
      <p className="text-xs text-muted-foreground">Source seed: <span className="font-mono">src/data/seed.json</span> (mirrors the database seed routine used by Reset).</p>
    </div>
  );
}