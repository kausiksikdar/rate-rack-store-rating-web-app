# RateRack

## What it does

RateRack allows users to discover stores, rate them (1–5 stars), and see overall ratings. Admins manage everything, and store owners track their store’s performance. The app uses JWT authentication and role‑based access to separate normal users, admins, and store owners.

## Features

- **Admin dashboard** – Manage users (normal, admin, store owners) and stores. View total users, stores, and ratings at a glance. Filter and sort listings by name, email, address, or role. Add new users or stores directly.

- **Normal users** – Sign up and log in with validation on name, email, and password. Rate any store (1‑5) and modify their rating later. Search stores by name or address. See overall store rating and their own rating.

- **Store owners** – Log in to a dashboard showing the average rating of their store. View a list of all users who have rated their store, along with each user’s average rating (if multiple submissions).

- **Form validations** – Name: 3‑60 characters (adjustable to spec). Password: 8‑16 characters, at least one uppercase and one special character. Email: standard format. Address: max 400 characters.

- **Sorting & filtering** – All tables (stores, users) support ascending/descending sorting on key fields like name and email. Filters work on name, email, address, and role (for users).

- **Database design** – PostgreSQL with constraints: rating between 1‑5, unique (user, store) to prevent duplicates while keeping full rating history. Indexes on filtered columns for performance.

- **Authentication & roles** – JWT tokens, middleware checks. Public routes for login/register; protected routes for admin, user, and store owner. Logout clears token.

Built with Express, React (Vite), PostgreSQL (Neon), and Sequelize ORM.