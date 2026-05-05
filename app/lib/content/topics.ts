export const topics = {
  software: { label: "Software", description: "Engineering notes and systems work." },
  sports: { label: "Sports", description: "Sports writing and observations." },
  rant: { label: "Rant", description: "Looser notes and opinionated posts." },
} as const;

export type TopicSlug = keyof typeof topics;

export const isTopicSlug = (value: unknown): value is TopicSlug =>
  typeof value === "string" && value in topics;

export const getTopic = (topic: TopicSlug) => topics[topic];
