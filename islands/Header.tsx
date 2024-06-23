import HeroImage from "../components/HeroImage.tsx";
import { Navbar, NavProps } from "../components/Navbar.tsx";
import { AboutSection, ListenSection } from "../components/Section.tsx";

export default function Header() {
  const navProps: NavProps[] = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Episodes",
      url: "/episodes",
    },
    {
      title: "Contact",
      url: "/contact",
    },
  ];

  const heroImageProps = {
    src: "https://placehold.co/3840x3840",
    alt: "A photo of a microphone",
    herf: "/",
  };

  return (
    <header class="bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
      <Navbar links={navProps} />
      <div class="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:px-8 lg:py-12 xl:px-12">
        <HeroImage {...heroImageProps} />
        <div class="mt-10 text-center lg:mt-12 lg:text-left">
          <p class="text-xl font-bold text-slate-900">
            <a href="/">Title placeholder</a>
          </p>
          <p class="mt-3 text-lg font-medium leading-8 text-slate-700">
            Description placeholder
          </p>
        </div>
        <AboutSection />
        <ListenSection />
      </div>
    </header>
  );
}
