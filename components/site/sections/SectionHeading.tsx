type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
};

export function SectionHeading({ id, eyebrow, title, intro, tone = "light", align = "start" }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow mb-4 ${dark ? "text-verde-400" : "text-verde-700"}`}>{eyebrow}</p>}
      <h2 id={id} className={`text-3xl sm:text-[2.75rem] sm:leading-[1.05] ${dark ? "text-white" : "text-carbon"}`}>
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 whitespace-pre-line text-lg ${dark ? "text-neutral-300" : "text-gris"}`}>{intro}</p>
      )}
    </div>
  );
}
