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

