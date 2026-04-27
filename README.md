# RateRack

A store rating web app where users can rate stores from 1 to 5.

## Features

- Admin dashboard – manage users/stores, view total stats, filter/sort listings
- Normal users – signup/login, rate stores, change own rating, search stores by name/address
- Store owners – see their store's average rating and list of users who rated
- Validations: name length (3‑60 chars), password (8‑16 with uppercase+special), email format, address max 400
- Sorting (asc/desc) on tables, filters on name/email/address/role
- PostgreSQL database with unique rating constraint (one rating per user per store but keeps history)
- JWT authentication with role‑based access

Built with Express, React (Vite), and PostgreSQL.