import type { TopicSlug } from "~/lib/content";

type TopicVisual = {
  badge: string;
  cover: string;
  watermark: string;
};

const topicVisuals: Record<TopicSlug, TopicVisual> = {
  software: {
    badge:
      "border-teal-600/30 bg-teal-600/10 text-teal-700 transition-colors hover:bg-teal-600/20 dark:text-teal-300",
    cover: "bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400",
    watermark: "text-teal-950/25",
  },
  sports: {
    badge:
      "border-violet-600/30 bg-violet-600/10 text-violet-700 transition-colors hover:bg-violet-600/20 dark:text-violet-300",
    cover: "bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-400",
    watermark: "text-violet-950/25",
  },
  rant: {
    badge:
      "border-orange-600/30 bg-orange-600/10 text-orange-700 transition-colors hover:bg-orange-600/20 dark:text-orange-300",
    cover: "bg-gradient-to-br from-orange-600 via-rose-500 to-pink-400",
    watermark: "text-orange-950/25",
  },
};

export const getTopicVisual = (topic: TopicSlug) => topicVisuals[topic];
