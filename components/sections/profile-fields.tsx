"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";

import { UserAvatar } from "@/components/layout/user-avatar";
import { BrandCta } from "@/components/sections/brand-cta";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { profileCountries, profileFields, type ProfileField } from "@/lib/data/profile";
import { currentUser } from "@/lib/data/user";
import { cleanValue, formatBirthDate, validateProfileValue } from "@/lib/profile-validation";
import { playSfx } from "@/lib/sfx";
import { claimReward } from "@/lib/use-daily-claim";
import { setProfileValue, useProfileValues } from "@/lib/use-profile-fields";
import { cn } from "@/lib/utils";

const fieldRewardId = (field: ProfileField) => `profile:${field.id}`;

export function ProfileFields({ className }: { className?: string }) {
  const values = useProfileValues();
  const [editing, setEditing] = useState<string | null>(null);
  const [earned, setEarned] = useState<{ id: string; key: number } | null>(null);
  const rows = useRef(new Map<string, HTMLButtonElement>());

  const close = (id: string) => {
    setEditing(null);
    requestAnimationFrame(() => rows.current.get(id)?.focus());
  };

  const save = (field: ProfileField, value: string) => {
    const firstTime = !field.done && values[field.id] === undefined;
    setProfileValue(field.id, value);
    if (firstTime && field.rewardPoints) {
      claimReward(fieldRewardId(field), field.rewardPoints);
      setEarned((current) => ({ id: field.id, key: (current?.key ?? 0) + 1 }));
    }
    playSfx(firstTime && field.rewardPoints ? "claim" : "click");
    close(field.id);
  };

  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {profileFields.map((field) => {
        const value = values[field.id] ?? field.value;
        const done = Boolean(field.done || values[field.id] !== undefined);

        return (
          <li key={field.id}>
            {editing === field.id ? (
              <FieldEditor field={field} initial={value ?? ""} onSave={(next) => save(field, next)} onCancel={() => close(field.id)} />
            ) : (
              <FieldRow
                field={field}
                value={value}
                done={done}
                earnedKey={earned?.id === field.id ? earned.key : null}
                onEarnedEnd={() => setEarned(null)}
                rowRef={(el) => {
                  if (el) rows.current.set(field.id, el);
                  else rows.current.delete(field.id);
                }}
                onEdit={() => setEditing(field.id)}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function FieldRow({
  field,
  value,
  done,
  earnedKey,
  onEarnedEnd,
  rowRef,
  onEdit,
}: {
  field: ProfileField;
  value?: string;
  done: boolean;
  earnedKey: number | null;
  onEarnedEnd: () => void;
  rowRef: (el: HTMLButtonElement | null) => void;
  onEdit: () => void;
}) {
  const editable = Boolean(field.input);
  const text = value ? `${field.label}: ${value}` : field.label;

  return (
    <div
      className={cn(
        "group/row relative flex h-16 items-center justify-between gap-3 rounded-lg px-4 text-base text-foreground ring-1 ring-inset transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none",
        done ? "bg-sp-foreground ring-brand" : "ring-border-dim",
        editable && !done && "has-[>button:hover]:ring-muted-foreground",
        editable && "has-[>button:focus-visible]:ring-2",
        editable && (done ? "has-[>button:focus-visible]:ring-brand-vivid" : "has-[>button:focus-visible]:ring-subtle-foreground"),
      )}
    >
      {editable && (
        <button
          ref={rowRef}
          type="button"
          onClick={onEdit}
          aria-label={done ? `Editar ${field.label.toLowerCase()}` : `Completar ${field.label.toLowerCase()}`}
          data-sfx-hover="soft"
          data-sfx="click"
          className="absolute inset-0 z-10 cursor-pointer rounded-lg outline-none"
        />
      )}

      <span className="pointer-events-none relative z-20 flex min-w-0 items-center gap-2">
        {field.showAvatar && <UserAvatar src={currentUser.avatarSrc} size={24} ringClassName="" className="size-6" />}
        <span className="truncate">{text}</span>
        {field.info && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={`Más información sobre ${field.label}`}
                  className="pointer-events-auto flex size-4 shrink-0 cursor-help"
                />
              }
            >
              <Image src="/assets/profile/info.svg" alt="" width={16} height={16} className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8} className="whitespace-normal">
              {field.info}
            </TooltipContent>
          </Tooltip>
        )}
      </span>

      <span className="pointer-events-none relative z-20 flex shrink-0 items-center gap-2.5">
        {done && editable && (
          <Pencil
            aria-hidden
            className="size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-has-[>button:hover]/row:opacity-100 group-has-[>button:focus-visible]/row:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none"
          />
        )}
        {done ? (
          <Image src="/assets/profile/check.svg" alt="Completado" width={16} height={16} className="size-4" />
        ) : (
          field.rewardPoints && (
            <span className="flex items-center gap-0.5 rounded-lg bg-sp-foreground px-1.5 py-1 font-techno text-xs leading-4 text-brand ring-1 ring-inset ring-brand">
              +{field.rewardPoints}
              <Image src="/assets/home/sp-coin.webp" alt="" width={59} height={59} className="size-4" />
            </span>
          )
        )}
      </span>

      {earnedKey !== null && field.rewardPoints && (
        <span
          key={earnedKey}
          aria-hidden
          onAnimationEnd={onEarnedEnd}
          className="reward-pop pointer-events-none absolute -top-2 right-4 z-30 font-techno text-sm text-brand-vivid"
        >
          +{field.rewardPoints}
        </span>
      )}
    </div>
  );
}

function FieldEditor({
  field,
  initial,
  onSave,
  onCancel,
}: {
  field: ProfileField;
  initial: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const input = field.input!;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = input === "date" ? draft : cleanValue(draft);
    const problem = validateProfileValue(input, value);
    if (problem) {
      setError(problem);
      playSfx("deny");
      return;
    }
    onSave(value);
  };

  const change = (next: string) => {
    setDraft(input === "date" ? formatBirthDate(next, draft) : next);
    if (error) setError(null);
  };

  return (
    <form
      onSubmit={submit}
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel();
      }}
      noValidate
      className="flex flex-col gap-2.5 rounded-lg bg-surface px-4 py-3 ring-1 ring-inset ring-brand-vivid"
    >
      <label htmlFor={`${id}-input`} className="text-xs text-muted-foreground">
        {field.label}
      </label>
      <input
        id={`${id}-input`}
        autoFocus
        value={draft}
        onChange={(event) => change(event.target.value)}
        type={input === "email" ? "email" : "text"}
        inputMode={input === "date" ? "numeric" : input === "email" ? "email" : "text"}
        maxLength={input === "date" ? 10 : 60}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        list={input === "country" ? `${id}-countries` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-10 rounded-lg bg-search-field px-3 text-base text-foreground outline-none ring-1 ring-inset transition-shadow duration-200 placeholder:text-muted-foreground motion-reduce:transition-none",
          error ? "ring-danger" : "ring-border-dim focus:ring-subtle-foreground",
        )}
      />
      {input === "country" && (
        <datalist id={`${id}-countries`}>
          {profileCountries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          data-sfx="click"
          className="flex h-9 cursor-pointer items-center rounded-pill border border-border-dim px-4 text-sm text-subtle-foreground transition-colors duration-200 hover:border-brand/50 hover:text-brand focus-visible:border-brand/50 focus-visible:text-brand motion-reduce:transition-none"
        >
          Cancelar
        </button>
        <BrandCta type="submit" label="Guardar" data-sfx={undefined} className="flex h-9 px-4" labelClassName="text-xs" />
      </div>
    </form>
  );
}
