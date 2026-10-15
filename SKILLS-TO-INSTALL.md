# Claude Code design skills (run these yourself in PowerShell)

Taste Skill (Leonxlnx, MIT per listing sites): premium, "anti-generic" frontend design
    npx skills add https://github.com/Leonxlnx/taste-skill --skill "taste-skill"
    npx skills add https://github.com/Leonxlnx/taste-skill --skill "soft-skill"

Impeccable (pbakaus): commands for polishing and critiquing UI. See https://github.com/pbakaus/impeccable
UI/UX Pro Max (nextlevelbuilder, MIT): design-system database
    /plugin install ui-ux-pro-max@ui-ux-pro-max-skill   (inside Claude Code)
Anthropic frontend-design (official)
    claude plugin add anthropic/frontend-design

The installer may put skills in ~\.agents\skills. Claude Code reads ~\.claude\skills, so copy them across:
    Copy-Item -Recurse $env:USERPROFILE\.agents\skills\taste-skill $env:USERPROFILE\.claude\skills\
Read each SKILL.md before trusting it: skills run with your agent's permissions.
