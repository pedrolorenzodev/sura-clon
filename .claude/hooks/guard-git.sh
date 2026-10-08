#!/bin/bash
INPUT=$(cat)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')
[ -z "$COMMAND" ] && exit 0

block() {
  echo "BLOCKED by .claude/hooks/guard-git.sh: $1" >&2
  exit 2
}

SCAN=$(printf '%s' "$COMMAND" | sed -E 's/git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+stash[[:space:]]+(list|show)//g')

GIT='(^|[^A-Za-z0-9_.-])git'
OPTS='([[:space:]]+(-C[[:space:]]+[^[:space:]]+|-c[[:space:]]+[^[:space:]]+|--git-dir(=|[[:space:]]+)[^[:space:]]+|--work-tree(=|[[:space:]]+)[^[:space:]]+|--namespace(=|[[:space:]]+)[^[:space:]]+|--no-pager|-P|--bare|--literal-pathspecs))*'
WRITES='(commit|push|merge|rebase|reset|tag|stash|cherry-pick|revert|am|apply|clean|worktree|checkout|switch|restore|rm|mv|filter-branch|filter-repo|update-ref|update-index|replace|gc|prune|notes|reflog|branch[[:space:]]+(-[a-zA-Z]*[dDmMcCf]|--delete|--move|--copy|--force)|config)'

if printf '%s' "$SCAN" | grep -qE "${GIT}${OPTS}[[:space:]]+${WRITES}([^A-Za-z0-9_-]|$)"; then
  block "this git command writes history, the index or the working tree. AGENTS.md rule 1: the agent never commits, pushes, merges, rebases, resets, tags, stashes, checks out, restores or switches branches, even if the user asks. Hand the commit message to the user; they run it in their own terminal. Allowed: git status, diff, log, show, stash list."
fi

if printf '%s' "$SCAN" | grep -qE "${GIT}[^|;&]*[[:space:]]-c[[:space:]]*alias\.|alias\.[A-Za-z0-9_-]+="; then
  block "git aliases are not allowed (they can hide a commit). AGENTS.md rule 1."
fi

if printf '%s' "$COMMAND" | grep -qE '(^|[^A-Za-z0-9_-])(npx|pnpm|pnpx|bunx|yarn)[[:space:]]+(dlx[[:space:]]+)?shadcn(@[^[:space:]]+)?[[:space:]]+(add|init|apply)|(^|[^A-Za-z0-9_-])gh[[:space:]]+pr[[:space:]]+merge|(^|[^A-Za-z0-9_-])vercel[[:space:]].*--prod'; then
  block "this would rewrite frozen UI primitives, merge a PR or deploy to production. AGENTS.md rules 1 and 2. Ask the user."
fi

exit 0
