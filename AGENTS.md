# Agent Guidelines for Architect System

## Project Overview
Architect System is a multi-role project management tool. It uses Next.js 15 (App Router) with Server Actions for data mutations and standard fetch for data retrieval.

## Coding Standards

### 1. Type Safety
- **No `any`**: Avoid using `any` whenever possible. Define interfaces in `app/lib/` or the component file.
- **Strict Typing**: Use LucideIcon types for icon mappings and specific string union types for statuses (e.g., `TaskStatus`).

### 2. Server Components & Data Fetching
- **Try/Catch Placement**: Avoid wrapping JSX in `try/catch` blocks within Server Components. Fetch data before the `return` statement and handle errors by returning `notFound()` or showing an error message.
- **Authentication**: Always use `getAuthHeaderFromCookies()` from `app/lib/auth.ts` when making API requests from the server side.

### 3. Client Components
- **Directives**: Use `'use client'` at the top of files that utilize hooks like `useState`, `useEffect`, or `useActionState`.
- **Server Actions**: Preferred method for handling forms and mutations. Use `useActionState` or `useTransition` for loading states.

### 4. UI/UX
- **Theming**: Ensure all new components support dark mode by using `dark:` utility classes.
- **Consistency**: Use the `AppShell` component for all authenticated pages to maintain sidebar and header consistency.
- **Toasts**: Use the `useToast` hook for user notifications after actions.

### 5. API Interaction
- **Normalization**: Backend responses may vary in structure. Use normalization helpers in `app/lib/` (e.g., `normalizeTasksResponse`) to safely handle different payload shapes.
- **Base URL**: Use the centralized `API_BASE_URL` defined in the library files.

## Common Tasks

### Adding a New Status
1. Update the status type in `app/lib/tasks.ts` or `app/lib/projects.ts`.
2. Update the color mapping (`STATUS_COLORS`) and icon mapping (`STATUS_ICONS`) in the relevant Client Component.
3. Update the transition rules if applicable.

### Creating a New Page
1. Create the directory in `app/`.
2. Implement the Server Component (`page.tsx`) for data fetching.
3. Implement a Client Component (e.g., `MyFeatureClient.tsx`) for interactive elements.
4. Add the link to `app/components/Sidebar.tsx` based on user roles.

## Quality Assurance
- Run `npm run lint` before submitting changes.
- Ensure `npm run build` succeeds.
