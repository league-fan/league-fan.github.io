# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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