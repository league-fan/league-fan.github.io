export interface ArticleProps {
  title: string;
  index: number;
  date: Date;
  description: string;
}

export function Article(props: ArticleProps) {
  return (
    <article
      aria-labelledby={props.title}
      class="py-10 sm:py-12"
    >
      <div class="lg:px-8">
        <div class="lg:max-w-4xl">
          <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <div class="flex flex-col items-start">
              <h2
                id={props.title}
                class="mt-2 text-lg font-bold text-slate-900"
              >
                <a href={`/${props.index}`} class="hover:text">
                  {props.index}: {props.title}
                </a>
              </h2>
              <time
                datetime={props.date.toISOString()}
                class="order-first font-mono text-sm leading-7 text-slate-500"
              >
                {props.date.toDateString()}
              </time>
              <p class="mt-1 text-base leading-7 text-slate-700">
                {props.description}
              </p>
              <div class="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  aria-label={`Play episode ${props.index}: ${props.title}`}
                  class="flex items-center gap-x-3 text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    class="h-2.5 w-2.5 fill-current"
                  >
                    <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z">
                    </path>
                  </svg>
                  <span aria-hidden="true">
                    Listen
                  </span>
                </button>
                <span
                  aria-hidden="true"
                  class="text-sm font-bold text-slate-400"
                >
                  /
                </span>
                <a
                  class="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                  aria-label="Show notes for episode 5: Bill Lumbergh"
                  href="/5"
                >
                  Show notes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
