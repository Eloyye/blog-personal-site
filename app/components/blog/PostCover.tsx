import { getTopicVisual } from "~/components/blog/topic-visuals";
import { getTopic } from "~/lib/content";
import { cn } from "~/lib/utils";

import type { TopicSlug } from "~/lib/content";

type PostCoverProps = {
  cover?: string;
  topic: TopicSlug;
  variant?: "featured" | "grid";
};

const PostCover = ({ cover, topic, variant = "grid" }: PostCoverProps) => {
  const heightClass = variant === "featured" ? "h-52 sm:h-72" : "h-40";

  if (cover) {
    return (
      <div className={cn("overflow-hidden", heightClass)}>
        <img
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading={variant === "featured" ? "eager" : "lazy"}
          src={cover}
        />
      </div>
    );
  }

  const visual = getTopicVisual(topic);

  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden", heightClass, visual.cover)}>
      <span
        className={cn(
          "absolute -bottom-3 right-2 select-none font-heading font-semibold tracking-tight transition-transform duration-300 group-hover:scale-[1.04]",
          variant === "featured" ? "text-8xl sm:text-9xl" : "text-7xl",
          visual.watermark,
        )}
      >
        {getTopic(topic).label}
      </span>
    </div>
  );
};

export { PostCover };
