const focusItems = [
  {
    description: "Advanced computer vision systems for automation and analytics",
    title: "Shipping",
  },
  {
    description:
      "Notes on software development and engineering practices, system designs, sports, and rambling",
    title: "Writing",
  },
  {
    description: "AI development workflow's velocity and maintainability",
    title: "Balance",
  },
];

const FocusList = () => (
  <aside className="border-l-2 border-teal-600/30 pl-5">
    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      Focus
    </h2>
    <dl className="mt-5 grid gap-5">
      {focusItems.map((item) => (
        <div key={item.title}>
          <dt className="font-medium">{item.title}</dt>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</dd>
        </div>
      ))}
    </dl>
  </aside>
);

export { FocusList };
