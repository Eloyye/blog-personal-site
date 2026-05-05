const focusItems = [
  {
    description: "Small, static-first web products with low operational drag.",
    title: "Shipping",
  },
  {
    description: "Notes on engineering decisions, tooling, and tradeoffs.",
    title: "Writing",
  },
  {
    description: "Practical architecture for software that stays easy to maintain.",
    title: "Systems",
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
