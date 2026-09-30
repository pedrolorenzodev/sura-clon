"use client";

import Image from "next/image";
import { useState } from "react";

import { SelectPill } from "@/components/sections/select-pill";
import { StarRating } from "@/components/sections/star-rating";
import { gameReviews, starFill, type GameDetail, type GameReview } from "@/lib/data/game-detail";
import { currentUser } from "@/lib/data/user";
import { cn } from "@/lib/utils";

export function GameReviews({ game }: { game: GameDetail }) {
  const [initialReviews] = useState(() => gameReviews(game.id));
  const [reviews, setReviews] = useState(initialReviews);
  const [draft, setDraft] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const text = draft.trim();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text) return;
    setReviews((current) => [
      {
        id: `me-${current.length}`,
        author: currentUser.name,
        avatarSrc: currentUser.avatarSrc,
        time: "Recién",
        rating,
        text,
        likes: 0,
        liked: false,
      },
      ...current,
    ]);
    setDraft("");
    setRating(null);
  };

  const toggleLike = (id: string) =>
    setReviews((current) =>
      current.map((review) =>
        review.id === id
          ? { ...review, liked: !review.liked, likes: review.likes + (review.liked ? -1 : 1) }
          : review,
      ),
    );

  const count = game.reviewsCount + reviews.length - initialReviews.length;

  return (
    <section className="flex flex-col gap-5 rounded-lg bg-surface px-4 pb-6 pt-4 desktop:gap-6">
      <div className="flex flex-col gap-5 desktop:gap-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-1 items-center justify-between gap-6 desktop:flex-none desktop:justify-start">
            <h2 className="font-techno text-base uppercase text-foreground">
              Reseñas <span className="text-muted-foreground">({count})</span>
            </h2>
            <span className="flex items-center gap-2">
              <span className="text-title-sm leading-4 text-muted-foreground">{game.rating.toFixed(1)}</span>
              <StarRating value={game.rating} tone="muted" className="gap-1" starClassName="size-4.5" />
            </span>
          </div>
          <SelectPill label="Todas" className="hidden bg-search-field desktop:flex" />
        </div>

        <form onSubmit={submit} className="flex gap-3 desktop:gap-1 desktop:rounded-lg desktop:bg-search-field desktop:p-4">
          <label className="flex min-w-0 flex-1 flex-col justify-between gap-1 rounded-lg bg-search-field px-4 py-2 desktop:h-19 desktop:bg-transparent desktop:p-0">
            <span className="sr-only">Escribe tu reseña</span>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              placeholder="Escribe tu reseña..."
              className="no-scrollbar min-h-8 w-full flex-1 resize-none bg-transparent py-1.5 text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground desktop:py-0"
            />
            <RatingInput value={rating} onChange={setRating} />
          </label>

          <button
            type="submit"
            disabled={!text}
            aria-label="Publicar reseña"
            data-sfx="click"
            className="flex size-12 shrink-0 cursor-pointer items-center justify-center self-end rounded-pill border border-border-muted/50 bg-border-dim shadow-sp-badge transition-[background-color,border-color,box-shadow,scale] duration-200 hover:bg-surface-2 focus-visible:bg-surface-2 active:scale-95 disabled:cursor-default disabled:border-transparent disabled:bg-surface-3 disabled:shadow-none motion-reduce:transition-none"
          >
            <Image
              src={text ? "/assets/games/detail/send.svg" : "/assets/games/detail/send-disabled.svg"}
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </button>
        </form>
      </div>

      <ul className="flex flex-col desktop:px-3">
        {reviews.map((review, index) => (
          <ReviewItem
            key={review.id}
            review={review}
            last={index === reviews.length - 1}
            onLike={() => toggleLike(review.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function RatingInput({ value, onChange }: { value: number | null; onChange: (value: number | null) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  return (
    <span role="radiogroup" aria-label="Tu puntaje" className="hidden items-center gap-1 desktop:flex" onPointerLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map((stars) => (
        <button
          key={stars}
          type="button"
          role="radio"
          aria-checked={value === stars}
          aria-label={`${stars} de 5`}
          onClick={() => onChange(value === stars ? null : stars)}
          onPointerEnter={() => setHover(stars)}
          className="cursor-pointer transition-transform duration-200 active:scale-90 motion-reduce:transition-none"
        >
          <Image
            src={
              starFill(shown, stars - 1) === "full"
                ? "/assets/games/detail/star-muted.svg"
                : "/assets/games/detail/star-muted-empty.svg"
            }
            alt=""
            width={18}
            height={18}
            className="size-4.5"
          />
        </button>
      ))}
    </span>
  );
}

function ReviewItem({ review, last, onLike }: { review: GameReview; last: boolean; onLike: () => void }) {
  return (
    <li className={cn("flex flex-col gap-3 pb-5 desktop:pb-6", !last && "mb-5 border-b border-foreground/10 desktop:mb-6")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Image src={review.avatarSrc} alt="" width={34} height={34} className="size-8.5 shrink-0 rounded-full object-cover" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm text-foreground">{review.author}</span>
            <span className="truncate text-2xs leading-3.5 text-muted-foreground">{review.time}</span>
          </span>
        </div>
        {review.rating !== null && (
          <StarRating value={review.rating} tone="muted-sm" className="shrink-0 gap-1" starClassName="size-3" />
        )}
      </div>

      <p className="text-mission-copy text-muted-foreground">{review.text}</p>

      <button
        type="button"
        onClick={onLike}
        aria-pressed={review.liked}
        data-sfx="click"
        className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg px-1 text-xs leading-3 text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none"
      >
        <Image
          src={review.liked ? "/assets/games/detail/thumbs-up-filled.svg" : "/assets/games/detail/thumbs-up.svg"}
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
        <span className="font-semibold">{review.likes}</span>
        <span>Me gusta</span>
      </button>
    </li>
  );
}
