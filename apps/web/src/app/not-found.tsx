import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 min-h-[calc(100vh-400px)]">
      <h1 className="font-bold text-foreground text-6xl animate-bounce">404</h1>
      <p className="text-muted-foreground text-lg animate-fade-in">
        La página que estás buscando no existe.
      </p>
      <Button
        variant="default"
        asChild
        className="hover:scale-105 transition-all animate-fade-in-up duration-200 ease-in-out"
      >
        <Link
          href="/"
          aria-label="Return Home"
        >
          Volver al Home
        </Link>
      </Button>
    </div>
  );
}
