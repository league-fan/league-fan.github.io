import { ComponentChildren, JSX } from "preact";
import IoLogoRss from "react-icons/io5/IoLogoRss.ts";

interface SectionProps {
  title: string;
  colorPrimary?: string;
  colorSecondary?: string;
  children: ComponentChildren;
}

export function Section(props: SectionProps) {
  console.log(props.title.toLowerCase());
  const colorPrimary = props.colorPrimary ?? "fill-violet-300";
  const colorSecondary = props.colorSecondary ?? "fill-pink-300";

  return (
    <section class="mt-12 hidden lg:block">
      <h2 class="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          class="h-2.5 w-2.5"
        >
          <path
            d="M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z"
            class={colorPrimary}
          >
          </path>
          <path
            d="M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z"
            class={colorSecondary}
          >
          </path>
        </svg>
        <span class="ml-2.5">{props.title}</span>
      </h2>
      {props.children}
    </section>
  );
}

export function IconItem(props: { children: JSX.Element; name: string }) {
  return (
    <li class="flex">
      <a
        class="group flex items-center"
        aria-label={props.name}
        href="/"
      >
        {props.children}
        <span class="hidden sm:ml-3 sm:block">
          {props.name}
        </span>
      </a>
    </li>
  );
}

export function AboutSection() {
  return (
    <Section
      title="About"
      colorPrimary="fill-violet-300"
      colorSecondary="fill-pink-300"
    >
      <p class="mt-2 text-base leading-7 text-slate-700 lg:line-clamp-4">
        In this show, Eric and Wes dig deep to get to the facts with guests who
        have been labeled villains by a society quick to judge, without actually
        getting the full story. Tune in every Thursday to get to the truth with
        another misunderstood outcast as they share the missing context in their
        tragic tale.
      </p>
      <button
        type="button"
        class="mt-2 hidden text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900 lg:inline-block"
      >
        Show more
      </button>
    </Section>
  );
}

export function ListenSection() {
  return (
    <Section
      title="Listen"
      colorPrimary="fill-navy-300"
      colorSecondary="fill-blue-300"
    >
      <div class="h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden">
      </div>
      <ul
        role="list"
        class="mt-4 flex justify-center gap-10 text-base font-medium leading-7 text-slate-700 sm:gap-8 lg:flex-col lg:gap-4"
      >
        <IconItem name="RSS">
          <IoLogoRss class="fill-violet-300" />
        </IconItem>
      </ul>
    </Section>
  );
}
