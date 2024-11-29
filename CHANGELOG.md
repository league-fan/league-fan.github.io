# Changelog

This project([League-fan](https://github.com/league-fan/league-fan.github.io)) are planned to be _REFACTORING_ and _REDESIGNING_.

Basically, the initial source are forked from [lol-skin-explorer](https://github.com/preyneyv/lol-skin-explorer). 

Special thanks to [@preyneyv](https://github.com/preyneyv) for the excellent work.


## Keep a changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.0.4 (2024-11-30)

### Feat

- refactor App router structure for improved SSR and SSG optimization
- refactor i18n settings and initialization to use object destructuring for improved clarity
- add loading skeleton component and integrate patch handling in skinlines, champions, and universes pages
- rename getRarityOfSkin to getRarityUrl for clarity and update skin link handling in various components
- enhance skin handling by fetching skinlines, skins, champions, and universes in the skins page and improve key assignment in SkinFromSkinline component
- implement SkinFromChampion and SkinFromSkinline components with sorting functionality and enhance SkinGrid for better skin handling
- update link generation in SkinlinePage and NewAdditions components for improved URL structure and error handling
- implement NotFound component and enhance SkinIdPage for better error handling
- enhance SkinIdPage to handle missing parameters and improve skin retrieval logic
- update SkinIdPage and SkinGridPage to handle missing search parameters and improve redirects
- TODO refactor skin page structure and implement SkinIdPage component
- add common skin page
- implement static parameter generation for skinline pages
- add skinlines/skinlineId
- add universes
- add skinlines
- enhance champions sorting functionality and update redirect logic

### Fix

- Popup linkTo
- NewAdditions linkTo
- SkinViewer linkTo
- update link generation for champion skins and add sass options to config
- skin viewer layout
- layout component lang type error

### Refactor

- layout components to use Common layout and improve parameter handling in champions, skinlines, and universes pages
- move to ssr
- use common skin router
- remove layout components and integrate Entry in page components
- update sorting options in champions component to sort by ID

## 0.0.3 (2024-11-27)

### Feat

- add MDX support and enhance layout structure with new components
- refactor language handling in champion pages and remove unused static params
- enhance internationalization support with language selection and routing updates
- update internationalization setup with new language constants and redirect logic
- enhance internationalization support with dynamic language handling and remove deprecated second page
- implement internationalization support with language detection and routing
- remove unused layout component and associated imports

## 0.0.2 (2024-11-22)

### Feat

- update champion links to use aliases instead of keys and adjust logo import path
- remove unnecessary redirects from next.config.ts, add unoptimized prop to images in header and skin viewer, and implement a new root page for redirection
- update champion and skin static parameters to use champion aliases instead of names
- update configuration and enhance language support, refactor imports, and implement static parameter generation for champions and skins
- remove unused constants, contexts, and components from data directory
- refactor skin page structure, implement SkinPage component, and enhance skin context usage
- migrate PropsContext to data directory, add skin loading and layout components, and implement skin context provider
- update champion page structure, add champion icon component, and enhance rarity handling
- restructure champions components, remove deprecated files, and implement new layout and loading structures
- refactor loading components, rename Loading to LoadingSkeleton, and create a new loading wrapper for champions
- implement ChampionPage component, refactor layout structure, and update PropsContext usage
- migrate to legacy image component, add objectFit prop, and update usage in NewAdditions
- add Champions layout and list components, update PropsContext usage, and enhance layout structure
- restructure routing and layout components, remove deprecated files, and implement new PropsContext
- migrate image imports to legacy version for compatibility
- refactor component structure to remove unnecessary anchor tags and improve layout consistency
- replace Index component with IndexLayout, refactor page structure, and update navigation handling
- add champions list and index components, refactor navigation handling, and update styles
- refactor champion page handling, implement new helper functions, and update context usage
- migrate data handling to new structure, update imports, and remove deprecated files
- refactor language handling, add ClientPage component, and improve layout structure
- add language support, refactor data handling, and enhance page structure
- refactor champion data handling, integrate store for champions and skins, and enhance error handling
- add champion role conversion and display champion details in textarea
- add simple example
- remove unused assets
- remove unused CSS file, refactor page component, and enhance layout structure
- update import paths to use absolute imports, enhance fallback component, and add global styles
- add loading component and changes type, update navigation and patch handling
- add new types and components for skin additions
- add scrape
- remove tailwindcss

## 0.0.1 (2024-11-14)

### Init

- new nextjs project