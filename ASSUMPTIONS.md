# UI Behaviour Assumptions & Design Decisions

## Search Behaviour

- **City is required; Country is optional.**
  A search can be submitted with only a city name. Adding a country code (ISO 3166-1 alpha-2, e.g. `MY`, `JP`) narrows the result and avoids ambiguity for cities that exist in multiple countries.

- **Country input auto-uppercases.**
  The country field automatically converts typed characters to uppercase so users don't need to worry about case sensitivity.

- **Each search creates a new history record.**
  Repeated searches for the same city are each saved individually, preserving an accurate chronological log of all searches.

- **History is global (not per-session).**
  Search history is persisted in a database and is shared across all browser sessions. This matches the mockup, which shows a single numbered list without any user identity.

- **History is sorted newest-first.**
  The most recently searched city always appears at the top (position 1).

## Clear Button

- Clears the City and Country input fields and resets the weather display area to its empty state.
- Does **not** clear the search history list.

## Re-search from History

- Clicking the magnifying-glass icon on a history entry:
  1. Pre-fills the City and Country inputs with that entry's values.
  2. Immediately triggers a new API call (live weather is fetched again, not cached).
  3. Adds a new record to the top of the history list.

## Delete from History

- Uses an **optimistic update**: the record disappears from the UI immediately for a snappy feel, and the DELETE request is sent in the background.
  If the request fails the list is re-fetched to restore accurate state.

## Error Handling

| Scenario | UI Message |
|---|---|
| City/country not found by OpenWeatherMap | "Not found" banner below the search bar |
| Network or server error | "Something went wrong. Please try again." banner |
| Empty history list | "No Record" placeholder inside the history section |

## Temperature

- Temperatures are displayed in **Celsius** using OpenWeatherMap's `units=metric` parameter.
  The mockup shows values like `303.15°C ~ 306.15°C`, which appear to be raw Kelvin values incorrectly labelled; this implementation uses properly converted Celsius values.

## Time Zone

- All timestamps in the weather card and search history are displayed in **Singapore Time (SGT, UTC+8)**.
  The backend converts the UTC `dt` value from OpenWeatherMap to SGT before sending it to the frontend, formatted as `YYYY-MM-DD HH:MM AM/PM`.

## Database

- **MongoDB Atlas** is used for data persistence. It is a fully managed cloud database that requires no self-hosted infrastructure, scales easily, and integrates naturally with Python via the async Motor driver.
- Search history documents are stored in the `search_history` collection, indexed on `searched_at` for efficient newest-first sorting.
- For local development the `MONGODB_URL` in `.env` can point to a local MongoDB instance or an Atlas free-tier cluster.

## Tech Stack Choices

| Decision | Choice | Reason |
|---|---|---|
| Frontend framework | Next.js 15 (App Router) | Satisfies the React requirement; built-in server-side proxy route handlers simplify backend communication |
| Backend framework | FastAPI | Async-native, excellent DX, auto-generates OpenAPI docs at `/docs` |
| Database | MongoDB Atlas + Motor | Managed cloud database; Motor provides async I/O that fits naturally with FastAPI's async model |
| Styling | Tailwind CSS | Rapid, utility-first styling; responsive by default |
| API proxy | Next.js route handler (`/api/[...slug]`) | Reads `BACKEND_URL` at runtime, making Docker networking work without rebuilding the image |

## Responsive Design

- The card layout is centred and constrained to `max-w-2xl` on wide screens.
- The search form wraps gracefully on small screens using `flex-wrap`.
- Font sizes and spacing use Tailwind's default scale, which is tested across common breakpoints.
