# SpotEm

SpotEm is a browser-based hidden-object game inspired by Where's Waldo created for [The Odin Project](https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app).  
Players must locate several hidden targets inside a large image as quickly as possible.  
Completion times are stored and displayed on a leaderboard for each level.

**Live Client:** https://spotem.up.railway.app  
**API Server:** https://spotem-server.up.railway.app

![site preview](https://github.com/veles-rgb/SpotEm/blob/main/client/public/preview.png)

## Features

- Multiple hidden-object levels
- Click detection using percentage-based coordinates
- Server-validated timer to reduce cheating
- Leaderboards storing fastest completion times
- PostgreSQL database using Prisma ORM
- React frontend
- Express backend API
- Deployed using Railway

## Tech Stack

### Frontend

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Backend

- [Node.js](https://nodejs.org/en/docs)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Deployment

- [Railway Docs](https://docs.railway.app/)

### Other Libraries

- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Node.js crypto module](https://nodejs.org/api/crypto.html)

## How the Game Works

Each level contains:

- A main image
- Multiple hidden targets
- Target coordinate bounds stored in the database

When the player clicks the image:

1. The click position is converted into percentage coordinates relative to the image.
2. The system checks if the click falls inside any target bounding box.
3. When all targets are found, the run ends.
4. The server calculates the completion time and stores it if submitted to the leaderboard.

## Sources

### Images

- Level 1 - Netflix Characters by [relevantmagazine](https://relevantmagazine.com/culture/heres-wheres-waldo-style-game-featuring-nothing-netflix-characters/)
- Level 2 - Shakespeare in the Park by [David Regone](https://www.reddit.com/user/RegoneStudios/)
- Level 3 - Brian Multiplied by [\_emiru](https://www.reddit.com/user/_emiru/)
