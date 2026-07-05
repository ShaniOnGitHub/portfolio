import { Link } from "@tanstack/react-router";

export function Currently() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <p className="kicker">: currently</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
        Final-year Software Engineering student at SZABIST Islamabad.
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Building SmartExam, an AI-assisted online exam proctoring platform: owning the Student
        Portal and Notifications modules.
      </p>
      <Link
        to="/work"
        className="mono mt-6 inline-flex text-sm text-ember hover:opacity-80"
      >
        See the full path ↗
      </Link>
    </section>
  );
}
