<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All demo data access goes through server functions in src/lib/demo.functions.ts using the admin client; tables have RLS on with no public policies — keeps keys and data off the browser.
- Demo roles are client-side (localStorage) for evaluation only — production must use real authenticated accounts with server-side role checks.
- The database function public.seed_demo() (core tables) plus public.seed_addon() (add-on modules) public.seed_deploy() (deployment settings) public.seed_comms() (campaigns/providers/preferences) and public.seed_whatsapp() (WhatsApp demo records, run last) are the only seed sources; src/data/seed.json is an exported mirror of it — Reset calls all five in that order. provider_configs holds non-secret metadata only.
- App pages render through one dynamic route (src/routes/app.$page.tsx) with a registry in src/components/pages/index.ts; help text lives in src/lib/help.ts keyed by page.
- SEA-LION (SEA_LION_API_KEY) and Mailtrap (MAILTRAP) are server-only secrets; features fall back to clearly labelled simulation when absent.