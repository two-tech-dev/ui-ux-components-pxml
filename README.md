# ui-ux-components

A **pxml UI/UX component library** for AI-compiled web projects (Next.js + Tailwind by default).
It ships ready-made, well-styled base components covering the major website genres — auth,
marketing/landing, e-commerce, dashboards, forms, feedback overlays, editorial content and social —
so you can assemble a complete website by composing tags instead of writing components by hand.

Every component is a pxml `<node type="ui-component">` with a sensible **default style** baked in.
You use a tag and, only if you want, attach a **prompt** to restyle it. The AI generates the code.

## How it works

A component in this package is a *base node*. It is never meant to be compiled as-is into your app
untouched — you **extend** it from your own `project.xml`, which merges its default style with your
own instructions. Unused components are simply not generated.

- `extends="uix:<category>:<name>"` → inherits the component's default style.
- A `<constraint verify="llm-judge">…</constraint>` you add → **the prompt** that overrides/augments that default style.
- `<meta><path>…</path></meta>` → where the generated file lands (override the default).

## Install / reference

This is a local pxml package. Copy or symlink it next to your project, then import it.

**Full library (every component available as `uix:<cat>:<name>`):**

```xml
<import package="ui-ux-components" from="packages/ui-ux-components" as="uix" />
```

**Selective (cheaper — only that genre's components enter the build):**

```xml
<import src="packages/ui-ux-components/components/auth.xml" as="uix-auth" />
<!-- components become: uix-auth:login, uix-auth:signup, ... -->
```

## Usage example

```xml
<!-- 1. bring in the library -->
<import package="ui-ux-components" from="packages/ui-ux-components" as="uix" />

<!-- 2. a plain login page (default style) -->
<node id="page.login" type="ui-component" flow="auth" extends="uix:auth:login">
  <meta><path>app/login/page.tsx</path></meta>
</node>

<!-- 3. the same login, restyled via an attached prompt -->
<node id="page.login.branded" type="ui-component" flow="auth" extends="uix:auth:login">
  <meta><path>app/(auth)/login/page.tsx</path></meta>
  <constraint verify="llm-judge">Dark glassmorphism: bg-slate-950, card bg-white/10 backdrop-blur-xl,
    emerald accent instead of indigo, add Google + GitHub social login on top.</constraint>
</node>
```

Then run:

```bash
pxml validate   # check the spec
pxml compile    # AI generates the extended components
```

Because `extends` merges constraints (parent first, then yours), your prompt is read *after* the
default style, so it refines rather than fights it.

## Component catalog

Names below are the `extends` targets (prefix with your import alias, e.g. `uix:`).

| Category     | Tags |
| :---         | :--- |
| **layout**    | `container` `section` `grid` `card` `button` `divider` `spacer` |
| **navigation**| `navbar` `sidebar` `footer` `breadcrumb` `tabs` `pagination` `mobileMenu` `megaMenu` `languageSwitcher` `cookieConsent` `backToTop` |
| **auth**      | `login` `signup` `forgotPassword` `resetPassword` `otpVerify` `socialLogin` `onboarding` `profileSettings` `changePassword` `twoFactor` `inviteAccept` |
| **marketing** | `hero` `features` `pricing` `testimonials` `faq` `cta` `stats` `logoCloud` `newsletter` |
| **ecommerce** | `productCard` `productGrid` `productDetail` `cart` `checkout` `wishlist` `orderHistory` `filterPanel` `quickView` `reviewList` `reviewForm` `couponInput` `orderTracking` `sizeGuide` |
| **dashboard** | `adminLayout` `statCard` `dataTable` `chartPanel` `notification` `userMenu` `calendar` `kanban` `messages` `activityLog` `settingsPage` `filterBar` |
| **forms**     | `contactForm` `searchBar` `multiStepForm` `fileUpload` |
| **feedback**  | `modal` `toast` `alert` `tooltip` `drawer` |
| **content**   | `blogList` `articleCard` `blogPost` `gallery` `carousel` `codeBlock` `tableOfContents` `audioPlayer` `newsCard` |
| **social**    | `commentSection` `feed` `profilePage` `chat` `stories` `notificationFeed` `events` |
| **inputs**    | `textField` `textArea` `select` `checkbox` `radioGroup` `switch` `slider` `datePicker` `combobox` `inputGroup` `rating` `tagInput` `colorPicker` |
| **primitives**| `badge` `avatar` `progress` `skeleton` `spinner` `emptyState` `accordion` `popover` `dropdownMenu` `hoverCard` `contextMenu` `commandPalette` `kbd` `toggle` `aspectRatio` `countdown` |
| **booking**   | `bookingWidget` `appointmentScheduler` `dateRangePicker` `reservationConfirm` `seatMap` |
| **industry**  | `announcementBar` `comparisonTable` `timeline` `team` `appStoreBadges` `videoSection` `jobListing` `jobDetail` `jobApply` `propertyCard` `propertyDetail` `courseCard` `coursePlayer` `restaurantMenu` `eventAgenda` `donationForm` `knowledgeBase` `docsLayout` `forumTopic` `forumThread` `podcastPlayer` `videoPlayer` `mapEmbed` `storeLocator` |
| **errors**    | `notFound` `errorPage` `maintenance` `searchResults` `comingSoon` |

Each component documents the props it accepts in its `verify="static"` constraint and its default
look in the `verify="llm-judge"` constraint. Override either by extending and adding your own
constraints.

## Customizing the default style globally

To change the shared design language (color, radius, density) across many components, add a
project-level `<constraint verify="llm-judge">` to a wrapper node that other nodes `depends_on`,
or simply restyle each tag individually with its own prompt.

## Notes

- Stacks: components assume Tailwind + React (Next.js App Router). For other stacks set the
  consuming project's `stack` attribute; pxml adjusts the generator accordingly.
- The package's `project.xml` only *declares* components; nothing is generated until you extend a tag.
- `pxml.xsd` / `bugs.xsd` are included for editor autocomplete and `bugs_history.xml` validation.
