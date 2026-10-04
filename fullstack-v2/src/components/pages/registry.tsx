import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ExternalLink, KeyRound, Mail, Plus, ShieldCheck } from "lucide-react";
import { Panel, StatusBadge, DemoNote } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDemoMutations } from "@/lib/useDemo";
import { getSecretStatus, runAi } from "@/lib/demo.functions";
import { Field, NSelect, type PageProps } from "./common";

type Status = "Connected" | "Current" | "API Required" | "Not Configured" | "Coming Soon" | "Optional" | "Developer Tooling" | "Pending Integration";
type Prov = {
  name: string; cat: string; filters: string[]; region: "Singapore" | "Global" | "Other"; status: Status; auth: string;
  secret: string; by: string; owner: "Client Direct" | "Axon Managed" | "N/A"; webhook: string; notes: string; docs?: string; local?: boolean; badge?: string;
};

const P = (name: string, cat: string, filters: string[], status: Status, auth: string, secret: string, notes: string, o: Partial<Prov> = {}): Prov => ({
  name, cat, filters, region: "Global", status, auth, secret, by: status === "Connected" ? "Axon" : "—", owner: "Client Direct", webhook: "Not configured", notes, ...o,
});
const COMPAT = "OpenAI-compatible API — compatibility noted, not tested in SEMS.";
const SG = { region: "Singapore" as const, local: true };
const PDPA = "Biometric / PDPA Review Required";

export const PROVIDERS: Prov[] = [
  // Singapore / local-first
  P("SEA-LION — AI Singapore", "AI / LLM", ["AI / LLM"], "Connected", "API Key", "SEA_LION_API_KEY", "POC · free development API · 10 req/min · human approval locked ON", { ...SG, owner: "N/A", docs: "https://docs.sea-lion.ai" }),
  P("Homeplus", "Property / Facility / LPR", ["Property / Condo", "Access / LPR"], "Current", "API Key", "HOMEPLUS_API_KEY", "Current at Pandan Valley · API access required · integration assessment pending", { ...SG }),
  P("iCondo", "Property / Condo Management", ["Property / Condo"], "API Required", "API Key", "ICONDO_API_KEY", "Example provider · API assessment required", { ...SG }),
  P("Axon Resident Master", "Property / Condo (native)", ["Property / Condo"], "Connected", "Native", "—", "Native SEMS module · no external subscription", { ...SG, owner: "N/A", by: "Axon" }),
  P("Excel / CSV / Google Sheets import", "File / Data Integration", ["Property / Condo", "Finance / Accounting"], "Optional", "CSV", "—", "File import/export · no API needed", { ...SG, owner: "N/A" }),
  P("Axon SMTP / Mailtrap", "Email", ["Email / Marketing"], "Connected", "SMTP", "MAILTRAP", "Live sender amit@axon.com.sg · test from Email Settings", { ...SG, owner: "Axon Managed", docs: "https://api-docs.mailtrap.io" }),
  P("SMTP2GO", "Email / SMTP", ["Email / Marketing"], "Not Configured", "API Key", "SMTP2GO_API_KEY or SMTP_HOST / SMTP_USER / SMTP_PASSWORD", "Optional alternative sender", { ...SG, docs: "https://developers.smtp2go.com" }),
  P("Microsoft 365 / Exchange Online", "Email / Identity / Calendar", ["Email / Marketing"], "Optional", "OAuth", "MICROSOFT_GRAPH_CLIENT_ID / MICROSOFT_GRAPH_CLIENT_SECRET", "Graph API", { ...SG, docs: "https://learn.microsoft.com/graph" }),
  P("Microsoft Entra ID / SSO", "Identity", ["Facial / Identity"], "Optional", "OAuth", "MICROSOFT_GRAPH_CLIENT_ID / MICROSOFT_GRAPH_CLIENT_SECRET", "OAuth / OIDC single sign-on for staff", { ...SG }),
  P("Microsoft Azure OpenAI", "AI / LLM", ["AI / LLM"], "Optional", "API Key", "AZURE_OPENAI_API_KEY / AZURE_OPENAI_ENDPOINT", "API key or Entra auth · Singapore-region hosting may be available", { ...SG }),
  P("Microsoft Copilot Studio", "Workflow / Agent", ["AI / LLM"], "Optional", "OAuth", "—", "OAuth/API where supported", { ...SG }),
  P("GitHub Copilot", "Developer Tooling", ["Developer Tooling"], "Developer Tooling", "OAuth", "—", "Developer tooling, not SEMS production inference API.", { ...SG, owner: "N/A" }),
  // AI / LLM
  P("OpenAI API", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "OPENAI_API_KEY", "Optional provider", { docs: "https://platform.openai.com/docs" }),
  P("Anthropic Claude API", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "ANTHROPIC_API_KEY", "Optional provider", { docs: "https://docs.anthropic.com" }),
  P("Google Gemini API", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "GEMINI_API_KEY", "Optional provider", { docs: "https://ai.google.dev" }),
  P("Kimi / Moonshot AI", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "KIMI_API_KEY", COMPAT, { region: "Other" }),
  P("Mistral AI", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "MISTRAL_API_KEY", "Optional provider", { region: "Other" }),
  P("Cohere", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "COHERE_API_KEY", "Optional provider"),
  P("Groq", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "GROQ_API_KEY", COMPAT),
  P("Together AI", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "TOGETHER_API_KEY", COMPAT),
  P("OpenRouter", "AI / LLM", ["AI / LLM"], "Not Configured", "API Key", "OPENROUTER_API_KEY", COMPAT),
  P("Local / Self-Hosted LLM", "AI / LLM", ["AI / LLM", "Custom API"], "Optional", "API Key", "CUSTOM_LLM_ENDPOINT", "Runs on dedicated VPS/GPU · quoted separately", { owner: "N/A" }),
  P("Custom OpenAI-compatible API", "AI / LLM", ["AI / LLM", "Custom API"], "Optional", "API Key", "CUSTOM_LLM_ENDPOINT / CUSTOM_LLM_API_KEY", COMPAT),
  // Email / marketing
  P("SendGrid", "Email / Marketing", ["Email / Marketing"], "Not Configured", "API Key", "SENDGRID_API_KEY", "Optional sender"),
  P("Mailgun", "Email / Marketing", ["Email / Marketing"], "Not Configured", "API Key", "MAILGUN_API_KEY", "Optional sender"),
  P("Amazon SES", "Email / Marketing", ["Email / Marketing"], "Not Configured", "API Key", "AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY", "Optional sender"),
  P("Brevo", "Email / Marketing", ["Email / Marketing"], "Not Configured", "API Key", "BREVO_API_KEY", "Optional sender"),
  P("Mailchimp", "Email / Marketing", ["Email / Marketing"], "Not Configured", "API Key", "MAILCHIMP_API_KEY", "Marketing lists · optional"),
  P("Postmark", "Email / Marketing", ["Email / Marketing"], "Not Configured", "API Key", "POSTMARK_SERVER_TOKEN", "Optional sender"),
  P("Gmail / Google Workspace", "Email / Marketing", ["Email / Marketing"], "Optional", "OAuth", "GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET", "OAuth mail sending"),
  P("Custom SMTP", "Email / Marketing", ["Email / Marketing", "Custom API"], "Optional", "SMTP", "SMTP_HOST / SMTP_USER / SMTP_PASSWORD", "Any SMTP server"),
  P("Custom Email API", "Email / Marketing", ["Email / Marketing", "Custom API"], "Optional", "API Key", "—", "Provide API spec"),
  // SMS
  ...["Twilio:TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN", "Bird / MessageBird:BIRD_API_KEY", "Vonage:VONAGE_API_KEY", "Sinch:SINCH_API_KEY", "Infobip:INFOBIP_API_KEY", "Custom SMS API:—"].map((s) => {
    const [n, k] = s.split(":") as [string, string];
    return P(n, "SMS", ["SMS", ...(n.startsWith("Custom") ? ["Custom API"] : [])], n.startsWith("Custom") ? "Optional" : "Not Configured", "API Key", k, "Subscription and per-message usage are client-paid");
  }),
  // WhatsApp
  ...["Meta WhatsApp Business Cloud API:WHATSAPP_ACCESS_TOKEN", "Twilio WhatsApp:TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN", "Bird / MessageBird WhatsApp:BIRD_API_KEY", "Vonage WhatsApp:VONAGE_API_KEY", "Infobip WhatsApp:INFOBIP_API_KEY", "360dialog:D360_API_KEY", "Custom WhatsApp BSP/API:—"].map((s) => {
    const [n, k] = s.split(":") as [string, string];
    return P(n, "WhatsApp", ["WhatsApp", ...(n.startsWith("Custom") ? ["Custom API"] : [])], n.startsWith("Custom") ? "Optional" : "Not Configured", n.startsWith("Meta") ? "OAuth" : "API Key", k, "Template approval required · conversation charges client-paid", { webhook: "Required (delivery status)", badge: "Template approval" });
  }),
  // Voice
  P("ElevenLabs", "Voice / AI Voice", ["Voice / AI Voice"], "Not Configured", "API Key", "ELEVENLABS_API_KEY", "AI voice announcements · client-paid usage"),
  P("Twilio Voice", "Voice / AI Voice", ["Voice / AI Voice"], "Not Configured", "API Key", "TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN", "Outbound calls · client-paid"),
  P("Vonage Voice", "Voice / AI Voice", ["Voice / AI Voice"], "Not Configured", "API Key", "VONAGE_API_KEY", "Outbound calls · client-paid"),
  P("Microsoft Azure Speech", "Voice / AI Voice", ["Voice / AI Voice"], "Optional", "API Key", "AZURE_SPEECH_KEY", "Text-to-speech"),
  P("Google Cloud Text-to-Speech", "Voice / AI Voice", ["Voice / AI Voice"], "Optional", "Service Account", "GOOGLE_CLOUD_CREDENTIALS", "Text-to-speech"),
  P("Amazon Polly", "Voice / AI Voice", ["Voice / AI Voice"], "Optional", "API Key", "AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY", "Text-to-speech"),
  P("Custom Voice API", "Voice / AI Voice", ["Voice / AI Voice", "Custom API"], "Optional", "API Key", "—", "Provide API spec"),
  // Property / booking
  P("BuildingLink", "Property / Condo", ["Property / Condo"], "Coming Soon", "API Key", "—", "Example only · not integrated"),
  P("Google Sheets", "Property / Condo", ["Property / Condo"], "Optional", "OAuth", "GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET", "Sheet sync"),
  P("Custom Property API", "Property / Condo", ["Property / Condo", "Custom API"], "Optional", "API Key", "—", "Provide API spec"),
  P("Homeplus Booking (Current)", "Facility Booking", ["Property / Condo"], "Current", "API Key", "HOMEPLUS_API_KEY", "Keep existing booking engine · SEMS is an add-on", SG),
  P("iCondo Booking", "Facility Booking", ["Property / Condo"], "API Required", "API Key", "ICONDO_API_KEY", "Example provider", SG),
  P("BuildingLink Booking", "Facility Booking", ["Property / Condo"], "Coming Soon", "API Key", "—", "Example only"),
  P("Standalone Axon Booking", "Facility Booking", ["Property / Condo"], "Optional", "Native", "—", "Only if the client wants it — no forced replacement", { owner: "N/A" }),
  P("Custom Booking API", "Facility Booking", ["Property / Condo", "Custom API"], "Optional", "API Key", "—", "Provide API spec"),
  // CCTV
  ...["Hikvision", "Dahua", "Axis Communications", "Hanwha Vision", "Bosch Security", "Milestone XProtect", "Genetec", "Avigilon", "Uniview", "Custom ONVIF / VMS API"].map((n, i) =>
    P(n, "CCTV / Video Management", ["CCTV", ...(n.startsWith("Custom") ? ["Custom API"] : [])], n.startsWith("Custom") ? "Optional" : i < 3 ? "API Required" : "Coming Soon", "API Key", "—", "Event/snapshot links only · no face recognition claimed")),
  // Access / LPR
  P("Homeplus LPR", "Access / LPR / Gate", ["Access / LPR"], "Current", "API Key", "HOMEPLUS_API_KEY", "Current at Pandan Valley · API access required", SG),
  ...["Hikvision", "Dahua", "Suprema", "ZKTeco", "HID", "Gallagher", "Genetec", "Axis", "Custom Access API"].map((n) =>
    P(`${n}${n.startsWith("Custom") ? "" : " Access"}`, "Access / LPR / Gate", ["Access / LPR", ...(n.startsWith("Custom") ? ["Custom API"] : [])], n.startsWith("Custom") ? "Optional" : "API Required", "API Key / OAuth / Controller API", "—", "Auth depends on provider/controller")),
  // Identity
  ...["Axon Selfie Verification", "Suprema", "ZKTeco", "HID", "Microsoft Azure Face", "Amazon Rekognition", "Custom Identity API"].map((n) =>
    P(`${n}${["Suprema", "ZKTeco", "HID"].includes(n) ? " Identity" : ""}`, "Facial / Identity / Biometric", ["Facial / Identity", ...(n.startsWith("Custom") ? ["Custom API"] : [])], n.startsWith("Axon") ? "Optional" : "Coming Soon", "API Key", "—", "No real biometric data in demo · consent, privacy review and human approval mandatory" + (n.includes("Azure") ? " · only if client-approved/available" : ""), { badge: PDPA, owner: n.startsWith("Axon") ? "N/A" : "Client Direct" })),
  // Finance
  P("Xero", "Finance / Accounting", ["Finance / Accounting"], "Coming Soon", "OAuth", "XERO_CLIENT_ID", "Example only"),
  P("QuickBooks Online", "Finance / Accounting", ["Finance / Accounting"], "Coming Soon", "OAuth", "—", "Example only"),
  P("Microsoft Dynamics 365", "Finance / Accounting", ["Finance / Accounting"], "Coming Soon", "OAuth", "—", "Example only"),
  P("Sage", "Finance / Accounting", ["Finance / Accounting"], "Coming Soon", "API Key", "—", "Example only"),
  P("Excel / CSV (Finance)", "Finance / Accounting", ["Finance / Accounting"], "Optional", "CSV", "—", "File export/import", { owner: "N/A" }),
  P("Custom Accounting API", "Finance / Accounting", ["Finance / Accounting", "Custom API"], "Optional", "API Key", "—", "Provide API spec"),
  // Storage
  P("Dedicated VPS Object Storage", "Storage / Files", [], "Optional", "Service Account", "—", "Part of dedicated client environment", { owner: "Axon Managed" }),
  ...["Amazon S3", "Cloudflare R2", "Azure Blob Storage", "Google Cloud Storage"].map((n) => P(n, "Storage / Files", [], "Optional", "API Key", "—", "Optional storage provider")),
  P("SFTP", "Storage / Files", [], "Optional", "SFTP", "—", "Scheduled file exchange"),
  P("Custom Storage API", "Storage / Files", ["Custom API"], "Optional", "API Key", "—", "Provide API spec"),
  // Monitoring
  ...["Cloudflare", "Sentry", "UptimeRobot / Better Uptime", "Microsoft Defender / security tooling", "Custom monitoring API"].map((n) => P(n, "Monitoring / Security", n.startsWith("Custom") ? ["Custom API"] : [], "Optional", "API Key", "—", "Optional architecture provider")),
  // Developer tooling
  ...([["GitHub", "Source control"], ["GitHub Actions", "CI/CD"], ["Lovable", "Prototype / development tooling"], ["Supabase", "Current demo database/runtime component"]] as [string, string][]).map(([n, note]) =>
    P(n, "Developer Tooling", ["Developer Tooling"], "Developer Tooling", "OAuth", "—", `${note} · not a required production provider`, { owner: "N/A" })),
];

const FILTERS = ["All", "Singapore / Local", "AI / LLM", "Email / Marketing", "SMS", "WhatsApp", "Voice / AI Voice", "Property / Condo", "CCTV", "Access / LPR", "Facial / Identity", "Finance / Accounting", "Developer Tooling", "Custom API"];
const TONE: Record<string, "success" | "info" | "warning" | "danger" | "muted"> = {
  Connected: "success", Current: "warning", "API Required": "warning", "Not Configured": "muted", "Coming Soon": "info", Optional: "info", "Developer Tooling": "muted", "Pending Integration": "warning",
};

type Custom = { name: string; cat: string; url: string; auth: string; secret: string; webhook: string; notes: string };

export function ProviderRegistry({ d }: PageProps) {
  const f = useServerFn(getSecretStatus);
  const sec = useQuery({ queryKey: ["secrets"], queryFn: () => f() });
  const ai = useServerFn(runAi);
  const { update } = useDemoMutations();
  const cfg: any = d.settings.find((s) => s.key === "integrations")?.value ?? {};
  const tests: Record<string, string> = cfg.registry_tests ?? {};
  const customs: Custom[] = cfg.custom_providers ?? [];
  const [tab, setTab] = useState<"providers" | "secrets">("providers");
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [cfgOpen, setCfgOpen] = useState<Prov | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const blank: Custom = { name: "", cat: "Custom API", url: "", auth: "API Key", secret: "", webhook: "", notes: "" };
  const [form, setForm] = useState<Custom>(blank);
  const names = (sec.data as any)?.names ?? {};
  const isSet = (s: string) => s.split(/\s*\/\s*|\s+or\s+/).some((k) => names[k.trim()]);

  const all: Prov[] = useMemo(() => [
    ...PROVIDERS.map((p) => (p.secret === "SEA_LION_API_KEY" || p.secret === "MAILTRAP") && sec.data && !isSet(p.secret) ? { ...p, status: "Not Configured" as Status } : p),
    ...customs.map((c) => P(c.name, c.cat, ["Custom API"], "Pending Integration", c.auth, c.secret || "—", c.notes || `Base URL ${c.url || "—"}`, { by: "MA (demo)", webhook: c.webhook ? "Pending" : "Not configured" })),
  ], [customs, sec.data]);

  const list = all.filter((p) => (filter === "All" || (filter === "Singapore / Local" ? p.local : p.filters.includes(filter))) && (!q || `${p.name} ${p.cat}`.toLowerCase().includes(q.toLowerCase())));
  const secretsSet = Object.values(names).filter(Boolean).length;
  const cards: [string, number][] = [
    ["Connected Providers", all.filter((p) => p.status === "Connected").length],
    ["API Required", all.filter((p) => p.status === "API Required" || p.status === "Current").length],
    ["Coming Soon", all.filter((p) => p.status === "Coming Soon").length],
    ["Client-Managed Subscriptions", all.filter((p) => p.owner === "Client Direct").length],
    ["Server Secrets Configured", secretsSet],
    ["Webhooks Active", 0],
  ];

  const saveTest = (n: string, r: string) => update.mutate({ table: "settings", id: "integrations", patch: { value: { ...cfg, registry_tests: { ...tests, [n]: `${new Date().toLocaleString("en-SG")} · ${r}` } } }, action: `Registry test: ${n}` });
  const test = async (p: Prov) => {
    if (p.secret === "SEA_LION_API_KEY") {
      const r: any = await ai({ data: { task: "classify", input: "Corridor light at Block 3 level 5 is flickering." } });
      const res = r.mode === "live" ? "Live OK" : r.mode === "rate_limited" ? "Rate limited (10/min)" : r.mode === "simulation" ? "Simulation (no key)" : "Failed";
      toast[r.mode === "live" ? "success" : "warning"](`SEA-LION: ${res}`); return saveTest(p.name, res);
    }
    if (p.secret === "MAILTRAP") {
      const res = isSet("MAILTRAP") ? "Secret present — send a live test from Email Settings" : "Not configured";
      toast.info(`Mailtrap: ${res}`); return saveTest(p.name, res);
    }
    toast.info(`${p.name}: demo test only — no live endpoint configured. No real request sent.`);
    saveTest(p.name, "Simulated (demo)");
  };
  const addCustom = () => {
    if (!form.name.trim()) { toast.error("Provider name required"); return; }
    update.mutate({ table: "settings", id: "integrations", patch: { value: { ...cfg, custom_providers: [...customs, form] } }, action: `Custom provider added: ${form.name}` });
    toast.success(`${form.name} saved as Pending Integration`); setForm(blank); setAddOpen(false);
  };

  const secretRows = Array.from(new Map(all.filter((p) => p.secret !== "—").flatMap((p) => p.secret.split(/\s*\/\s*|\s+or\s+/).map((s) => [s.trim(), p] as const)).reverse()).entries()).reverse();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">Provider & API Key Registry</div>
        <h3 className="mt-1 font-display text-xl font-bold text-navy">SEMS is an open integration platform — not a closed ecosystem.</h3>
        <p className="mt-1 text-sm font-medium text-navy">Integrate first. Replace only if there is a business reason.</p>
        <p className="mt-1 text-sm text-muted-foreground">If your provider is not listed, email <a className="font-medium text-primary underline" href="mailto:support@axon.com.sg">support@axon.com.sg</a> for integration assessment. Provider subscriptions and API usage are client-paid direct unless otherwise agreed.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {cards.map(([l, n]) => <div key={l} className="rounded-lg border bg-card p-3 shadow-card"><div className="text-2xl font-bold text-navy">{n}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={tab === "providers" ? "default" : "outline"} onClick={() => setTab("providers")}>Providers</Button>
        <Button size="sm" variant={tab === "secrets" ? "default" : "outline"} onClick={() => setTab("secrets")}><KeyRound className="h-3.5 w-3.5" /> API Keys & Server Secrets</Button>
        <Button size="sm" variant="outline" className="ml-auto" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5" /> Add Custom Provider</Button>
      </div>

      {tab === "providers" ? (
        <>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Provider filters">
            {FILTERS.map((x) => <button key={x} onClick={() => setFilter(x)} className={`rounded-full border px-3 py-1 text-xs font-medium ${filter === x ? "border-primary bg-primary text-primary-foreground" : "bg-card text-navy hover:bg-muted"}`}>{x}</button>)}
          </div>
          <Input placeholder="Search providers…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
          <div className="text-xs text-muted-foreground">{list.length} providers shown</div>
          <div className="overflow-x-auto rounded-lg border bg-card shadow-card">
            <table className="w-full min-w-[1200px] text-xs">
              <thead className="bg-muted text-left text-muted-foreground"><tr>{["Provider", "Category", "Region", "Status", "Authentication", "Secret / Config Name", "Configured By", "Subscription Owner", "Webhook", "Last Test", "Notes", ""].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {list.map((p, i) => (
                  <tr key={p.name + i} className="border-t align-top">
                    <td className="px-3 py-2 font-medium text-navy">{p.name}{p.badge && <div className="mt-1"><StatusBadge value={p.badge} kind={p.badge === PDPA ? "danger" : "info"} /></div>}</td>
                    <td className="px-3 py-2">{p.cat}</td>
                    <td className="px-3 py-2">{p.region}</td>
                    <td className="px-3 py-2"><StatusBadge value={p.status === "Connected" && p.secret === "SEA_LION_API_KEY" ? "Connected · POC" : p.status} kind={TONE[p.status] ?? "muted"} /></td>
                    <td className="px-3 py-2">{p.auth}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{p.secret}{p.secret !== "—" && <div className="font-sans text-[10px] text-muted-foreground">{isSet(p.secret) ? "Configured (value hidden)" : "Not configured"}</div>}</td>
                    <td className="px-3 py-2">{p.by}</td>
                    <td className="px-3 py-2">{p.owner}</td>
                    <td className="px-3 py-2">{p.webhook}</td>
                    <td className="px-3 py-2 text-muted-foreground">{tests[p.name] ?? "Never"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.notes}</td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setCfgOpen(p)}>Configure</Button>
                        <Button size="sm" variant="outline" onClick={() => test(p)}>Test</Button>
                        {p.docs ? <Button size="sm" variant="ghost" asChild><a href={p.docs} target="_blank" rel="noreferrer">Docs <ExternalLink className="h-3 w-3" /></a></Button>
                          : <Button size="sm" variant="ghost" asChild><a href={`mailto:support@axon.com.sg?subject=${encodeURIComponent(`Integration docs: ${p.name}`)}`}>Docs</a></Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Panel title="API Keys & Server Secrets">
          <p className="mb-3 flex items-start gap-2 text-sm text-navy"><ShieldCheck className="mt-0.5 h-4 w-4 text-success" /> Secrets are encrypted and stored server-side. SEMS never exposes provider API keys to residents or client-side browser code.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-xs">
              <thead className="bg-muted text-left text-muted-foreground"><tr>{["Provider", "Secret Name", "Configured Status", "Environment", "Scope", "Last Test", "Rotation Due", "Action"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {secretRows.map(([s, p]) => {
                  const on = !!names[s];
                  return (
                    <tr key={s} className="border-t">
                      <td className="px-3 py-2 font-medium text-navy">{p.name}</td>
                      <td className="px-3 py-2 font-mono text-[11px]">{s}</td>
                      <td className="px-3 py-2"><StatusBadge value={on ? "Configured" : "Not Configured"} kind={on ? "success" : "muted"} /></td>
                      <td className="px-3 py-2">{on ? "Demo" : "—"}</td>
                      <td className="px-3 py-2">Server only</td>
                      <td className="px-3 py-2 text-muted-foreground">{tests[p.name] ?? "Never"}</td>
                      <td className="px-3 py-2">{on ? "Review every 90 days" : "—"}</td>
                      <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => setCfgOpen(p)}>{on ? "Rotate" : "Configure"}</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4 text-sm">
        <Mail className="h-4 w-4 text-primary" />
        <span className="font-medium text-navy">Need another provider? Email <a className="text-primary underline" href="mailto:support@axon.com.sg">support@axon.com.sg</a> for integration.</span>
        <a className="text-primary underline" href="https://axon.com.sg" target="_blank" rel="noreferrer">axon.com.sg</a>
      </div>

      <Dialog open={!!cfgOpen} onOpenChange={(o) => !o && setCfgOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-navy">Configure — {cfgOpen?.name}</DialogTitle></DialogHeader>
          <div className="space-y-1.5 text-sm">
            <div><span className="text-muted-foreground">Authentication:</span> {cfgOpen?.auth}</div>
            <div><span className="text-muted-foreground">Secret / config name:</span> <span className="font-mono">{cfgOpen?.secret}</span></div>
            <div><span className="text-muted-foreground">Configured?</span> {cfgOpen && cfgOpen.secret !== "—" && isSet(cfgOpen.secret) ? "Yes (value hidden)" : "No"}</div>
            <div><span className="text-muted-foreground">Subscription owner:</span> {cfgOpen?.owner}</div>
          </div>
          <DemoNote>Credentials are never entered or shown in the browser. Axon stores keys as encrypted server-side secrets once the client's provider account and API access are ready.</DemoNote>
          <div className="flex gap-2">
            <Button size="sm" asChild><a href={`mailto:support@axon.com.sg?subject=${encodeURIComponent(`Configure integration: ${cfgOpen?.name ?? ""}`)}`}>Contact Axon</a></Button>
            {cfgOpen && <Button size="sm" variant="outline" onClick={() => test(cfgOpen)}>Test Connection</Button>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-navy">Add Custom Provider</DialogTitle></DialogHeader>
          <Field label="Provider Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Category"><NSelect value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} options={FILTERS.slice(2)} /></Field>
          <Field label="API Base URL"><Input placeholder="https://api.provider.example" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></Field>
          <Field label="Authentication Type"><NSelect value={form.auth} onChange={(e) => setForm({ ...form, auth: e.target.value })} options={["API Key", "OAuth", "SMTP", "Webhook", "Service Account", "SFTP", "CSV"]} /></Field>
          <Field label="Secret Name (name only)"><Input placeholder="e.g. ACME_API_KEY" value={form.secret} onChange={(e) => setForm({ ...form, secret: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_") })} /></Field>
          <Field label="Webhook URL"><Input value={form.webhook} onChange={(e) => setForm({ ...form, webhook: e.target.value })} /></Field>
          <Field label="Notes"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <DemoNote>No credential value is stored in the demo — only the secret's name.</DemoNote>
          <Button onClick={addCustom}>Save as Pending Integration</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}