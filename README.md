# Peruanistas

Web project for Peruanistas, the citizen participation platform.

![The Peruanistas feed: "El damero"](./static/design.png)

## Project structure

The views and functionality is divided into features.

A feature folder can contain the following:

```txt
src/features/[name]/
├── pages:      Pages to be mounted in the main router
├── components: Reusable components
├── styles:     Reusable css/scss style sheets
├── hooks:      Reusable custom hooks
├── utils:      Reusable utility functions
├── store:      Zustand stores
└── types:      Type definitions
```

And more folders can be added as needed.

Currently we maintain the following features (with more to be added):

```txt
src/features/common: Code shared by multiple features
src/features/events: Citizen events
src/features/home: The peruanistas main page (damero)
src/features/news: Citizen and external news
```

## Getting Started

```sh
# Install dependencies
npm install
# Run the development server
npm run dev
```
