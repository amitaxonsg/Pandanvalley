import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Camera, CheckCircle2, Film, Plus, Search, Sparkles, Upload, XCircle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { PageTitle } from "@/components/AppShell";
import { DemoNote, Kpi, Panel, StatusBadge } from "@/components/brand";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEMO_UNIT, DEMO_VENDOR_ID, ROLES } from "@/lib/roles";
import { nextId, useDemoMutations } from "@/lib/useDemo";
import { runAi } from "@/lib/demo.functions";
import { CommsKpis } from "./campaigns";
import { MaAddonDashboard, ResidentHome, TicketThread } from "./addon";
import { Field, MA_STAFF, NSelect, TK_CATS, WO_CATS, fmt, vendorName, workerName, type PageProps } from "./common";

/* ---------------- Dashboard ---------------- */
export function Dashboard({ role, d }: PageProps) {
  const openWO = d.work_orders.filter((w) => !["Approved", "Rejected"].includes(w.status)).length;
  const awaiting = d.work_orders.filter((w) => w.status === "Submitted").length;
  const onSite = d.attendance.filter((a) => !a.check_out && a.status !== "Left Site").length;
  const late = d.attendance.filter((a) => a.status === "Late").length;
  const openTk = d.tickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;
  const patrolPct = Math.round((d.checkpoints.filter((c) => c.status === "Completed").length / d.checkpoints.length) * 100);
  const pendingPass = d.contractor_passes.filter((p) => p.status === "Pending").length;
  const proposed = d.demerits.filter((x) => x.status === "Proposed").length;

  let kpis: [string, string | number, string, any][] = [];
  if (role === "ma" || role === "council")
    kpis = [["Open work orders", openWO, `${awaiting} awaiting approval`, "info"], ["Vendors on site", onSite, `${late} late (30-min grace)`, late ? "danger" : "success"], ["Open tickets", openTk, `${d.tickets.length} total`, "warning"], ["Patrol coverage", `${patrolPct}%`, "50 checkpoints today", patrolPct > 80 ? "success" : "danger"], ["Pending passes", pendingPass, "Contractor / mover", "warning"], ["Demerits to review", proposed, "Human approval required", "danger"], ["Units", 623, "≈1,200 residents", "info"], ["Regular vendors", d.vendors.length, "18 cleaning/landscape staff", "info"]];
  if (role === "security")
    kpis = [["Workers on site", onSite, "Checked in now", "info"], ["Late arrivals", late, "Beyond 30-min grace", "danger"], ["Approved passes", d.contractor_passes.filter((p) => p.status === "Approved").length, "Valid this week", "success"], ["Checkpoints pending", d.checkpoints.filter((c) => c.status !== "Completed").length, "Of 50", "warning"]];
  if (role === "vendor") {
    const mine = d.work_orders.filter((w) => w.vendor_id === DEMO_VENDOR_ID);
    const pts = d.demerits.filter((x) => x.vendor_id === DEMO_VENDOR_ID && x.status === "Approved").reduce((s, x) => s + x.points, 0);
    kpis = [["My open jobs", mine.filter((w) => !["Approved", "Rejected"].includes(w.status)).length, `${mine.length} total`, "info"], ["Awaiting MA approval", mine.filter((w) => w.status === "Submitted").length, "Evidence submitted", "warning"], ["Workers on site", d.attendance.filter((a) => a.vendor_id === DEMO_VENDOR_ID && !a.check_out).length, "Today", "success"], ["Demerit points", pts, "40-pt threshold (TBC)", pts >= 40 ? "danger" : "success"]];
  }
  if (role === "resident") {
    const mine = d.tickets.filter((t) => t.unit === DEMO_UNIT);
    kpis = [["My open tickets", mine.filter((t) => !["Resolved", "Closed"].includes(t.status)).length, `${mine.length} total`, "info"], ["Resolved", mine.filter((t) => ["Resolved", "Closed"].includes(t.status)).length, "", "success"], ["My contractor passes", d.contractor_passes.filter((p) => p.unit === DEMO_UNIT).length, "", "warning"]];
  }
  const shortcuts: Record<string, string[]> = { ma: ["work-orders", "attendance", "tickets", "demerits"], security: ["checkin", "scanner", "patrol", "incidents"], vendor: ["work-orders", "attendance"], resident: ["submit", "tickets", "contractors"], council: ["reports", "summary"] };
  const activity = [...d.activity].sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 10);

  return (
    <div className="space-y-6">
      <PageTitle title={`Good day, ${ROLES[role].persona}`} sub="MCST 581 Pandan Valley Condominium · live demo workspace" />
      {role === "ma" && <MaAddonDashboard role={role} d={d} />}
      {role === "ma" && <CommsKpis role={role} d={d} />}
      {role === "resident" && <ResidentHome role={role} d={d} />}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{kpis.map(([l, v, h, t]) => <Kpi key={l} label={l} value={v} hint={h} tone={t} />)}</div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Quick actions" className="lg:col-span-1">
          <div className="grid gap-2">
            {(shortcuts[role] ?? []).map((k) => (
              <Link key={k} to="/app/$page" params={{ page: k }} className="flex items-center justify-between rounded-md border px-3 py-2.5 text-sm font-medium text-navy hover:border-primary hover:bg-accent/40">
                {k.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())} <span className="text-primary">→</span>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Recent activity (all roles)" className="lg:col-span-2">
          <ul className="divide-y text-sm">
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-2">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1"><span className="font-medium text-navy">{a.actor}</span> <span className="text-muted-foreground">· {a.action}</span></div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{fmt(a.at)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      {(role === "ma" || role === "council") && (
        <Panel title="Existing systems that remain in place">
          <div className="flex flex-wrap gap-2">{["Homeplus", "Email", "Phone", "Tender Board", "Google Sheets", "Homeplus LPR/barrier", "CCTV"].map((s) => <StatusBadge key={s} value={s} kind="muted" />)}</div>
        </Panel>
      )}
    </div>
  );
}

/* ---------------- Work Orders ---------------- */
export function WorkOrders({ role, d }: PageProps) {
  const { update, create } = useDemoMutations();
  const [filter, setFilter] = useState("All");
  const [sel, setSel] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const rows = d.work_orders.filter((w) => (role === "vendor" ? w.vendor_id === DEMO_VENDOR_ID : true)).filter((w) => filter === "All" || w.status === filter);
  const cur = sel ? d.work_orders.find((w) => w.id === sel.id) : null;
  const act = (patch: any, action: string) => update.mutate({ table: "work_orders", id: cur.id, patch, action: `${action} ${cur.id}` });

  return (
    <div>
      <PageTitle title={role === "vendor" ? "My Work Orders" : "Work Orders"} sub="Before + after evidence mandatory · selected jobs need video · evidence retained 3 years"
        actions={role === "ma" && <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New Work Order</Button>} />
      <div className="mb-3 flex flex-wrap gap-1.5">
        {["All", "Draft", "Assigned", "In Progress", "Submitted", "Approved", "Rejected"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full border px-3 py-1 text-xs ${filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>{s}</button>
        ))}
      </div>
      <DataTable rows={rows} onRow={setSel} cols={[
        { h: "ID", c: (r) => <span className="font-mono text-xs">{r.id}</span> },
        { h: "Title", c: (r) => <div><div className="font-medium text-navy">{r.title}</div><div className="text-xs text-muted-foreground">{r.category} · {r.location}</div></div> },
        { h: "Vendor", c: (r) => vendorName(d, r.vendor_id), className: "hidden md:table-cell" },
        { h: "Priority", c: (r) => <StatusBadge value={r.priority} /> },
        { h: "Due", c: (r) => <span className="font-mono text-xs">{r.due_date}</span>, className: "hidden sm:table-cell" },
        { h: "Evidence", c: (r) => <span className="flex gap-1 text-xs">{r.before_uploaded ? "B✓" : "B–"} {r.after_uploaded ? "A✓" : "A–"} {r.video_required && <Film className="h-3.5 w-3.5 text-primary" />}</span> },
        { h: "Status", c: (r) => <StatusBadge value={r.status} /> },
      ]} />

      <Dialog open={!!cur} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-w-lg">
          {cur && (<>
            <DialogHeader><DialogTitle className="text-navy">{cur.id} · {cur.title}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-muted-foreground">Vendor</div>{vendorName(d, cur.vendor_id)}</div>
              <div><div className="text-xs text-muted-foreground">Status</div><StatusBadge value={cur.status} /></div>
              <div><div className="text-xs text-muted-foreground">Location</div>{cur.location}</div>
              <div><div className="text-xs text-muted-foreground">Due</div>{cur.due_date}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[["Before photo", cur.before_uploaded], ["After photo", cur.after_uploaded], ...(cur.video_required ? [["Video", cur.after_uploaded]] : [])].map(([l, ok]: any) => (
                <div key={l} className={`flex aspect-video flex-col items-center justify-center rounded-md border text-xs ${ok ? "border-success/40 bg-success/10 text-success" : "border-dashed text-muted-foreground"}`}>
                  {l === "Video" ? <Film className="h-5 w-5" /> : <Camera className="h-5 w-5" />}{l}<span>{ok ? "Uploaded (demo)" : "Required"}</span>
                </div>
              ))}
            </div>
            <DemoNote>Uploads are simulated placeholders — no real photos stored in the demo.</DemoNote>
            {role === "ma" && !["Approved"].includes(cur.status) && (
              <Field label="Reassign vendor (editable before approval)">
                <NSelect value={cur.vendor_id} onChange={(e) => act({ vendor_id: e.target.value }, "Reassigned")} options={d.vendors.map((v) => ({ v: v.id, l: `${v.company} (${v.category})` }))} />
              </Field>
            )}
            <div className="flex flex-wrap gap-2">
              {role === "ma" && cur.status === "Draft" && <Button onClick={() => act({ status: "Assigned" }, "Assigned")}>Assign & email vendor</Button>}
              {role === "ma" && cur.status === "Submitted" && <>
                <Button onClick={() => act({ status: "Approved" }, "Approved")}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
                <Button variant="destructive" onClick={() => act({ status: "Rejected" }, "Rejected")}><XCircle className="h-4 w-4" /> Reject</Button>
              </>}
              {role === "ma" && cur.status === "Rejected" && <Button variant="outline" onClick={() => act({ status: "Assigned", after_uploaded: false }, "Re-opened")}>Re-open for rework</Button>}
              {role === "vendor" && cur.status === "Assigned" && <Button onClick={() => act({ status: "In Progress", before_uploaded: true }, "Started + before photo")}><Camera className="h-4 w-4" /> Start & upload Before</Button>}
              {role === "vendor" && cur.status === "In Progress" && <Button onClick={() => act({ status: "Submitted", after_uploaded: true }, "Submitted after evidence")}><Camera className="h-4 w-4" /> Upload After & Submit</Button>}
            </div>
          </>)}
        </DialogContent>
      </Dialog>
      <NewWO open={creating} onClose={() => setCreating(false)} d={d} create={create} />
    </div>
  );
}

function NewWO({ open, onClose, d, create }: any) {
  const [f, setF] = useState({ title: "", category: "Cleaning", vendor_id: "V01", location: "Block A", priority: "Medium", due_date: "2026-10-20", video_required: false });
  const submit = () => {
    if (!f.title.trim()) return;
    const id = nextId(d.work_orders, "WO-2026-", 100);
    create.mutate({ table: "work_orders", row: { ...f, id, status: "Draft", created_at: new Date().toISOString(), before_uploaded: false, after_uploaded: false, notes: "Before + after photos mandatory. Evidence retained 3 years." }, action: `Created ${id}`, toast: `${id} created` });
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle className="text-navy">New Work Order</DialogTitle></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Replace pump seal, Block B" /></Field>
          <Field label="Category"><NSelect value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} options={WO_CATS} /></Field>
          <Field label="Vendor"><NSelect value={f.vendor_id} onChange={(e) => setF({ ...f, vendor_id: e.target.value })} options={d.vendors.map((v: any) => ({ v: v.id, l: v.company }))} /></Field>
          <Field label="Location"><NSelect value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} options={["Block A", "Block B", "Block C", "Block D", "Clubhouse", "Main Gate", "Carpark B1", "Pool Deck"]} /></Field>
          <Field label="Priority"><NSelect value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })} options={["Low", "Medium", "High", "Urgent"]} /></Field>
          <Field label="Due date"><Input type="date" value={f.due_date} onChange={(e) => setF({ ...f, due_date: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.video_required} onChange={(e) => setF({ ...f, video_required: e.target.checked })} /> Video evidence required</label>
        </div>
        <Button onClick={submit} disabled={!f.title.trim()}>Create as Draft</Button>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Attendance (MA/Vendor view) ---------------- */
export function Attendance({ role, d }: PageProps) {
  const rows = d.attendance.filter((a) => (role === "vendor" ? a.vendor_id === DEMO_VENDOR_ID : true));
  return (
    <div className="space-y-4">
      <PageTitle title={role === "vendor" ? "My Attendance" : "Vendor Attendance"} sub="Individual worker records · 30-minute grace period · leave/re-entry allowed" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {["On Time", "Within Grace", "Late", "Re-entered"].map((s) => <Kpi key={s} label={s} value={rows.filter((r) => r.status === s).length} tone={s === "Late" ? "danger" : s === "On Time" ? "success" : "info"} />)}
      </div>
      {role === "ma" && rows.some((r) => r.status === "Late") && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">MA alert: {rows.filter((r) => r.status === "Late").length} worker(s) arrived beyond the 30-minute grace period.</div>}
      <DataTable rows={rows} cols={[
        { h: "Worker", c: (r) => <div><div className="font-medium text-navy">{workerName(d, r.worker_id)}</div>{role === "ma" && <div className="font-mono text-[11px] text-muted-foreground">ID {d.workers.find((w) => w.id === r.worker_id)?.id_masked}</div>}</div> },
        { h: "Vendor", c: (r) => vendorName(d, r.vendor_id), className: "hidden md:table-cell" },
        { h: "Gate", c: (r) => r.gate },
        { h: "In", c: (r) => <span className="font-mono">{r.check_in}</span> },
        { h: "Out", c: (r) => <span className="font-mono">{r.check_out ?? "—"}</span> },
        { h: "Status", c: (r) => <StatusBadge value={r.status} /> },
        { h: "Face verify", c: () => <StatusBadge value="Pending PDPA" kind="warning" />, className: "hidden lg:table-cell" },
        { h: "Remarks", c: (r) => <span className="text-xs text-muted-foreground">{r.remarks}</span>, className: "hidden lg:table-cell" },
      ]} />
      <DemoNote>Face verification was requested but is disabled pending biometric/PDPA confirmation. No biometric data is collected.</DemoNote>
    </div>
  );
}

/* ---------------- Security: Check-in ---------------- */
export function CheckIn({ d }: PageProps) {
  const { update, create } = useDemoMutations();
  const [q, setQ] = useState("");
  const [gate, setGate] = useState("Main Gate");
  const workers = d.workers.filter((w) => `${w.name} ${vendorName(d, w.vendor_id)}`.toLowerCase().includes(q.toLowerCase()));
  const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Singapore" });
  const checkIn = (w: any) => {
    const t = now();
    const [h = 0, m = 0] = t.split(":").map(Number);
    const mins = h * 60 + m - 8 * 60; // shift start 08:00
    const status = mins <= 0 ? "On Time" : mins <= 30 ? "Within Grace" : "Late";
    create.mutate({ table: "attendance", row: { id: nextId(d.attendance, "AT-", 2000), worker_id: w.id, vendor_id: w.vendor_id, gate, date: new Date().toISOString().slice(0, 10), check_in: t, check_out: null, status, face_verify: "Pending PDPA confirmation", remarks: status === "Late" ? "Exceeded 30-min grace. MA alerted." : "" }, action: `Checked in ${w.id} at ${gate} (${status})`, toast: status === "Late" ? "Checked in — LATE, MA alerted" : "Checked in" });
  };
  const open = (wid: string) => d.attendance.find((a) => a.worker_id === wid && !a.check_out);
  return (
    <div className="space-y-4">
      <PageTitle title="Vendor Check-In" sub="Record each individual worker at the gate" />
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-8" placeholder="Search worker or company" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <NSelect className="w-44" value={gate} onChange={(e) => setGate(e.target.value)} options={["Main Gate", "Side Gate", "Service Gate"]} />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {workers.map((w) => {
          const rec = open(w.id);
          return (
            <div key={w.id} className="rounded-lg border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div><div className="font-semibold text-navy">{w.name}</div><div className="text-xs text-muted-foreground">{vendorName(d, w.vendor_id)} · {w.role}</div></div>
                {rec ? <StatusBadge value={rec.status} /> : <StatusBadge value="Off site" kind="muted" />}
              </div>
              {rec && <div className="mt-2 font-mono text-xs text-muted-foreground">In {rec.check_in} · {rec.gate}</div>}
              <div className="mt-3 flex gap-2">
                {!rec ? <Button size="sm" onClick={() => checkIn(w)}>Check In</Button> : <>
                  <Button size="sm" variant="outline" onClick={() => update.mutate({ table: "attendance", id: rec.id, patch: { check_out: now() }, action: `Checked out ${w.id}` })}>Check Out</Button>
                  <Button size="sm" variant="ghost" onClick={() => update.mutate({ table: "attendance", id: rec.id, patch: { status: "Re-entered", remarks: `Left & re-entered at ${now()}` }, action: `Re-entry ${w.id}` })}>Log Re-entry</Button>
                </>}
              </div>
            </div>
          );
        })}
      </div>
      <DemoNote>Face verification disabled — pending biometric/PDPA confirmation.</DemoNote>
    </div>
  );
}

/* ---------------- Contractors ---------------- */
export function Contractors({ role, d }: PageProps) {
  const { update, create } = useDemoMutations();
  const [sel, setSel] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const rows = d.contractor_passes.filter((p) => (role === "resident" ? p.unit === DEMO_UNIT : true));
  const cur = sel ? d.contractor_passes.find((p) => p.id === sel.id) : null;
  const [f, setF] = useState({ company: "", contact_name: "", vehicle: "", purpose: "Renovation", start_date: "2026-10-10", end_date: "2026-10-15", deposit: 1000, unit: DEMO_UNIT, remarks: "" });
  const submit = () => {
    const id = nextId(d.contractor_passes, "CP-", 4000);
    create.mutate({ table: "contractor_passes", row: { ...f, id, time_window: "09:00-17:00", deposit_status: "Pending", status: "Pending", initiated_by: role === "ma" ? "MA" : "Resident", entries: 0 }, action: `Requested pass ${id}`, toast: `${id} submitted for MA approval` });
    setOpen(false);
  };
  return (
    <div>
      <PageTitle title={role === "resident" ? "Contractor / Mover Requests" : "Contractor & Mover Passes"} sub="MA approval · deposit · multiple entry · email + SMS on approval"
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New pass request</Button>} />
      <DataTable rows={rows} onRow={setSel} cols={[
        { h: "Pass", c: (r) => <span className="font-mono text-xs">{r.id}</span> },
        { h: "Company", c: (r) => <div><div className="font-medium text-navy">{r.company}</div><div className="text-xs text-muted-foreground">{r.purpose}</div></div> },
        { h: "Unit", c: (r) => r.unit },
        { h: "Vehicle", c: (r) => <span className="font-mono text-xs">{r.vehicle}</span>, className: "hidden md:table-cell" },
        { h: "Dates", c: (r) => <span className="font-mono text-xs">{r.start_date} → {r.end_date}</span>, className: "hidden lg:table-cell" },
        { h: "Deposit", c: (r) => <span className="text-xs">S${r.deposit} <StatusBadge value={r.deposit_status} /></span> },
        { h: "Status", c: (r) => <StatusBadge value={r.status} /> },
      ]} />
      <p className="mt-2 text-xs text-muted-foreground">Gate access is currently Homeplus LPR (not RFID). Axon shows pass details to Security; it does not open the barrier.</p>
      <Dialog open={!!cur} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent>
          {cur && (<>
            <DialogHeader><DialogTitle className="text-navy">{cur.id} · {cur.company}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Contact", cur.contact_name], ["Unit", cur.unit], ["Vehicle", cur.vehicle], ["Purpose", cur.purpose], ["Dates", `${cur.start_date} → ${cur.end_date}`], ["Time", cur.time_window], ["Deposit", `S$${cur.deposit} (${cur.deposit_status})`], ["Entries", cur.entries], ["Initiated by", cur.initiated_by], ["Remarks", cur.remarks || "—"]].map(([k, v]) => <div key={k}><div className="text-xs text-muted-foreground">{k}</div>{v}</div>)}
            </div>
            {role === "ma" && (
              <div className="flex flex-wrap gap-2">
                {cur.deposit_status === "Pending" && <Button variant="outline" onClick={() => update.mutate({ table: "contractor_passes", id: cur.id, patch: { deposit_status: "Paid" }, action: `Deposit received ${cur.id}` })}>Mark deposit paid</Button>}
                {cur.status === "Pending" && <>
                  <Button onClick={() => update.mutate({ table: "contractor_passes", id: cur.id, patch: { status: "Approved" }, action: `Approved pass ${cur.id}`, toast: "Approved — email sent, SMS queued (demo)" })}>Approve & notify</Button>
                  <Button variant="destructive" onClick={() => update.mutate({ table: "contractor_passes", id: cur.id, patch: { status: "Rejected" }, action: `Rejected pass ${cur.id}` })}>Reject</Button>
                </>}
                {cur.status === "Used" && cur.deposit_status === "Paid" && <Button variant="outline" onClick={() => update.mutate({ table: "contractor_passes", id: cur.id, patch: { deposit_status: "Refunded" }, action: `Deposit refunded ${cur.id}` })}>Refund deposit</Button>}
              </div>
            )}
          </>)}
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-navy">New contractor / mover pass</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Company"><Input value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></Field>
            <Field label="Contact name"><Input value={f.contact_name} onChange={(e) => setF({ ...f, contact_name: e.target.value })} /></Field>
            <Field label="Unit"><Input value={f.unit} disabled={role === "resident"} onChange={(e) => setF({ ...f, unit: e.target.value })} /></Field>
            <Field label="Vehicle no."><Input value={f.vehicle} onChange={(e) => setF({ ...f, vehicle: e.target.value.toUpperCase() })} /></Field>
            <Field label="Purpose"><NSelect value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} options={["Moving in", "Moving out", "Renovation", "Aircon servicing", "Window grille install", "Delivery"]} /></Field>
            <Field label="Deposit (S$)"><NSelect value={String(f.deposit)} onChange={(e) => setF({ ...f, deposit: Number(e.target.value) })} options={["500", "1000", "1500"]} /></Field>
            <Field label="Start"><Input type="date" value={f.start_date} onChange={(e) => setF({ ...f, start_date: e.target.value })} /></Field>
            <Field label="End"><Input type="date" value={f.end_date} onChange={(e) => setF({ ...f, end_date: e.target.value })} /></Field>
            <Field label="Remarks" className="sm:col-span-2"><Input value={f.remarks} onChange={(e) => setF({ ...f, remarks: e.target.value })} /></Field>
          </div>
          <Button onClick={submit} disabled={!f.company || !f.vehicle}>Submit for MA approval</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Security: Scanner ---------------- */
export function Scanner({ d }: PageProps) {
  const { update } = useDemoMutations();
  const [q, setQ] = useState("CP-4002");
  const p = useMemo(() => d.contractor_passes.find((x) => x.id.toLowerCase() === q.trim().toLowerCase() || x.vehicle.toLowerCase() === q.trim().toLowerCase()), [q, d]);
  const valid = p && p.status === "Approved";
  return (
    <div className="max-w-3xl space-y-4">
      <PageTitle title="Contractor Pass Scanner" sub="Enter pass ID or vehicle number (QR scanning simulated)" />
      <div className="flex gap-2"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="CP-4002 or GB1234X" className="font-mono" /></div>
      <div className="flex flex-wrap gap-1.5 text-xs">Try: {d.contractor_passes.slice(0, 6).map((x) => <button key={x.id} className="rounded border bg-card px-2 py-0.5 font-mono hover:border-primary" onClick={() => setQ(x.id)}>{x.id}</button>)}</div>
      {!p ? <Panel><p className="text-sm text-muted-foreground">No pass found.</p></Panel> : (
        <div className={`rounded-xl border-2 bg-card p-5 shadow-card ${valid ? "border-success" : "border-destructive"}`}>
          <div className="flex items-center justify-between">
            <div className="font-display text-xl font-bold text-navy">{p.company}</div>
            <span className={`rounded-md px-3 py-1 text-sm font-bold ${valid ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>{valid ? "VALID — ALLOW ENTRY" : `NOT VALID (${p.status})`}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[["Name", p.contact_name], ["Unit", p.unit], ["Vehicle", p.vehicle], ["Approval", p.status], ["Date", `${p.start_date} → ${p.end_date}`], ["Time", p.time_window], ["Deposit", `S$${p.deposit} · ${p.deposit_status}`], ["Purpose", p.purpose], ["Remarks", p.remarks || "—"]].map(([k, v]) => <div key={k}><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>)}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button disabled={!valid} onClick={() => update.mutate({ table: "contractor_passes", id: p.id, patch: { entries: (p.entries ?? 0) + 1 }, action: `Recorded entry for ${p.id}`, toast: "Entry recorded" })}>Record Entry</Button>
            <span className="text-sm text-muted-foreground">Entries so far: <b>{p.entries}</b> (multiple entry allowed)</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Tickets ---------------- */
export function Tickets({ role, d }: PageProps) {
  const { update } = useDemoMutations();
  const [sel, setSel] = useState<any>(null);
  const [reply, setReply] = useState("");
  const qc = useQueryClient();
  useEffect(() => { const o = new URLSearchParams(window.location.search).get("open"); if (o) { setSel({ id: o }); qc.invalidateQueries({ queryKey: ["demo"] }); } }, [qc]);
  const rows = d.tickets.filter((t) => (role === "resident" ? t.unit === DEMO_UNIT : true)).sort((a, b) => b.id.localeCompare(a.id));
  const cur = sel ? d.tickets.find((t) => t.id === sel.id) : null;
  const overdue = (t: any) => !["Resolved", "Closed"].includes(t.status) && t.sla_due < "2026-10-05";
  const ai = useServerFn(runAi);
  const [aiBusy, setAiBusy] = useState(false);
  const draft = async () => {
    setAiBusy(true);
    const r = await ai({ data: { task: "draft_reply", input: `${cur.title}\n${cur.description}` } });
    setReply(r.output + (r.mode === "simulation" ? "\n\n[SIMULATION — SEA-LION key not configured]" : ""));
    setAiBusy(false);
  };
  return (
    <div>
      <PageTitle title={role === "resident" ? "My Issues" : "Resident Tickets"} sub={role === "resident" ? "You see replies from the Managing Agent only" : "MA controls assignment, reassignment, resolution and closure"} />
      <DataTable rows={rows} onRow={(r) => { setSel(r); setReply(""); }} cols={[
        { h: "ID", c: (r) => <span className="font-mono text-xs">{r.id}</span> },
        { h: "Issue", c: (r) => <div><div className="font-medium text-navy">{r.title}</div><div className="text-xs text-muted-foreground">{r.category}{role === "ma" && ` · ${r.unit} · ${r.resident_name}`}</div></div> },
        { h: "Assigned", c: (r) => <span className="text-xs">{r.assigned_to ?? "—"}</span>, className: "hidden md:table-cell" },
        { h: "SLA due", c: (r) => <span className={`font-mono text-xs ${overdue(r) ? "font-bold text-destructive" : ""}`}>{fmt(r.sla_due)}{overdue(r) && " ⚠"}</span>, className: "hidden sm:table-cell" },
        { h: "Status", c: (r) => <StatusBadge value={r.status} /> },
      ]} />
      <Dialog open={!!cur} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="max-w-lg">
          {cur && (<>
            <DialogHeader><DialogTitle className="text-navy">{cur.id} · {cur.title}</DialogTitle></DialogHeader>
            <div className="flex flex-wrap gap-2"><StatusBadge value={cur.status} /><StatusBadge value={cur.category} kind="info" /><StatusBadge value={cur.priority} /></div>
            <p className="text-sm text-muted-foreground">{cur.description}</p>
            {role === "ma" && <div className="rounded-md bg-muted px-3 py-2 text-xs">Sensitive (MA only): {cur.resident_name} · {cur.unit}</div>}
            {cur.ma_reply && <div className="rounded-md border-l-4 border-primary bg-accent/40 p-3 text-sm"><div className="mb-1 text-xs font-semibold text-primary">Reply from Managing Agent</div>{cur.ma_reply}</div>}
            <TicketThread role={role} d={d} ticket={cur} />
            {role === "ma" && (<>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Assign / reassign"><NSelect value={cur.assigned_to ?? ""} onChange={(e) => update.mutate({ table: "tickets", id: cur.id, patch: { assigned_to: e.target.value, status: cur.status === "New" ? "Assigned" : cur.status }, action: `Assigned ${cur.id} to ${e.target.value}` })} options={[{ v: "", l: "Unassigned" }, ...MA_STAFF]} /></Field>
                <Field label="Status"><NSelect value={cur.status} onChange={(e) => update.mutate({ table: "tickets", id: cur.id, patch: { status: e.target.value }, action: `${cur.id} → ${e.target.value}`, toast: "Status updated — resident emailed" })} options={["New", "Assigned", "In Progress", "Waiting Resident", "Resolved", "Closed"]} /></Field>
              </div>
              <Field label="Reply to resident"><Textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply the resident will see…" /></Field>
              <div className="flex gap-2">
                <Button variant="outline" onClick={draft} disabled={aiBusy}><Sparkles className="h-4 w-4" /> {aiBusy ? "Drafting…" : "AI draft reply"}</Button>
                <Button disabled={!reply.trim()} onClick={() => { update.mutate({ table: "tickets", id: cur.id, patch: { ma_reply: reply.replace(/\n\n\[SIMULATION.*\]$/, "") }, action: `Replied to ${cur.id}`, toast: "Reply sent — human approved" }); setReply(""); }}>Approve & send reply</Button>
              </div>
            </>)}
          </>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Resident: Submit ---------------- */
export function Submit({ d }: PageProps) {
  const { create } = useDemoMutations();
  const ai = useServerFn(runAi);
  const [f, setF] = useState({ category: "Cleaning", title: "", description: "" });
  const [loc, setLoc] = useState("Block 5");
  const [urg, setUrg] = useState("Normal");
  const [photo, setPhoto] = useState<string | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const pick = (fl?: FileList | null) => { const x = fl?.[0]; if (!x) return; setPhoto(`${x.name} (${Math.round(x.size / 1024)} KB)`); setThumb(URL.createObjectURL(x)); };
  const [sug, setSug] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const submit = () => {
    const id = nextId(d.tickets, "TK-", 3000);
    const due = new Date(Date.now() + 3 * 864e5).toISOString();
    create.mutate({ table: "tickets", row: { ...f, description: `[Location: ${loc} · Urgency: ${urg}] ${f.description}`, id, unit: DEMO_UNIT, resident_name: "Resident Demo 1", status: "New", priority: urg === "Urgent" || f.category === "Safety" ? "High" : urg === "Low" ? "Low" : "Medium", assigned_to: null, created_at: new Date().toISOString(), sla_due: due, ma_reply: "" }, action: `Submitted ticket ${id}`, toast: `${id} submitted` });
    if (photo) create.mutate({ table: "ticket_comments", row: { id: `TC-${Date.now()}`, ticket_id: id, at: new Date().toISOString(), author: "Resident Demo 1", role: "resident", body: "Photo attached at submission", visibility: "public", attachment: photo }, action: `Photo attached to ${id}` });
    setPhoto(null); setThumb(null);
    setDone(id);
    setF({ category: "Cleaning", title: "", description: "" });
    setSug(null);
  };
  return (
    <div className="max-w-2xl">
      <PageTitle title="Report an Issue" sub="Logged in as Resident #05-12 (demo) · no anonymous submissions · use your phone camera to capture the problem" />
      {done && <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-success/40 bg-success/10 p-3 text-sm text-success"><span>Issue <b className="font-mono">{done}</b> submitted to the MA. You can add more photos or comments from My Issues.</span><Button asChild size="sm"><Link to="/app/$page" params={{ page: "tickets" }} search={{ open: done } as any}>Track This Issue</Link></Button></div>}
      <Panel>
        <div className="space-y-4">
          <Field label="Category"><div className="flex flex-wrap gap-1.5">{TK_CATS.map((c) => <button key={c} onClick={() => setF({ ...f, category: c })} className={`rounded-full border px-3 py-1 text-xs ${f.category === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{c}</button>)}</div></Field>
          <Field label="Short title"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Corridor light flickering at level 5" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Location / block"><Input value={loc} onChange={(e) => setLoc(e.target.value)} /></Field>
            <Field label="Urgency"><div className="flex gap-1.5">{["Low", "Normal", "Urgent"].map((u) => <button key={u} onClick={() => setUrg(u)} className={`rounded-full border px-3 py-1 text-xs ${urg === u ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{u}</button>)}</div></Field>
          </div>
          <Field label="Description"><Textarea rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
          <Field label="Photo of the issue">
            <div className="rounded-lg border-2 border-dashed border-primary/40 bg-accent/30 p-4">
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => document.getElementById("cam-input")?.click()}><Camera className="h-4 w-4" /> Take Photo</Button>
                <Button type="button" variant="outline" onClick={() => document.getElementById("upl-input")?.click()}><Upload className="h-4 w-4" /> Upload Photo</Button>
                <input id="cam-input" aria-label="Take Photo input" type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => pick(e.target.files)} />
                <input id="upl-input" aria-label="Photo" type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files)} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">On a phone, Take Photo opens your camera. You can add more photos after submitting.</p>
              {thumb && <div className="mt-3 flex items-center gap-3"><img src={thumb} alt="Selected photo preview" className="h-20 w-20 rounded-md border object-cover" /><div className="text-xs"><div className="font-medium">{photo}</div><button className="text-destructive underline" onClick={() => { setPhoto(null); setThumb(null); }}>Remove</button></div></div>}
            </div>
            <span className="text-[11px] text-muted-foreground">Demo stores the photo name and size only; production stores the image securely.</span>
          </Field>
          {sug && <pre className="whitespace-pre-wrap rounded-md bg-accent/50 p-3 text-xs">{sug}</pre>}
          <div className="flex gap-2">
            <Button variant="outline" disabled={!f.title} onClick={async () => { const r = await ai({ data: { task: "classify", input: `${f.title}. ${f.description}` } }); setSug(`${r.mode === "simulation" ? "AI SIMULATION" : "SEA-LION"} suggestion:\n${r.output}`); }}><Sparkles className="h-4 w-4" /> AI suggest category</Button>
            <Button disabled={!f.title.trim()} onClick={submit}>Submit to MA</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}