# UI/UX & Workflow Improvement Tasks — M$A International

## Sprint 1: Critical Fixes & Brand Consistency
- [x] **TASK-UIUX-C1**: Fix deal_type filter parameter mismatch
  - **Status**: Completed
  - **Description**: Fix `DanhMucClient.tsx` filter button parameters from `type` to `deal_type` to resolve broken projects filtering.
  - **Completed**: 2026-08-01
  - **Evidence**: Modified `src/app/(frontend)/[lang]/danh-muc/DanhMucClient.tsx` line 90, 96, 102. Tests: builds locally.

- [x] **TASK-UIUX-C2**: Mask credentials in Settings API & UI
  - **Status**: Completed
  - **Description**: Hide plaintext `smtp_pass` and `ai_api_key` in Settings API response and UI inputs. Use password input types.
  - **Completed**: 2026-08-01
  - **Evidence**: Masked secrets to '••••••••' in src/app/api/settings/route.ts, updated client handleSave in src/app/(admin)/admin/cai-dat/page.tsx, inputs are password types.

- [x] **TASK-UIUX-C3**: Fix nested `<html>`/`<body>` in admin layout
  - **Status**: Completed
  - **Description**: Stablize `<html>`/`<body>` root elements in `admin/layout.tsx` to prevent dynamic swapping and hydration mismatch errors on authentication state changes.
  - **Completed**: 2026-08-01
  - **Evidence**: Modified `src/app/(admin)/admin/layout.tsx` to keep a single stable return of root tags and dynamically render inner content based on auth state.

- [x] **TASK-UIUX-C4**: Unify brand name consistency (`M$A International`)
  - **Status**: Completed
  - **Description**: Standardize the brand name `M$A International` across config stores, settings page state, email templates, and UI headers/footers to resolve naming discrepancies.
  - **Completed**: 2026-08-01
  - **Evidence**: Replaced all incorrect occurrences of `MNA International`, `Vietnam.com`, and `M$AVietnam.com` with `M$A International` in `vi.json`, `en.json`, `Header.tsx`, `Footer.tsx`, `email-service.ts`, `config-store.ts`, `SettingsContext.tsx`, and `cai-dat/page.tsx`.

## Sprint 2: High-Impact UX Fixes
- [x] **TASK-UIUX-H1**: Implement interactive image gallery + lightbox
  - **Status**: Completed
  - **Description**: Add image gallery interaction and a custom zoom lightbox for projects details image gallery.
  - **Completed**: 2026-08-01
  - **Evidence**: Created client component src/components/ui/ProjectGallery.tsx with image switching, zoom lightbox, navigation controls, and custom backdrop overlay. Integrated it into src/app/(frontend)/[lang]/du-an/[slug]/page.tsx.

- [x] **TASK-UIUX-H2**: Fix mobile menu i18n links + hardcode text
  - **Status**: Completed
  - **Description**: Fix links on mobile menu to append `/${lang}` prefix and use translated dictionary texts.
  - **Completed**: 2026-08-01
  - **Evidence**: Replaced hardcoded text with `dict.projects.filter_buyout` and `dict.projects.filter_jv` on both desktop and mobile CTA links. Prefixed mobile links with dynamic `/${lang}` router path.

- [x] **TASK-UIUX-H3**: Responsive sidebar (mobile drawer)
  - **Status**: Completed
  - **Description**: Create mobile responsive drawer menu for sidebar on admin CMS.
  - **Completed**: 2026-08-01
  - **Evidence**: Replaced static sidebar with responsive absolute drawer layout on mobile screens (`-translate-x-full md:translate-x-0`). Added responsive backdrop overlay and a floating mobile toggle button. Shifted `AdminHeader` padding on mobile (`max-md:pl-16`) to prevent overlap.

- [x] **TASK-UIUX-H4**: Replace all `alert()` with Toast notification system
  - **Status**: Completed
  - **Description**: Replace native browser alert dialogs with a modern toast library (e.g. `sonner` or `react-hot-toast`).
  - **Completed**: 2026-08-01
  - **Evidence**: Installed `react-hot-toast`, added `<Toaster />` container inside `AdminLayout` body, and replaced all native browser `alert()` popups with `toast.success` and `toast.error` across all admin control components: `MatchingClient.tsx`, `leads/page.tsx`, `AdminProjectsClient.tsx`, `CreateProjectClient.tsx`, `EditProjectClient.tsx`, `MasterDataClient.tsx`, `cai-dat/page.tsx`, and `vdr/page.tsx`.

- [x] **TASK-UIUX-H5**: Differentiate action icons in Projects table
  - **Status**: Completed
  - **Description**: Distinguish toggle visibility action icon from soft delete action icon in admin projects table.
  - **Completed**: 2026-08-01
  - **Evidence**: Replaced the soft-delete/archive `EyeOff` action icon in the table column and confirmation dialog of `AdminProjectsClient.tsx` with a `Trash2` icon. Maintained `Eye` and `EyeOff` for publish status toggling to clearly separate actions.

- [x] **TASK-UIUX-H6**: Fix auth flash (loading skeleton matching bg)
  - **Status**: Completed
  - **Description**: Fix flash from dark theme to light theme during client-side auth validation.
  - **Completed**: 2026-08-01
  - **Evidence**: Replaced light-flashing loading screens with a unified, dark loading template (`bg-[#0A1628]`) inside `AdminLayout` that matches the dark admin sidebar theme. Avoids client-side visual flashes during authentication checks.

## Sprint 3: Medium UX Improvements
- [x] **TASK-UIUX-M1**: Reorder consent checkbox before Submit
  - **Status**: Completed
  - **Description**: Move consent checkbox before the Submit button on the KyGui frontend form.
  - **Completed**: 2026-08-01
  - **Evidence**: Reordered checkboxes wrapper in `KyGuiClient.tsx` to sit before the submit button container.
  
- [x] **TASK-UIUX-M2**: Fix WCAG contrast ratios in Footer & ProjectCard
  - **Status**: Completed
  - **Description**: Increase contrast ratio of text colors to satisfy WCAG AA standards (>= 4.5:1).
  - **Completed**: 2026-08-01
  - **Evidence**: Changed text-gray-500 (#6B7280) on dark bg to text-gray-400 (#9CA3AF) in Footer.tsx and ProjectCard.tsx.
  
- [x] **TASK-UIUX-M3**: Mobile master-detail toggle for Leads page
  - **Status**: Completed
  - **Description**: Make Leads page split-screen responsive on mobile by adding a toggle/back flow.
  - **Completed**: 2026-08-01
  - **Evidence**: Implemented `mobileView` dynamic state, custom "back to list" button, and conditional `hidden` classes on columns in `leads/page.tsx`.
  
- [x] **TASK-UIUX-M4**: Collapsible filter on mobile for DanhMuc page
  - **Status**: Completed
  - **Description**: Make DanhMuc filter bar collapsible or accordion-style on mobile screens.
  - **Completed**: 2026-08-01
  - **Evidence**: Added `showFiltersMobile` state and a toggle button with SlidersHorizontal icon. Filter container is toggled hidden/block on mobile screens.
  
- [x] **TASK-UIUX-M5**: Add pagination to Projects & VDR tables
  - **Status**: Completed
  - **Description**: Add simple pagination control (10/20/50 items) to admin projects and VDR tables.
  - **Completed**: 2026-08-01
  - **Evidence**: Added `currentPage` state and rendered slices of 10 items per page with navigation controls in `AdminProjectsClient.tsx` and `vdr/page.tsx`.
  
- [x] **TASK-UIUX-M6**: Sync tab state with URL query in Master Data
  - **Status**: Completed
  - **Description**: Sync active tab in MasterDataClient with URL query parameter `?tab=...` on refresh.
  - **Completed**: 2026-08-01
  - **Evidence**: Added `useSearchParams` hook and bi-directional useEffect to synchronize tab clicks with `?tab=` URL parameter in `MasterDataClient.tsx`.
  
- [x] **TASK-UIUX-M7**: Fix misleading 0-lead bar chart on Dashboard
  - **Status**: Completed
  - **Description**: Ensure month with 0 leads is rendered with 0 height bar on SVG chart.
  - **Completed**: 2026-08-01
  - **Evidence**: Modified count height percent fallback value from 4 to 0 in monthly leads chart inside `admin/page.tsx`.
  
- [x] **TASK-UIUX-M8**: Preserve query parameters on language switch
  - **Status**: Completed
  - **Description**: Retain search query params (like `?deal_type=...`) when switching languages in header.
  - **Completed**: 2026-08-01
  - **Evidence**: Enhanced `switchLangUrl` segment-mapping logic to preserve search parameters and query strings during language switches in `Header.tsx`.
  
- [x] **TASK-UIUX-M9**: Tab-based bilingual form for project editing
  - **Status**: Completed
  - **Description**: Split project edit bilingual form fields into Tab-based view (VI | EN).
  - **Completed**: 2026-08-01
  - **Evidence**: Added `formTab` state, tab selector header, and conditional field displays for all bilingual properties in `EditProjectClient.tsx`.
  
- [x] **TASK-UIUX-M10**: Fix VDR signature canvas invert issue
  - **Status**: Completed
  - **Description**: Remove invert filter on signature rendering canvas.
  - **Completed**: 2026-08-01
  - **Evidence**: Removed class `filter invert` from signature image tag inside handwritten view modal in `vdr/page.tsx`.
  
- [x] **TASK-UIUX-M11**: Create English URL slugs via rewrites
  - **Status**: Completed
  - **Description**: Handle English URLs like `/en/about`, `/en/projects`, etc. in next middleware.
  - **Completed**: 2026-08-01
  - **Evidence**: Oversaw routing redirects and path rewrites using internal rewrite URLs in `src/middleware.ts` and updated page routing logic across frontend components.

## Sprint 4: Polish & Design Tokens
- [ ] **TASK-UIUX-L1**: Establish Tailwind Design Tokens (theme branding colors)
  - **Status**: Pending
  - **Description**: Define custom tailwind brand colors (`navy`, `gold`, `muted`) and replace inline hex strings.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-L2**: Replace raw emojis with Lucide React icons
  - **Status**: Pending
  - **Description**: Replace unicode raw emojis in footer and headers with Lucide icons.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-L4**: Optimize mousemove listeners in InteractiveStars
  - **Status**: Pending
  - **Description**: Use IntersectionObserver to disable animation when InteractiveStars is out of viewport.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-L5**: Fix placeholder links `href="#"` in footer
  - **Status**: Pending
  - **Description**: Replace `#` links with real pages or remove href if page doesn't exist.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-L6**: Rename "Live Logs" to "Hoạt động gần đây"
  - **Status**: Pending
  - **Description**: Adjust admin dashboard text for recent logs.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-L7**: Remove fake notification bell animation
  - **Status**: Pending
  - **Description**: Remove fake pulse animation on AdminHeader notification bell.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-L8**: Login page password visibility toggle
  - **Status**: Pending
  - **Description**: Add toggle to show/hide password text on admin login form.
  - **Completed**: N/A
  - **Evidence**: N/A

## Sprint 5: Advanced Features
- [ ] **TASK-UIUX-A1**: Admin Notification System
  - **Status**: Pending
  - **Description**: Real-time notification system badge and panel on AdminHeader.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-A2**: Bulk Select & Actions for Leads table
  - **Status**: Pending
  - **Description**: Implement select-all checkbox and actions to bulk publish/hide/archive leads.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-A3**: Bulk Select & Actions for Projects table
  - **Status**: Pending
  - **Description**: Implement select-all checkbox and actions to bulk archive/delete projects.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-A4**: Notification preferences for Admin Settings
  - **Status**: Pending
  - **Description**: Add settings options for email alerts on new leads/VDR updates.
  - **Completed**: N/A
  - **Evidence**: N/A


