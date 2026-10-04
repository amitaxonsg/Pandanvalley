CREATE OR REPLACE FUNCTION public.seed_whatsapp() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $f$
BEGIN
  INSERT INTO campaigns VALUES
  ('CP-007','Gas leak drill — emergency alert','Emergency Notice','[Pandan Valley] Emergency Notice — Gas leak drill','Emergency','All Residents','PWA,Email,WhatsApp,SMS','2026-09-25T10:00','2026-09-26','Emergency drill at Block B on 26 Sep 10am. Follow Security instructions.',null,null,null,true,'Axon 1Pro Smart Estate Management','emergency,drill','Sent','Condo Manager (Demo)','Condo Manager (Demo)','Approved','2026-09-24T16:00','estate_emergency_v1','en',30,27,0,0,0,3),
  ('CP-008','Pool reopening (WhatsApp)','Announcement','Pool reopens Saturday','Facilities','Communication opt-in only','PWA,WhatsApp','2026-10-03T09:00','2026-10-10','The swimming pool reopens Sat 4 Oct after maintenance.',null,'View notice','https://sems.axon.com.sg/app/inbox',false,'Axon 1Pro Smart Estate Management','facilities','Sent','MA Executive (Demo)','Condo Manager (Demo)','Approved','2026-10-02T14:00','estate_update_v2','en',12,10,7,2,0,2)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO campaign_deliveries VALUES
  ('CD-W01','CP-007','WhatsApp','+65 9***1203','#03-07','Simulated','2026-09-25T10:00','Simulated — WhatsApp provider not configured'),
  ('CD-W02','CP-007','WhatsApp','+65 9***5521','#05-12','Simulated','2026-09-25T10:00','Simulated — template estate_emergency_v1'),
  ('CD-W03','CP-007','WhatsApp','+65 9***8830','#02-03','Failed','2026-09-25T10:01','Simulated failure — number not on WhatsApp'),
  ('CD-W04','CP-008','WhatsApp','+65 9***4410','#07-01','Read','2026-10-03T09:20','Demo analytics'),
  ('CD-W05','CP-008','WhatsApp','+65 9***7702','#04-09','Failed','2026-10-03T09:01','Simulated failure — template variable mismatch'),
  ('CD-W06','CP-008','PWA','#05-12','#05-12','Delivered','2026-10-03T09:00','Portal notification')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO webhook_events VALUES ('WH-004','Meta WhatsApp Cloud API (example)','message.status failed (simulated)','2026-10-03T09:01','{"campaign":"CP-008","reason":"template variable mismatch"}') ON CONFLICT (id) DO NOTHING;
  UPDATE automations SET action_desc = action_desc || ' · WhatsApp (if provider configured)' WHERE id IN ('AU-C3','AU-C5','AU-C7') AND action_desc NOT LIKE '%WhatsApp%';
END $f$;
SELECT public.seed_whatsapp();