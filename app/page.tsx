import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-gutter desktop:px-gutter-desktop">
        <p className="font-techno text-note text-muted-foreground">
          Home en construcción — los bloques se van montando acá.
        </p>
      </main>
    </>
  );
}
