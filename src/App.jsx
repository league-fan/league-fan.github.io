import { useEffect } from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ProgressBar from "./components/ProgressBar.jsx";
import AssetBrowserPage from "./views/AssetBrowserPage.jsx";
import License from "./views/License.jsx";
import NotFound from "./views/NotFound.jsx";
import { GALLERIES, SITE_TITLE } from "./routes.js";

const TITLES = {
  ...Object.fromEntries(GALLERIES.map((g) => [g.path, g.title])),
  "/license": "License",
};

function Header() {
  return (
    <header className="relative z-50 flex-none border-b border-ink-700/80 bg-ink-900/80 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600 font-bold text-ink-950 shadow-[0_0_14px_-2px_var(--color-gold-500)] transition group-hover:shadow-[0_0_18px_0_var(--color-gold-500)]"
          >
            LF
          </span>
          <span className="text-base font-semibold tracking-tight text-gold-300">
            League&nbsp;Fan
          </span>
        </NavLink>

        <nav aria-label="Asset categories">
          <ul className="flex flex-wrap items-center gap-1">
            {GALLERIES.map((g) => (
              <li key={g.path}>
                <NavLink
                  to={g.path}
                  end={g.path === "/"}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-1.5 text-[0.82rem] font-medium transition ${
                      isActive
                        ? "bg-gold-500/15 text-gold-300 shadow-[inset_0_0_0_1px_var(--color-gold-600)]"
                        : "text-muted hover:bg-ink-800 hover:text-parchment"
                    }`
                  }
                >
                  {g.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const link =
    "text-muted underline decoration-ink-600 underline-offset-2 transition hover:text-teal-500 hover:decoration-teal-500/50";
  return (
    <footer className="z-50 flex-none border-t border-ink-700/80 bg-ink-900/80 px-4 py-2 text-[0.72rem] text-muted backdrop-blur-md">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>
          Data via{" "}
          <a
            href="https://github.com/league-fan/league-fan-assets"
            target="_blank"
            rel="noopener"
            className={link}
          >
            @magicwenli/league-fan-assets
          </a>
        </span>
        <span aria-hidden="true" className="text-ink-600">
          ·
        </span>
        <span>
          CDN{" "}
          <a
            href="https://communitydragon.org"
            target="_blank"
            rel="noopener"
            className={link}
          >
            CommunityDragon
          </a>
        </span>
        <span aria-hidden="true" className="text-ink-600">
          ·
        </span>
        <a
          href="https://github.com/league-fan/league-fan.github.io/"
          target="_blank"
          rel="noopener"
          className={link}
        >
          GitHub
        </a>
        <span aria-hidden="true" className="text-ink-600">
          ·
        </span>
        <NavLink to="/license" className={link}>
          License
        </NavLink>
      </p>
    </footer>
  );
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = TITLES[pathname];
    document.title = title ? `${SITE_TITLE} | ${title}` : SITE_TITLE;
  }, [pathname]);

  return (
    <div className="relative isolate flex h-dvh max-h-dvh flex-col overflow-hidden">
      <ProgressBar />
      <Header />

      <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <Routes>
          {GALLERIES.map((g) => (
            <Route
              key={g.storeKey}
              path={g.path}
              // key on storeKey: remount resets filters/paging between galleries
              element={<AssetBrowserPage key={g.storeKey} gallery={g} />}
            />
          ))}
          <Route path="/license" element={<License />} />
          <Route path="/summoner-skins" element={<Navigate to="/skins" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
