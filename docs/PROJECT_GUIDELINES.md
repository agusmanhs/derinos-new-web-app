# Derinos Group - Project Guidelines & Architecture

## Development Philosophy
- Clean Architecture
- Modular, Maintainable, Scalable, Type-safe
- Reusable components
- Separation of concerns, DRY
- Secure by default, Performance oriented
- Scalable from 5 to 50+ projects and thousands of units.

## Code Quality
- Type-safe, Reusable, Properly structured
- Easy to test and modify
- Properly validated (handle loading, error, empty states)
- NO hardcoded data for db entities, duplicate logic, complex inline logic, magic numbers, or placeholder implementations in production.

## Responsive Design
- Desktop: 1440px, 1280px, 1024px
- Tablet: 768px
- Mobile: 390px, 375px
- Admin dashboard must be usable on tablet/mobile.

## Performance
- Fast initial load, Optimized images, Lazy loading
- Code splitting, Efficient rendering, Proper caching, Pagination for large datasets.

## Security
- Auth & Authorization (Role-based access control)
- Input validation (Server-side & Client-side)
- Secure API, Protected admin routes, Proper error handling.
- Environment variables for secrets.

## Database Design
- Scalable schema with clear foreign keys and migrations.
- Core Entities: User, Role, Permission, Project, ProjectImage, ProjectFacility, ProjectLocation, PropertyType, PropertyUnit, ConstructionPhase, ConstructionUpdate, ConstructionPhoto, Lead, LeadActivity, Customer, Booking, SalesAgent, Sale, Media, Content, SiteSettings.

## UI/UX Rules
- **Design is the source of truth.** Strictly follow Google Stitch designs (Layout, Spacing, Typography, Color, Border radius, Button style, Card style, Navigation, Visual hierarchy, Image proportions, Responsive behavior).
- Create a comprehensive UI Component System (Buttons, Inputs, Modals, Cards, Tables, etc.).
- Handle all UX States: Loading, Empty, Error, Success.

## Development Workflow
`ANALYZE -> PLAN -> IMPLEMENT -> TEST -> REVIEW -> REFACTOR -> NEXT FEATURE`
Before large changes: Explain what, files changing, dependencies, db changes, risks.
After implementation: Lint, Type check, Test, Build, Fix errors.
