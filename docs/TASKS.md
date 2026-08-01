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

- [ ] **TASK-UIUX-H2**: Fix mobile menu i18n links + hardcode text
  - **Status**: Pending
  - **Description**: Fix links on mobile menu to append `/${lang}` prefix and use translated dictionary texts.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-H3**: Responsive sidebar (mobile drawer)
  - **Status**: Pending
  - **Description**: Create mobile responsive drawer menu for sidebar on admin CMS.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-H4**: Replace all `alert()` with Toast notification system
  - **Status**: Pending
  - **Description**: Replace native browser alert dialogs with a modern toast library (e.g. `sonner` or `react-hot-toast`).
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-H5**: Differentiate action icons in Projects table
  - **Status**: Pending
  - **Description**: Distinguish toggle visibility action icon from soft delete action icon in admin projects table.
  - **Completed**: N/A
  - **Evidence**: N/A

- [ ] **TASK-UIUX-H6**: Fix auth flash (loading skeleton matching bg)
  - **Status**: Pending
  - **Description**: Fix flash from dark theme to light theme during client-side auth validation.
  - **Completed**: N/A
  - **Evidence**: N/A

