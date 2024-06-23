import Headline from "../components/Headline.tsx";
import { Article, ArticleProps } from "../components/Article.tsx";
import ColorBar from "../components/svg/ColorBar.tsx";

const episodes: ArticleProps[] = [
  {
    title: "Bill Lumbergh",
    index: 5,
    date: new Date("2022-02-24"),
    description:
      "He’s going to need you to go ahead and come in on Saturday, but there’s a lot more to the story than you think.",
  },
  {
    title: "Shooter McGavin",
    index: 4,
    date: new Date("2022-02-17"),
    description:
      "When golf-obsessed terroristskidnapped his family and heldthem hostage in exchange for aGolden Jacket, Shooter had nochoice but to win the tour atany cost.",
  },
  {
    title: "The Wet Bandits",
    index: 3,
    date: new Date("2022-02-10"),
    description:
      "The Christmas of 1989 wasn’t the first time Harry and Marvcrossed paths with theMcCallisters. The real storystarts in 1973, when Petertripped Marv in the highschoollocker room.",
  },
  {
    title: "Hank Scorpio",
    index: 2,
    date: new Date("2022-02-03"),
    description:
      "What looks to outsiders like amalicious plan to conquer theeast coast, was actually a storyof liberation and freedom if youget it straight from the source.",
  },
  {
    title: "Skeletor",
    index: 1,
    date: new Date("2022-01-27"),
    description:
      "You know him as an evil supervillain, but his closest friends call him Jeff, and he's just doing his best to find his way in a world that doesn't know what to do with a talking skeleton.",
  },
];
export default function Episodes() {
  return (
    <main class="border-t border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
      <ColorBar />
      <div class="relative">
        <div class="pb-12 pt-16 sm:pb-4 lg:pt-12">
          <Headline title="Episodes" />
          <div class="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
            {episodes.map((episode) => <Article {...episode} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
