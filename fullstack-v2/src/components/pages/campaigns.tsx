import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, MessageCircle, Mic, Plus, Send, Smartphone } from "lucide-react";
import { PageTitle } from "@/components/AppShell";
import { DemoNote, Kpi, Panel, StatusBadge } from "@/components/brand";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDemoMutations, nextId } from "@/lib/useDemo";
import { DEMO_UNIT } from "@/lib/roles";
import { renderEmailHtml, sendTestEmail } from "@/lib/demo.functions";
const escH = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
import { Communications } from "./addon";
import { Field, fmt, NSelect, type PageProps } from "./common";

const now = () => new Date().toISOString();
type D = PageProps["d"];

export const CAMPAIGN_TYPES = ["Estate Notice", "Monthly Circular", "Announcement", "Maintenance Advisory", "Emergency Notice", "Event / AGM / Council", "Contractor Works", "Marketing / Promotion", "Survey / Feedback Request"];
const CATS = ["General", "Maintenance", "Water Shutdown", "Lift", "Security", "Facilities", "Event", "AGM/Council", "Emergency", "Contractor Works"];
const AUDS = ["All Residents", "Owners", "Tenants", "Occupants", "Selected Blocks", "Selected Units", "Custom Segment", "Communication opt-in only"];
const CHANNELS = ["PWA", "Email", "SMS", "WhatsApp", "Voice"];
const OPT: Record<string, string> = { Email: "opt_email", SMS: "opt_sms", WhatsApp: "opt_whatsapp", Voice: "opt_voice" };
const PROV_CAT: Record<string, string> = { Email: "Email", SMS: "SMS", WhatsApp: "WhatsApp", Voice: "Voice" };

export const segments = (n: string) => Math.max(1, Math.ceil(n.length / (/[^\x00-\x7F]/.test(n) ? 70 : 160)));

/** Recipients for an audience + channel, honouring per-channel opt-in (essential/emergency notices ignore opt-out). */
export function recipientsFor(d: D, audience: string, channel: string, extra: string, essential: boolean) {
  const units = d.units;
  let rs = d.residents.filter((r) => r.status === "Active");
  if (audience === "Owners") rs = rs.filter((r) => /owner/i.test(r.resident_type ?? ""));
  if (audience === "Tenants") rs = rs.filter((r) => /tenant/i.test(r.resident_type ?? ""));
  if (audience === "Occupants") rs = rs.filter((r) => /occupant/i.test(r.resident_type ?? ""));
  if (audience === "Selected Blocks" && extra) rs = rs.filter((r) => extra.split(",").map((x) => x.trim().toUpperCase()).includes(String(units.find((u) => u.id === r.unit_id)?.block ?? "").toUpperCase()));
  if (audience === "Selected Units" && extra) rs = rs.filter((r) => extra.split(",").map((x) => x.trim()).includes(units.find((u) => u.id === r.unit_id)?.unit));
  if (audience === "Communication opt-in only") rs = rs.filter((r) => r.opt_email || r.opt_sms || r.opt_whatsapp);
  const key = OPT[channel];
  if (key && !essential) rs = rs.filter((r) => r[key]);
  return rs;
}

const providerFor = (d: D, ch: string) => d.provider_configs.find((p) => p.category === PROV_CAT[ch] && p.selected) ?? null;
const channelLive = (d: D, ch: string) => ch === "PWA" || providerFor(d, ch)?.status === "Connected";

export function OpenApiCard() {
  return (
    <div className="rounded-lg border-l-4 border-primary bg-card p-4 shadow-card">
      <div className="font-display text-lg font-bold text-navy">SEMS is an open integration platform — not a closed ecosystem.</div>
      <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
        <li>Third-party services connect through API, SMTP, webhook, CSV/Excel or a custom connector.</li>
        <li>The client may use any provider with a suitable API. Providers listed in SEMS are examples, not an exclusive list.</li>
        <li>If your preferred provider — including any WhatsApp BSP — is not listed, contact Axon at support@axon.com.sg for an integration assessment.</li>
        <li>Third-party subscription/API/usage charges are paid directly by the client unless explicitly included in an Axon quotation. API integration/development may be quoted separately.</li>
      </ul>
      <Button asChild variant="outline" size="sm" className="mt-3"><a href="mailto:support@axon.com.sg?subject=SEMS%20provider%20integration%20request">Need another provider? Email support@axon.com.sg for integration.</a></Button>
    </div>
  );
}

const tone = (s: string) => (s === "Connected" || s === "Current" ? "success" : s === "Coming Soon" ? "muted" : s === "API Required" ? "info" : "warning") as any;

export function ProviderCards({ d, cats }: { d: D; cats: string[] }) {
  const { update } = useDemoMutations();
  const [cfg, setCfg] = useState<any>(null);
  return (
    <div className="space-y-4">
      {cats.map((c) => (
        <Panel key={c} title={`${c} providers`}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {d.provider_configs.filter((p) => p.category === c).map((p) => (
              <div key={p.id} className={`rounded-md border p-3 text-sm ${p.selected ? "border-primary" : ""}`}>
                <div className="flex items-start justify-between gap-2"><div className="font-semibold text-navy">{p.provider}</div><StatusBadge value={p.status} kind={tone(p.status)} /></div>
                <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
                  <dt className="text-muted-foreground">Category</dt><dd>{p.category}</dd>
                  <dt className="text-muted-foreground">Auth</dt><dd>{p.auth_type}</dd>
                  <dt className="text-muted-foreground">Configured by</dt><dd>{p.configured_by}</dd>
                  <dt className="text-muted-foreground">Subscription</dt><dd>{p.subscription_owner}</dd>
                  <dt className="text-muted-foreground">Webhook</dt><dd>{p.webhook_status}</dd>
                </dl>
                <p className="mt-1 text-xs text-muted-foreground">{p.notes}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => toast(p.status === "Connected" ? `${p.provider}: connected (server key present). Use Email Settings for a real test send.` : `${p.provider}: DEMO test — not configured, no request sent.`)}>Test connection</Button>
                  <Button size="sm" variant="outline" onClick={() => setCfg(p)}>Configure</Button>
                  {!p.selected && p.status !== "Coming Soon" && <Button size="sm" variant="ghost" onClick={() => { d.provider_configs.filter((x) => x.category === c && x.selected).forEach((x) => update.mutate({ table: "provider_configs", id: x.id, patch: { selected: false } })); update.mutate({ table: "provider_configs", id: p.id, patch: { selected: true }, action: `Selected ${p.provider} for ${c}`, toast: `${p.provider} selected (demo)` }); }}>Use for {c}</Button>}
                  {p.selected && <span className="self-center text-xs font-medium text-primary">Selected</span>}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ))}
      <Dialog open={!!cfg} onOpenChange={(o) => !o && setCfg(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configure {cfg?.provider}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Credentials ({cfg?.auth_type}) are never entered in the browser. In production Axon stores them as encrypted server-side secrets for your environment, then this card switches to Connected after a successful test.</p>
          <p className="text-sm">Subscription owner: <strong>{cfg?.subscription_owner}</strong> — the client pays the provider directly unless the Axon quotation says otherwise.</p>
          <Button asChild><a href={`mailto:support@axon.com.sg?subject=${encodeURIComponent(`Configure ${cfg?.provider ?? ""} for SEMS`)}`}>Request configuration from Axon</a></Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const blank = (type = "Estate Notice", channels = "PWA,Email") => ({ name: "", type, subject: "", category: type === "Emergency Notice" ? "Emergency" : "General", audience: "All Residents", extra: "", channels, schedule_at: "", expiry: "", body: "", attachment: "", cta_label: "", cta_url: "", ack_required: false, sender: "Axon 1Pro Smart Estate Management", tags: "", wa_template: "", wa_language: "en", wa_vars: "" });

function Composer({ d, init, onClose }: { d: D; init: any; onClose: () => void }) {
  const { create, update } = useDemoMutations();
  const send = useServerFn(sendTestEmail);
  const [f, setF] = useState<any>(init);
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState("");
  const [testTo, setTestTo] = useState("");
  const [id] = useState(init.id ?? `CP-${String(Number(nextId(d.campaigns, "", 0))).padStart(3, "0")}`);
  const chans: string[] = f.channels ? f.channels.split(",").filter(Boolean) : [];
  const essential = f.type === "Emergency Notice";
  const marketing = f.type === "Marketing / Promotion";
  const toggle = (c: string) => setF({ ...f, channels: (chans.includes(c) ? chans.filter((x) => x !== c) : [...chans, c]).join(",") });
  const counts = chans.map((c) => [c, c === "PWA" ? recipientsFor(d, f.audience, "PWA", f.extra, true).length : recipientsFor(d, f.audience, c, f.extra, essential).filter((r) => !marketing || r.opt_marketing).length] as const);
  const save = (patch: any, action: string) => {
    const row = { id, name: f.name, type: f.type, subject: f.subject, category: f.category, audience: f.extra ? `${f.audience}: ${f.extra}` : f.audience, channels: f.channels, schedule_at: f.schedule_at, expiry: f.expiry, body: f.wa_vars ? `${f.body}\n\nWhatsApp variables: ${f.wa_vars}` : f.body, attachment: f.attachment, cta_label: f.cta_label, cta_url: f.cta_url, ack_required: f.ack_required, sender: f.sender, tags: f.tags, wa_template: f.wa_template, wa_language: f.wa_language, created_by: "Condo Manager (Demo)", created_at: now(), ...patch };
    if (d.campaigns.some((c) => c.id === id)) update.mutate({ table: "campaigns", id, patch: row, action, toast: action });
    else create.mutate({ table: "campaigns", row: { status: "Draft", approval_status: "Pending", ...row }, action, toast: action });
  };
  const doPreview = () => { setPreview(renderEmailHtml(escH(f.subject || f.name), escH(f.body || "(empty)"), f.cta_label || "Open Axon Portal")); setStep(1); };
  const doSend = () => {
    const total = counts.reduce((a, [, n]) => a + n, 0);
    const rows: any[] = [];
    counts.forEach(([c, n]) => {
      const live = channelLive(d, c);
      recipientsFor(d, f.audience, c, f.extra, c === "PWA" || essential).slice(0, n).slice(0, 5).forEach((r, i) => rows.push({ id: `CD-${Date.now()}-${c}-${i}`, campaign_id: id, channel: c, recipient: c === "PWA" ? DEMO_UNIT : String(r.email ?? r.mobile ?? r.name).replace(/^(.).*(@.*)?$/, "$1***$2"), unit: d.units.find((u) => u.id === r.unit_id)?.unit ?? "", status: c === "PWA" ? "Delivered" : live ? "Demo" : "Simulated", at: now(), detail: c === "PWA" ? "Portal notification" : live ? "Demo — bulk send disabled in demo" : `Simulated — ${c} provider not configured` }));
    });
    rows.forEach((row) => create.mutate({ table: "campaign_deliveries", row }));
    const scheduled = f.schedule_at && f.schedule_at > now().slice(0, 16);
    save({ status: scheduled ? "Scheduled" : "Sent", recipients: total, delivered: counts.filter(([c]) => c === "PWA").reduce((a, [, n]) => a + n, 0), failed: 0 }, scheduled ? `Scheduled campaign ${id}` : `Campaign ${id} sent (demo — no real bulk send)`);
    onClose();
  };
  const camp = d.campaigns.find((c) => c.id === id);
  const approved = camp?.approval_status === "Approved";
  const STEPS = ["Draft", "Preview", "Test Send", "Approval", "Schedule / Send"];
  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader><DialogTitle>Campaign {id}</DialogTitle></DialogHeader>
      <div className="flex flex-wrap gap-1 text-xs">{STEPS.map((s, i) => <button key={s} onClick={() => setStep(i)} className={`rounded-full border px-3 py-1 ${i === step ? "border-primary bg-primary text-primary-foreground" : ""}`}>{i + 1}. {s}</button>)}</div>
      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Campaign name"><Input aria-label="Campaign name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Subject / title"><Input aria-label="Subject" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} placeholder="[Pandan Valley] Estate Notice — {{title}}" /></Field>
          <Field label="Type"><NSelect value={f.type} onChange={(v) => setF({ ...f, type: v })} options={CAMPAIGN_TYPES} /></Field>
          <Field label="Category"><NSelect value={f.category} onChange={(v) => setF({ ...f, category: v })} options={CATS} /></Field>
          <Field label="Audience"><NSelect value={f.audience} onChange={(v) => setF({ ...f, audience: v })} options={AUDS} /></Field>
          {["Selected Blocks", "Selected Units", "Custom Segment"].includes(f.audience) && <Field label={f.audience === "Selected Units" ? "Units (e.g. #05-12, #03-07)" : f.audience === "Selected Blocks" ? "Blocks (e.g. A, C)" : "Segment description"}><Input value={f.extra} onChange={(e) => setF({ ...f, extra: e.target.value })} /></Field>}
          <Field label="Channels" className="sm:col-span-2"><div className="flex flex-wrap gap-1.5">{CHANNELS.map((c) => <button key={c} onClick={() => toggle(c)} className={`rounded-full border px-3 py-1 text-xs ${chans.includes(c) ? "border-primary bg-primary text-primary-foreground" : ""}`}>{c === "PWA" ? "Resident PWA" : c}{!channelLive(d, c) && c !== "Email" ? " (sim)" : ""}</button>)}</div></Field>
          <Field label="Send / schedule (date & time)"><Input type="datetime-local" value={f.schedule_at} onChange={(e) => setF({ ...f, schedule_at: e.target.value })} /></Field>
          <Field label="Expiry"><Input type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} /></Field>
          <Field label="Body / content" className="sm:col-span-2"><Textarea aria-label="Body" rows={4} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
          <Field label="CTA button label"><Input value={f.cta_label} onChange={(e) => setF({ ...f, cta_label: e.target.value })} /></Field>
          <Field label="CTA link"><Input value={f.cta_url} onChange={(e) => setF({ ...f, cta_url: e.target.value })} placeholder="https://sems.axon.com.sg/app/notices" /></Field>
          <Field label="Attachment (placeholder — file name only)"><Input type="file" onChange={(e) => setF({ ...f, attachment: e.target.files?.[0]?.name ?? "" })} /></Field>
          <Field label="Sender / display name"><Input value={f.sender} onChange={(e) => setF({ ...f, sender: e.target.value })} /></Field>
          <Field label="Tags"><Input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} /></Field>
          <label className="flex items-center gap-2 self-end text-sm"><Switch checked={f.ack_required} onCheckedChange={(v) => setF({ ...f, ack_required: v })} /> Acknowledgement / read receipt</label>
          {chans.includes("WhatsApp") && <div className="grid gap-3 rounded-md border p-3 sm:col-span-2 sm:grid-cols-3">
            <Field label="WhatsApp approved template"><Input value={f.wa_template} onChange={(e) => setF({ ...f, wa_template: e.target.value })} placeholder="estate_notice_v1" /></Field>
            <Field label="Language"><NSelect value={f.wa_language} onChange={(v) => setF({ ...f, wa_language: v })} options={["en", "zh_CN", "ms", "ta"]} /></Field>
            <Field label="Variables"><Input value={f.wa_vars} onChange={(e) => setF({ ...f, wa_vars: e.target.value })} placeholder="{{1}}=Block C, {{2}}=8 Oct" /></Field>
            <p className="text-xs text-muted-foreground sm:col-span-3">WhatsApp business messages must use a template approved by Meta via your provider.</p>
          </div>}
          {chans.includes("SMS") && <p className="text-xs text-muted-foreground sm:col-span-2">SMS: {f.body.length} characters ≈ {segments(f.body)} segment(s) per recipient. SMS Gateway Subscription Required — provider usage charges apply.</p>}
          {marketing && <DemoNote>Marketing / Promotion is only sent to residents who opted in to marketing, and only where consent and estate policy permit.</DemoNote>}
          <div className="sm:col-span-2 rounded-md bg-muted/50 p-3 text-xs">Estimated recipients: {counts.map(([c, n]) => `${c} ${n}`).join(" · ") || "choose a channel"} {essential && "· emergency notice: sent as an essential service notice, regardless of channel opt-outs"}</div>
          <div className="flex gap-2 sm:col-span-2"><Button variant="outline" disabled={!f.name} onClick={() => save({}, `Saved draft ${id}`)}>Save draft</Button><Button disabled={!f.name} onClick={doPreview}>Next: Preview</Button></div>
        </div>
      )}
      {step === 1 && <div className="space-y-2">{preview ? <iframe title="Email preview" className="h-[420px] w-full rounded border bg-background" srcDoc={preview} /> : <Button onClick={doPreview}>Render preview</Button>}<Button onClick={() => setStep(2)}>Next: Test send</Button></div>}
      {step === 2 && <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Sends ONE email through Axon SMTP (Mailtrap) to the address you enter. No residents receive it.</p>
        <div className="flex gap-2"><Input aria-label="Test address" type="email" placeholder="you@axon.com.sg" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
          <Button disabled={!testTo.includes("@")} onClick={async () => { const r: any = await send({ data: { to: testTo, subject: f.subject || f.name, displayName: f.sender, body: f.body } }); toast(r.message ?? (r.ok ? "Sent" : "Failed")); create.mutate({ table: "campaign_deliveries", row: { id: `CD-${Date.now()}`, campaign_id: id, channel: "Email", recipient: testTo, unit: "test", status: r.mode === "live" ? "Sent (test)" : "Demo (test)", at: now(), detail: r.message ?? "" } }); }}><Send className="h-4 w-4" /> Test send</Button></div>
        <Button variant="outline" onClick={() => { save({}, `Saved draft ${id}`); setStep(3); }}>Next: Approval</Button>
      </div>}
      {step === 3 && <div className="space-y-2 text-sm">
        <p>Human approval is required before any mass send. Approval status: <StatusBadge value={camp?.approval_status ?? "Pending"} /></p>
        <div className="flex gap-2"><Button disabled={!camp || approved} onClick={() => update.mutate({ table: "campaigns", id, patch: { approval_status: "Approved", approved_by: "Condo Manager (Demo)" }, action: `Approved campaign ${id}`, toast: "Approved" })}>Approve as Condo Manager (demo)</Button>
          <Button variant="outline" onClick={() => setStep(4)}>Next: Schedule / Send</Button></div>
        {!camp && <p className="text-xs text-muted-foreground">Save the draft first.</p>}
      </div>}
      {step === 4 && <div className="space-y-2 text-sm">
        <DemoNote>Demo safeguard: resident PWA notifications are recorded; Email/SMS/WhatsApp/Voice deliveries to residents are logged as Demo/Simulated — no real bulk messages are sent.</DemoNote>
        <p>{f.schedule_at ? `Scheduled for ${f.schedule_at.replace("T", " ")}` : "Send now"} · {counts.map(([c, n]) => `${c} ${n}`).join(" · ")}</p>
        <Button disabled={!approved} onClick={doSend}>{f.schedule_at ? "Schedule campaign" : "Send campaign (demo)"}</Button>
        {!approved && <p className="text-xs text-warning">Approval required first.</p>}
      </div>}
    </DialogContent>
  );
}

function CampaignList({ d, filter, onOpen }: { d: D; filter: (c: any) => boolean; onOpen: (c: any) => void }) {
  const { update } = useDemoMutations();
  return <DataTable rows={d.campaigns.filter(filter)} cols={[
    { h: "ID", c: (r) => r.id }, { h: "Campaign", c: (r) => <button className="text-left font-medium text-primary underline" onClick={() => onOpen(r)}>{r.name}</button> },
    { h: "Type", c: (r) => r.type }, { h: "Channels", c: (r) => r.channels }, { h: "Audience", c: (r) => r.audience },
    { h: "Send", c: (r) => fmt(r.schedule_at) }, { h: "Status", c: (r) => <StatusBadge value={r.status} /> }, { h: "Approval", c: (r) => <StatusBadge value={r.approval_status} /> },
    { h: "", c: (r) => ["Draft", "Scheduled"].includes(r.status) ? <Button size="sm" variant="ghost" onClick={() => update.mutate({ table: "campaigns", id: r.id, patch: { status: "Cancelled" }, action: `Cancelled ${r.id}`, toast: "Cancelled" })}>Cancel</Button> : null },
  ]} />;
}

export function CommsCampaigns({ d }: PageProps) {
  const [open, setOpen] = useState<any>(null);
  const [tab, setTab] = useState("notices");
  useEffect(() => { const a = new URLSearchParams(window.location.search).get("a"); if (a && ["announce", "email", "sms", "whatsapp", "providers"].includes(a)) setTab(a); if (a === "new-email") { setTab("email"); setOpen(blank("Estate Notice", "PWA,Email")); } if (a === "new-sms") { setTab("sms"); setOpen(blank("Maintenance Advisory", "SMS")); } if (a === "new-wa") { setTab("whatsapp"); setOpen(blank("Announcement", "WhatsApp")); } if (a === "new-announce") { setTab("announce"); setOpen(blank("Announcement", "PWA")); } }, []);
  const edit = (c: any) => setOpen({ ...blank(c.type, c.channels), ...c, extra: "" });
  const has = (ch: string) => (c: any) => String(c.channels ?? "").split(",").includes(ch);
  const sms = providerFor(d, "SMS"); const wa = providerFor(d, "WhatsApp"); const voice = providerFor(d, "Voice");
  const del = d.campaign_deliveries;
  const em = d.campaigns.filter(has("Email"));
  const sum = (k: string) => em.reduce((a, c) => a + (c[k] ?? 0), 0);
  const NewBtn = ({ type, ch, label }: { type: string; ch: string; label: string }) => <Button size="sm" onClick={() => setOpen(blank(type, ch))}><Plus className="h-4 w-4" /> {label}</Button>;
  return (
    <div className="space-y-4">
      <PageTitle title="Communications & Campaigns" sub="Notices, circulars, announcements and multi-channel campaigns · human approval before any mass send" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex h-auto flex-wrap">
          {[["notices", "Notices & Circulars"], ["announce", "Announcements"], ["email", "Email Campaigns"], ["sms", "SMS Campaigns"], ["whatsapp", "WhatsApp Campaigns"], ["voice", "Voice / AI Voice"], ["history", "Delivery History"], ["templates", "Templates"], ["providers", "Provider Settings"]].map(([v, l]) => <TabsTrigger key={v} value={v!}>{l}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="notices" className="space-y-3"><p className="text-sm text-muted-foreground">Notices and Circulars (incl. the Monthly Circular workflow and archive) — published to the Resident PWA and optionally emailed.</p><Communications d={d} role="ma" /></TabsContent>
        <TabsContent value="announce" className="space-y-3"><NewBtn type="Announcement" ch="PWA" label="New announcement" /><CampaignList d={d} filter={(c) => ["Announcement", "Event / AGM / Council", "Survey / Feedback Request", "Marketing / Promotion"].includes(c.type)} onOpen={edit} /></TabsContent>
        <TabsContent value="email" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2"><NewBtn type="Estate Notice" ch="PWA,Email" label="New email campaign" /><NewBtn type="Estate Notice" ch="PWA,Email,WhatsApp" label="Notice (PWA + Email + WhatsApp)" /><span className="text-xs text-muted-foreground"><Mail className="inline h-3 w-3" /> Provider: {providerFor(d, "Email")?.provider ?? "none"} · tests send live via Axon SMTP; resident batches are demo-only</span></div>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">{[["Recipients", "recipients"], ["Delivered", "delivered"], ["Opened", "opened"], ["Clicked", "clicked"], ["Bounced", "bounced"], ["Failed", "failed"]].map(([l, k]) => <Kpi key={k} label={l!} value={sum(k ?? "")} hint="Demo analytics" />)}</div>
          <DemoNote>Opens, clicks and bounces are demo analytics. Live figures need the provider's delivery webhooks to be connected.</DemoNote>
          <CampaignList d={d} filter={has("Email")} onOpen={edit} />
        </TabsContent>
        <TabsContent value="sms" className="space-y-3">
          <div className="rounded-md border border-warning/50 bg-warning/10 p-3 text-sm"><strong>SMS Gateway Subscription Required — provider usage charges apply.</strong> The client pays the SMS provider directly. Current: {sms ? `${sms.provider} (${sms.status})` : "Not Configured"} — sends are simulated.</div>
          <div className="flex gap-2"><NewBtn type="Maintenance Advisory" ch="SMS" label="New SMS campaign" /><Button size="sm" variant="outline" onClick={() => setTab("providers")}>Configure SMS Subscription</Button></div>
          <CampaignList d={d} filter={has("SMS")} onOpen={edit} />
        </TabsContent>
        <TabsContent value="whatsapp" className="space-y-3">
          <div className="rounded-md border bg-accent/40 p-3 text-sm"><MessageCircle className="inline h-4 w-4" /> WhatsApp Business/API subscription, template approval and usage charges are handled by the selected provider and paid directly by the client unless otherwise agreed. Current: {wa ? `${wa.provider} (${wa.status})` : "Not Configured"} — sends are simulated.</div>
          <div className="flex flex-wrap gap-2"><NewBtn type="Announcement" ch="PWA,WhatsApp" label="New WhatsApp campaign" /><NewBtn type="Emergency Notice" ch="PWA,Email,WhatsApp,SMS" label="Emergency alert (PWA + Email + WhatsApp + SMS)" /></div>
          {(() => { const w = d.campaign_deliveries.filter((x) => x.channel === "WhatsApp"); const n = (f: (x: any) => boolean) => w.filter(f).length; return <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{[["WhatsApp deliveries", w.length], ["Read", n((x) => x.status === "Read")], ["Delivered / demo", n((x) => ["Delivered", "Demo"].includes(x.status))], ["Simulated", n((x) => x.status === "Simulated")], ["Failed", n((x) => x.status === "Failed")]].map(([l, v]) => <Kpi key={String(l)} label={String(l)} value={v as number} hint="Demo analytics" />)}</div>; })()}
          <p className="text-xs text-muted-foreground">Template workflow: choose an approved template name, language and variables, add a CTA, pick the audience (WhatsApp opt-in residents; emergency notices are sent as essential service messages) and schedule. Not your provider? <a className="underline" href="mailto:support@axon.com.sg?subject=WhatsApp%20BSP%20integration">Email support@axon.com.sg</a> for an integration assessment.</p>
          <CampaignList d={d} filter={has("WhatsApp")} onOpen={edit} />
        </TabsContent>
        <TabsContent value="voice" className="space-y-3">
          <Panel title="Voice / AI Voice (optional)">
            <p className="text-sm text-muted-foreground"><Mic className="inline h-4 w-4" /> ElevenLabs is an optional voice / text-to-speech / voice-agent provider — not an email or SMS provider. An optional workflow drafts text with SEA-LION and speaks it with ElevenLabs. The client pays the provider account directly. Real calls are not activated in the demo. Current: {voice ? voice.provider : "Not Configured"}.</p>
            <ul className="mt-2 list-disc pl-5 text-sm">{["Emergency voice announcement", "Automated resident call", "Multilingual voice notice", "IVR / outbound reminder", "Spoken version of a circular or notice"].map((x) => <li key={x}>{x}</li>)}</ul>
          </Panel>
          <NewBtn type="Emergency Notice" ch="PWA,Voice" label="New voice notice (simulated)" />
          <CampaignList d={d} filter={has("Voice")} onOpen={edit} />
        </TabsContent>
        <TabsContent value="history" className="space-y-3">
          <DataTable rows={[...del].sort((a, b) => String(b.at).localeCompare(String(a.at)))} cols={[{ h: "At", c: (r) => fmt(r.at) }, { h: "Campaign", c: (r) => r.campaign_id }, { h: "Channel", c: (r) => r.channel }, { h: "Recipient (masked)", c: (r) => r.recipient }, { h: "Unit", c: (r) => r.unit }, { h: "Status", c: (r) => <StatusBadge value={r.status} /> }, { h: "Detail", c: (r) => r.detail }]} />
          <Panel title="Provider webhook events (demo)"><DataTable rows={d.webhook_events} cols={[{ h: "At", c: (r) => fmt(r.at) }, { h: "Provider", c: (r) => r.provider }, { h: "Event", c: (r) => r.event }, { h: "Payload", c: (r) => <code className="text-xs">{r.payload}</code> }]} /></Panel>
        </TabsContent>
        <TabsContent value="templates" className="space-y-2">
          {[["Monthly Circular", "Email", "[Pandan Valley] Monthly Circular — {{month}} {{year}}"], ["Estate Notice", "Email", "[Pandan Valley] Estate Notice — {{title}}"], ["Emergency Notice", "Email + SMS + Voice", "[Pandan Valley] Emergency Notice — {{title}}"], ["Maintenance advisory", "SMS (≤160 chars)", "PV: {{title}} on {{date}} {{time}}. Details in the resident app."], ["Event reminder", "WhatsApp template", "estate_event_reminder_v1 · {{1}} event · {{2}} date"], ["Survey after closure", "PWA + Email", "How did we do on {{ticket_id}}?"]].map(([n, c, s]) => <div key={n} className="rounded-md border p-3 text-sm"><div className="font-medium text-navy">{n} <span className="text-xs text-muted-foreground">· {c}</span></div><code className="text-xs">{s}</code></div>)}
          <p className="text-xs text-muted-foreground">Email subjects and display name are edited on the Email / SMTP page.</p>
        </TabsContent>
        <TabsContent value="providers" className="space-y-4"><OpenApiCard /><ProviderCards d={d} cats={["Email", "SMS", "WhatsApp", "Voice"]} /></TabsContent>
      </Tabs>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>{open && <Composer d={d} init={open} onClose={() => setOpen(null)} />}</Dialog>
    </div>
  );
}

export function CommsKpis({ d }: PageProps) {
  const m = new Date().toISOString().slice(0, 7);
  const sms = providerFor(d, "SMS"); const wa = providerFor(d, "WhatsApp");
  const published = d.notices.filter((n) => n.status === "Published");
  const unread = published.filter((n) => !d.notice_reads.some((r) => r.notice_id === n.id)).length;
  const ackPending = published.filter((n) => n.ack_required && !d.notice_reads.some((r) => r.notice_id === n.id && r.acknowledged)).length + d.campaigns.filter((c) => c.ack_required && c.status === "Sent").length;
  const k: [string, any, string, any][] = [
    ["Campaigns this month", d.campaigns.filter((c) => String(c.created_at ?? "").startsWith(m)).length, `${d.campaigns.length} total`, "info"],
    ["Emails delivered", d.campaigns.reduce((a, c) => a + (String(c.channels).includes("Email") ? c.delivered ?? 0 : 0), 0), "Demo analytics", "success"],
    ["SMS status", sms?.status === "Connected" ? "Connected" : "Not configured", "Subscription required", "warning"],
    ["WhatsApp provider", wa?.status === "Connected" ? "Connected" : "Not configured", "Client-paid provider", "warning"],
    ["Notices unread", unread, "Published notices, no reads", unread ? "warning" : "success"],
    ["Acknowledgements pending", ackPending, "Ack-required notices/campaigns", "warning"],
    ["WhatsApp delivery failures", d.campaign_deliveries.filter((x) => x.channel === "WhatsApp" && x.status === "Failed").length, "Simulated / demo deliveries", "danger"],
    ["Communication failures", d.campaign_deliveries.filter((x) => ["Failed", "Bounced"].includes(x.status)).length, "Bounced / failed deliveries", "danger"],
  ];
  const qa: [string, string][] = [["New Notice", "notice"], ["New Circular", "circular"], ["New Announcement", "new-announce"], ["New Email Campaign", "new-email"], ["New SMS Campaign", "new-sms"], ["New WhatsApp Campaign", "new-wa"], ["Test Provider Connection", "providers"]];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{k.map(([l, v, h, t]) => <Kpi key={l} label={l} value={v} hint={h} tone={t} />)}</div>
      <Panel title="Communications quick actions"><div className="flex flex-wrap gap-2">{qa.map(([l, a]) => <Link key={l} to="/app/$page" params={{ page: "communications" }} search={{ a } as any} className="rounded-md border px-3 py-2 text-sm font-medium text-navy hover:border-primary hover:bg-accent/40">{l} →</Link>)}</div></Panel>
    </div>
  );
}

/* ---------------- Resident ---------------- */
/** Notifications for the demo unit; read state persists in notice_reads with notice_id "NTF:<key>". */
export function residentNotifications(d: D) {
  const read = (k: string) => d.notice_reads.some((r) => r.notice_id === `NTF:${k}` && r.unit === DEMO_UNIT);
  const out: { key: string; kind: string; title: string; at: string; page: string; search?: any; read: boolean }[] = [];
  d.tickets.filter((t) => t.unit === DEMO_UNIT && (t.ma_reply || t.status !== "New")).forEach((t) => out.push({ key: `TK-${t.id}-${t.status}`, kind: "Ticket update", title: `${t.id} is ${t.status}${t.ma_reply ? " · MA replied" : ""}`, at: t.created_at, page: "tickets", search: { open: t.id }, read: read(`TK-${t.id}-${t.status}`) }));
  d.notices.filter((n) => n.status === "Published").forEach((n) => out.push({ key: `NT-${n.id}`, kind: n.emergency ? "Emergency alert" : /Maintenance|Water|Lift/.test(n.category ?? "") ? "Maintenance alert" : n.kind === "Circular" ? "Circular published" : "Notice published", title: n.title, at: n.publish_date, page: "notices", read: read(`NT-${n.id}`) }));
  d.contractor_passes.filter((p) => p.unit === DEMO_UNIT).forEach((p) => out.push({ key: `CP-${p.id}-${p.status}`, kind: "Contractor pass update", title: `${p.company} pass ${p.id}: ${p.status}`, at: p.start_date, page: "contractors", read: read(`CP-${p.id}-${p.status}`) }));
  d.campaigns.filter((c) => ["Sent", "Partially Failed"].includes(c.status) && String(c.channels).includes("PWA")).forEach((c) => out.push({ key: `CM-${c.id}`, kind: c.type === "Emergency Notice" ? "Emergency alert" : "Campaign message", title: c.subject || c.name, at: c.schedule_at, page: "inbox", read: read(`CM-${c.id}`) }));
  return out.sort((a, b) => String(b.at).localeCompare(String(a.at)));
}

function Notifications({ d }: PageProps) {
  const { create } = useDemoMutations();
  const items = residentNotifications(d);
  const unread = items.filter((n) => !n.read);
  const mark = (keys: string[]) => keys.forEach((k, i) => create.mutate({ table: "notice_reads", row: { id: `NR-${Date.now()}-${i}`, notice_id: `NTF:${k}`, unit: DEMO_UNIT, at: now(), acknowledged: false } }));
  return (
    <Panel title={`Notifications · ${unread.length} unread`} action={unread.length ? <Button size="sm" variant="outline" onClick={() => mark(unread.map((n) => n.key))}>Mark all read</Button> : undefined}>
      <ul className="divide-y">{items.slice(0, 15).map((n) => (
        <li key={n.key} className={`flex items-center justify-between gap-2 py-2 text-sm ${n.read ? "text-muted-foreground" : ""}`}>
          <div className="min-w-0"><div className="text-xs">{!n.read && <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />}{n.kind} · {fmt(n.at)}</div><div className={`truncate ${n.read ? "" : "font-medium text-navy"}`}>{n.title}</div></div>
          <div className="flex shrink-0 gap-1">{!n.read && <Button size="sm" variant="ghost" onClick={() => mark([n.key])}>Read</Button>}{n.page !== "inbox" && <Button asChild size="sm" variant="outline"><Link to="/app/$page" params={{ page: n.page }} search={n.search}>Open</Link></Button>}</div>
        </li>
      ))}</ul>
    </Panel>
  );
}
export function CommPreferences({ d }: PageProps) {
  const { update, create } = useDemoMutations();
  const u = d.units.find((x) => x.unit === DEMO_UNIT);
  const me = d.residents.find((r) => r.unit_id === u?.id);
  if (!me) return <p className="text-sm text-muted-foreground">No resident record for {DEMO_UNIT}.</p>;
  const set = (k: string, label: string, v: boolean) => {
    update.mutate({ table: "residents", id: me.id, patch: { [k]: v }, action: `${DEMO_UNIT} ${label} ${v ? "ON" : "OFF"}`, toast: `${label} ${v ? "on" : "off"}` });
    create.mutate({ table: "comm_audit", row: { id: `CA-${Date.now()}`, at: now(), resident: `${DEMO_UNIT} ${me.name}`, change: `${label} ${v ? "ON" : "OFF"}`, actor: "Resident (PWA)" } });
  };
  const rows: [string, string, string][] = [["opt_email", "Email", "Notices, circulars, ticket updates"], ["opt_sms", "SMS", "Short alerts (estate SMS subscription required)"], ["opt_whatsapp", "WhatsApp", "Approved-template messages (provider required)"], ["opt_voice", "Voice call", "Automated voice notices (optional, provider required)"], ["opt_marketing", "Promotions", "Marketing / promotional messages, only where estate policy permits"]];
  return (
    <div className="max-w-2xl space-y-4">
      <PageTitle title="Communication Preferences" sub={`${me.name} · ${DEMO_UNIT}`} />
      <Panel>
        <div className="divide-y">{rows.map(([k, l, h]) => <div key={k} className="flex items-center justify-between py-3"><div><div className="font-medium">{l}</div><div className="text-xs text-muted-foreground">{h}</div></div><Switch aria-label={l} checked={!!me[k]} onCheckedChange={(v) => set(k, l, v)} /></div>)}
          <div className="flex items-center justify-between py-3"><div><div className="font-medium">Emergency & essential service notices</div><div className="text-xs text-muted-foreground">Always delivered in the app (and email where available) for safety and essential estate operations.</div></div><Switch checked disabled aria-label="Emergency notices" /></div>
        </div>
      </Panel>
      <Button variant="outline" onClick={() => rows.forEach(([k, l]) => k !== "opt_email" && me[k] && set(k, l, false))}>Unsubscribe from all optional channels</Button>
      <Panel title="My preference history"><DataTable rows={d.comm_audit.filter((a) => String(a.resident).startsWith(DEMO_UNIT))} cols={[{ h: "At", c: (r) => fmt(r.at) }, { h: "Change", c: (r) => r.change }, { h: "By", c: (r) => r.actor }]} /></Panel>
      <DemoNote>Production communication consent and lawful-purpose rules must be confirmed by the client under Singapore PDPA and applicable estate policies.</DemoNote>
    </div>
  );
}

export function CampaignInbox({ d }: PageProps) {
  const { create, update } = useDemoMutations();
  const u = d.units.find((x) => x.unit === DEMO_UNIT);
  const me = d.residents.find((r) => r.unit_id === u?.id);
  const [cat, setCat] = useState("All");
  const items = d.campaigns.filter((c) => ["Sent", "Partially Failed"].includes(c.status) && String(c.channels).includes("PWA") && (c.type !== "Marketing / Promotion" || me?.opt_marketing));
  const mine = (c: any) => d.campaign_deliveries.find((x) => x.campaign_id === c.id && x.channel === "PWA" && x.unit === DEMO_UNIT);
  const mark = (c: any, status: string) => { const m = mine(c); if (m) update.mutate({ table: "campaign_deliveries", id: m.id, patch: { status, at: now() }, toast: status }); else create.mutate({ table: "campaign_deliveries", row: { id: `CD-${Date.now()}`, campaign_id: c.id, channel: "PWA", recipient: DEMO_UNIT, unit: DEMO_UNIT, status, at: now(), detail: "Resident PWA" }, toast: status }); };
  const kinds = ["All", "Notices", "Circulars", "Announcements", "Surveys", "Events"];
  const match = (c: any) => cat === "All" || (cat === "Notices" && /Notice|Advisory|Contractor/.test(c.type)) || (cat === "Circulars" && c.type === "Monthly Circular") || (cat === "Announcements" && /Announcement|Marketing/.test(c.type)) || (cat === "Surveys" && /Survey/.test(c.type)) || (cat === "Events" && /Event/.test(c.type));
  return (
    <div className="max-w-3xl space-y-4">
      <PageTitle title="Announcements / Notifications" sub="Ticket updates, notices, contractor passes, alerts and announcements for your unit" />
      <Notifications d={d} role="resident" />
      <h3 className="pt-2 font-display text-lg font-bold text-navy">Announcements & campaign messages</h3>
      <div className="flex flex-wrap gap-1.5">{kinds.map((k) => <button key={k} onClick={() => setCat(k)} className={`rounded-full border px-3 py-1 text-xs ${cat === k ? "border-primary bg-primary text-primary-foreground" : ""}`}>{k}</button>)}</div>
      {items.filter(match).map((c) => { const m = mine(c); const st = m?.status ?? "Unread"; return (
        <Panel key={c.id}>
          <div className="flex items-start justify-between gap-2"><div><div className="text-xs text-muted-foreground">{c.type} · {fmt(c.schedule_at)}</div><div className="font-semibold text-navy">{c.subject || c.name}</div></div><StatusBadge value={st === "Delivered" ? "Unread" : st} /></div>
          <p className="mt-2 whitespace-pre-wrap text-sm">{c.body}</p>
          {c.cta_url && <a className="mt-2 inline-block text-sm font-medium text-primary underline" href={c.cta_url}>{c.cta_label || "Open"}</a>}
          <div className="mt-3 flex gap-2">{st !== "Read" && st !== "Acknowledged" && <Button size="sm" variant="outline" onClick={() => mark(c, "Read")}>Mark read</Button>}{c.ack_required && st !== "Acknowledged" && <Button size="sm" onClick={() => mark(c, "Acknowledged")}>Acknowledge</Button>}</div>
        </Panel>
      ); })}
      {!items.filter(match).length && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
      <p className="text-xs text-muted-foreground"><Smartphone className="inline h-3 w-3" /> Manage channels in <Link to="/app/$page" params={{ page: "preferences" }} className="underline">Communication Preferences</Link>.</p>
    </div>
  );
}