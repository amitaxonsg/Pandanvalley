CREATE TABLE public.campaigns (id text PRIMARY KEY, name text NOT NULL, type text, subject text, category text, audience text, channels text, schedule_at text, expiry text, body text, attachment text, cta_label text, cta_url text, ack_required boolean DEFAULT false, sender text, tags text, status text DEFAULT 'Draft', created_by text, approved_by text, approval_status text DEFAULT 'Pending', created_at text, wa_template text, wa_language text, recipients integer DEFAULT 0, delivered integer DEFAULT 0, opened integer DEFAULT 0, clicked integer DEFAULT 0, bounced integer DEFAULT 0, failed integer DEFAULT 0);
CREATE TABLE public.campaign_deliveries (id text PRIMARY KEY, campaign_id text, channel text, recipient text, unit text, status text, at text, detail text);
CREATE TABLE public.provider_configs (id text PRIMARY KEY, category text, provider text, status text, auth_type text, configured_by text, subscription_owner text, webhook_status text, notes text, selected boolean DEFAULT false);
CREATE TABLE public.webhook_events (id text PRIMARY KEY, provider text, event text, at text, payload text);
CREATE TABLE public.comm_audit (id text PRIMARY KEY, at text, resident text, change text, actor text);
GRANT ALL ON public.campaigns, public.campaign_deliveries, public.provider_configs, public.webhook_events, public.comm_audit TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comm_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS opt_whatsapp boolean DEFAULT false, ADD COLUMN IF NOT EXISTS opt_voice boolean DEFAULT false, ADD COLUMN IF NOT EXISTS opt_marketing boolean DEFAULT false;

CREATE OR REPLACE FUNCTION public.seed_comms() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $f$
BEGIN
  TRUNCATE campaigns, campaign_deliveries, provider_configs, webhook_events, comm_audit;
  UPDATE residents SET opt_whatsapp = (right(id,1) IN ('1','3','5','7')), opt_voice = (right(id,1) IN ('2','5')), opt_marketing = false WHERE id IS NOT NULL;
  INSERT INTO campaigns VALUES
  ('CP-001','October Monthly Circular','Monthly Circular','[Pandan Valley] Monthly Circular — October 2026','General','All Residents','PWA,Email','2026-10-01T09:00','2026-10-31','Highlights for October: lift modernisation, pool closure 14 Oct, AGM notice.',null,'Read circular','https://sems.axon.com.sg/app/notices',true,'Axon 1Pro Smart Estate Management','monthly,circular','Sent','MA Executive (Demo)','Condo Manager (Demo)','Approved','2026-09-28T10:00',null,null,30,29,21,9,1,0),
  ('CP-002','Water shutdown Block C','Maintenance Advisory','[Pandan Valley] Estate Notice — Water shutdown Block C','Water Shutdown','Selected Blocks: C','PWA,Email,SMS','2026-10-06T08:00','2026-10-08','Water supply to Block C will be shut 10am–2pm on 8 Oct for pump works.',null,null,null,true,'Axon 1Pro Smart Estate Management','water','Scheduled','MA Executive (Demo)','Condo Manager (Demo)','Approved','2026-10-03T15:00',null,null,8,0,0,0,0,0),
  ('CP-003','Fire alarm test reminder','Emergency Notice','[Pandan Valley] Emergency Notice — Fire alarm test','Emergency','All Residents','PWA,Email,SMS,Voice','2026-10-02T09:00','2026-10-03','Fire alarm system test on 3 Oct 10–11am. No evacuation needed.',null,null,null,true,'Axon 1Pro Smart Estate Management','emergency','Partially Failed','Condo Manager (Demo)','Condo Manager (Demo)','Approved','2026-10-01T17:00',null,null,30,26,18,0,2,2),
  ('CP-004','AGM 2026 invitation','Event / AGM / Council','[Pandan Valley] Estate Notice — AGM 2026','AGM/Council','Owners','PWA,Email,WhatsApp','2026-10-15T09:00','2026-11-15','The 2026 AGM will be held on 15 Nov at the Clubhouse.',null,'RSVP','https://sems.axon.com.sg/app/notices',false,'Axon 1Pro Smart Estate Management','agm','Draft','MA Executive (Demo)',null,'Pending','2026-10-04T11:00','agm_invite_v1','en',0,0,0,0,0,0),
  ('CP-005','Post-repair feedback survey','Survey / Feedback Request','How did we do?','General','Custom Segment: closed tickets (30 days)','PWA,Email','2026-10-05T10:00',null,'Please rate how your recent issue was handled.',null,'Take survey','https://sems.axon.com.sg/app/tickets',false,'Axon 1Pro Smart Estate Management','survey','Draft','MA Executive (Demo)',null,'Pending','2026-10-04T12:00',null,null,0,0,0,0,0,0),
  ('CP-006','Lift 3 contractor works','Contractor Works','[Pandan Valley] Estate Notice — Lift 3 works','Contractor Works','Selected Blocks: D','PWA','2026-09-20T08:00','2026-09-30','Lift 3 Block D under maintenance 22–26 Sep.',null,null,null,false,'Axon 1Pro Smart Estate Management','lift','Sent','MA Executive (Demo)','Condo Manager (Demo)','Approved','2026-09-18T09:00',null,null,6,6,5,0,0,0);
  INSERT INTO campaign_deliveries VALUES
  ('CD-001','CP-001','Email','r***1@resident-demo.sg','#05-12','Opened','2026-10-01T09:02','Demo analytics'),
  ('CD-002','CP-001','PWA','#05-12','#05-12','Delivered','2026-10-01T09:00','Portal notification'),
  ('CD-003','CP-001','Email','r***7@resident-demo.sg','#02-03','Bounced','2026-10-01T09:03','Mailbox unavailable (demo)'),
  ('CD-004','CP-003','SMS','+65 9***1203','#03-07','Failed','2026-10-02T09:01','Simulated — no SMS provider configured'),
  ('CD-005','CP-003','Voice','+65 9***4410','#07-01','Failed','2026-10-02T09:01','Simulated — voice provider not configured'),
  ('CD-006','CP-003','Email','r***2@resident-demo.sg','#05-12','Delivered','2026-10-02T09:00','Demo analytics'),
  ('CD-007','CP-006','PWA','#08-04','#08-04','Acknowledged','2026-09-20T10:15','Portal'),
  ('CD-008','CP-001','Email','r***4@resident-demo.sg','#04-09','Clicked','2026-10-01T11:20','Demo analytics');
  INSERT INTO provider_configs VALUES
  ('PV-01','Email','Axon SMTP / Mailtrap','Connected','SMTP API token (server secret)','Axon','Axon Managed','Not configured','Current transactional/demo sender amit@axon.com.sg',true),
  ('PV-02','Email','SendGrid','Not Configured','API key','—','Client Direct','—','Example provider',false),
  ('PV-03','Email','Mailgun','Not Configured','API key','—','Client Direct','—','Example provider',false),
  ('PV-04','Email','Amazon SES','Not Configured','IAM access key / SMTP','—','Client Direct','—','Example provider',false),
  ('PV-05','Email','Brevo','Not Configured','API key','—','Client Direct','—','Example provider',false),
  ('PV-06','Email','Mailchimp','Coming Soon','OAuth / API key','—','Client Direct','—','Marketing campaigns; consent required',false),
  ('PV-07','Email','Custom SMTP / API','API Required','SMTP / API key','—','Client Direct','—','Any provider with a suitable API',false),
  ('PV-11','SMS','Twilio','Not Configured','API key + secret','—','Client Direct','—','Usage charges paid to provider',false),
  ('PV-12','SMS','Bird / MessageBird','Not Configured','API key','—','Client Direct','—','Usage charges paid to provider',false),
  ('PV-13','SMS','Vonage','Not Configured','API key + secret','—','Client Direct','—','Usage charges paid to provider',false),
  ('PV-14','SMS','Custom SMS API','API Required','API key / webhook','—','Client Direct','—','Integration assessment by Axon',false),
  ('PV-21','WhatsApp','Meta WhatsApp Business Cloud API','Not Configured','OAuth system user token','—','Client Direct','—','Template approval by Meta',false),
  ('PV-22','WhatsApp','Twilio WhatsApp','Not Configured','API key + secret','—','Client Direct','—','Template approval required',false),
  ('PV-23','WhatsApp','Bird / MessageBird WhatsApp','Not Configured','API key','—','Client Direct','—','Template approval required',false),
  ('PV-24','WhatsApp','Vonage WhatsApp','Not Configured','API key + secret','—','Client Direct','—','Template approval required',false),
  ('PV-25','WhatsApp','Custom WhatsApp BSP/API','API Required','API key / webhook','—','Client Direct','—','Integration assessment by Axon',false),
  ('PV-31','Voice','ElevenLabs','Not Configured','API key','—','Client Direct','—','Voice/TTS/voice agent — not email/SMS',false),
  ('PV-32','Voice','SEA-LION text + ElevenLabs voice','Coming Soon','Server secrets','—','Client Direct','—','Optional multilingual workflow',false),
  ('PV-33','Voice','Twilio Voice','Not Configured','API key + secret','—','Client Direct','—','Outbound calls / IVR',false),
  ('PV-34','Voice','Custom Voice API','API Required','API key / webhook','—','Client Direct','—','Integration assessment by Axon',false);
  INSERT INTO webhook_events VALUES
  ('WH-001','Axon SMTP / Mailtrap','delivery (demo)','2026-10-01T09:02','{"campaign":"CP-001","status":"delivered"}'),
  ('WH-002','Axon SMTP / Mailtrap','bounce (demo)','2026-10-01T09:03','{"campaign":"CP-001","status":"bounced"}'),
  ('WH-003','Twilio (example)','sms.failed (simulated)','2026-10-02T09:01','{"campaign":"CP-003","reason":"provider not configured"}');
  INSERT INTO comm_audit VALUES
  ('CA-001','2026-09-30T20:11','#05-12 Resident Demo 1','SMS opt-in ON','Resident (PWA)'),
  ('CA-002','2026-10-02T08:40','#03-07','Email opt-out (essential notices still sent)','MA Executive (Demo)');
  INSERT INTO automations VALUES
  ('AU-C1','Monthly circular draft','1st of month 08:00','Draft circular for MA approval (PWA + Email)','All residents',true,'2026-10-01T08:00','2026-11-01T08:00','Communications'),
  ('AU-C2','Maintenance notice schedule','Maintenance booked in calendar','Schedule notice 3 days before (PWA + Email)','Affected blocks',true,'2026-10-03T08:00','2026-10-06T08:00','Communications'),
  ('AU-C3','Emergency multi-channel alert','MA declares emergency','PWA + Email + SMS + Voice (configured providers only)','All residents',false,null,null,'Communications'),
  ('AU-C4','Event reminder','2 days before event','Reminder via PWA + Email / WhatsApp','RSVP list',true,'2026-09-28T09:00','2026-11-13T09:00','Communications'),
  ('AU-C5','Unread critical notice reminder','Critical notice unread after 48h','Re-send via SMS (if subscribed) + PWA','Unread units',true,'2026-10-03T09:00','2026-10-05T09:00','Communications'),
  ('AU-C6','Ticket follow-up','Ticket waiting resident 3 days','Email + PWA reminder','Ticket owner',true,'2026-10-04T10:00','2026-10-05T10:00','Communications'),
  ('AU-C7','Contractor pass reminder','Pass ends in 24h','Email + SMS to applicant','Pass applicant',true,'2026-10-04T18:00','2026-10-05T18:00','Communications'),
  ('AU-C8','Survey after ticket closure','Ticket resolved','Send feedback survey (PWA + Email)','Ticket owner',true,'2026-10-04T12:00','2026-10-05T12:00','Communications')
  ON CONFLICT (id) DO NOTHING;
END $f$;
SELECT public.seed_comms();