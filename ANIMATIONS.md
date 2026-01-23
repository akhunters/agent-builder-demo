# Micro Animations Reference Guide

This document lists all the micro animations applied across the application for validation purposes.

## Animation Principles
- **Duration**: 0.2s - 0.3s for most interactions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, natural motion
- **Performance**: Using `transform` and `opacity` for GPU acceleration

---

## 1. Button Animations

### Location: All buttons across the application

**Animations Applied:**
- ✅ **Hover**: Slight lift (`translateY(-1px)`) with smooth transition
- ✅ **Active**: Scale down (`scale(0.98)`) on click
- ✅ **Icon Scale**: Icons scale up (`scale(1.1)`) on hover, down (`scale(0.95)`) on active
- ✅ **Color Transitions**: Smooth color changes on hover/active states

**Components:**
- Dashboard: "Create", "Open", "Use", "Delete", "Clear All Data" buttons
- TopBar: Back, Menu, Settings, Code, Preview, Deploy buttons
- NodePalette: Category toggle buttons
- NodeConfigPanel: Close, Apply, Delete buttons
- WorkflowSidebar: Navigation buttons
- Modal: Cancel, Confirm buttons

---

## 2. Card Animations

### Location: Dashboard workflow cards

**Animations Applied:**
- ✅ **Hover**: Lift effect (`translateY(-2px)`) with enhanced shadow
- ✅ **Border**: Smooth border color transition on hover
- ✅ **Fade In**: Cards fade in when loaded (`fade-in` class)
- ✅ **Action Buttons**: Opacity transition (0 → 1) on card hover

**Components:**
- Dashboard workflow/draft/template cards
- Workflow sidebar workflow items

---

## 3. Modal Animations

### Location: All modal dialogs

**Animations Applied:**
- ✅ **Backdrop**: Fade in (`backdropFadeIn` animation, 0.2s)
- ✅ **Modal Content**: Fade in with scale (`modalFadeIn` animation, 0.3s)
  - Starts at `scale(0.95)` and `opacity: 0`
  - Ends at `scale(1)` and `opacity: 1`

**Components:**
- Delete confirmation modal (Dashboard)
- Clear All Data confirmation modal (Dashboard)
- Node delete confirmation modal (NodeConfigPanel)
- MCP configuration modal (NodeConfigPanel)

---

## 4. Sidebar Animations

### Location: WorkflowSidebar component

**Animations Applied:**
- ✅ **Slide In**: Sidebar slides in from left (`slideInLeft` animation)
- ✅ **Section Toggle**: Smooth expand/collapse with chevron rotation
- ✅ **List Items**: Fade in when section expands

**Components:**
- WorkflowSidebar (left side panel)

---

## 5. Node Palette Animations

### Location: NodePalette component (left sidebar)

**Animations Applied:**
- ✅ **Staggered Entry**: Node items slide in from left with staggered delays
  - Each item has 0.05s delay increment
- ✅ **Hover**: Items translate right (`translateX(1px)`) on hover
- ✅ **Category Toggle**: Smooth expand/collapse animation

**Components:**
- NodePalette node items
- Category headers

---

## 6. Node Config Panel Animations

### Location: NodeConfigPanel component (right sidebar)

**Animations Applied:**
- ✅ **Slide In**: Panel slides in from right (`slideInFromRight` animation)
- ✅ **Scale In**: Panel scales in when opened (`scale-in` class)

**Components:**
- NodeConfigPanel container

---

## 7. Node (Canvas) Animations

### Location: React Flow canvas nodes

**Animations Applied:**
- ✅ **Hover**: Lift effect (`translateY(-2px)`) with enhanced shadow
- ✅ **Selected**: Scale up (`scale(1.02)`) with blue glow effect
- ✅ **Handle Hover**: Handles scale up (`scale(1.3)`) and change color on hover
- ✅ **Smooth Transitions**: All node state changes are animated

**Components:**
- All node types (Start, Agent, End, Guardrails, IfElse, etc.)

---

## 8. Edge (Connection) Animations

### Location: React Flow canvas edges

**Animations Applied:**
- ✅ **Hover**: Stroke width increases (2px → 3px) and color changes to blue
- ✅ **Selected**: Blue highlight with smooth transition
- ✅ **Stroke Transitions**: Smooth color and width changes

**Components:**
- All edges connecting nodes

---

## 9. Input Field Animations

### Location: All input fields

**Animations Applied:**
- ✅ **Focus**: Slight scale up (`scale(1.01)`) with border color change
- ✅ **Hover**: Smooth background color transition
- ✅ **Border**: Smooth border color transitions

**Components:**
- TopBar workflow name input
- NodeConfigPanel all input fields
- Dashboard search (if any)
- Select dropdowns

---

## 10. Tab Animations

### Location: Dashboard tabs

**Animations Applied:**
- ✅ **Hover**: Smooth color transition
- ✅ **Active Indicator**: Animated underline that expands from 0 to 100% width
- ✅ **Smooth Transitions**: All tab state changes

**Components:**
- Dashboard: Workflows, Drafts, Templates tabs

---

## 11. Checkbox Animations

### Location: All checkboxes

**Animations Applied:**
- ✅ **Checkmark Draw**: Animated checkmark drawing (`checkmarkDraw` animation)
  - Draws from top-left to bottom-right
- ✅ **Hover**: Background and border color transitions
- ✅ **Checked State**: Smooth color change to blue

**Components:**
- NodeConfigPanel checkboxes (Guardrails, Agent settings, etc.)

---

## 12. Select/Dropdown Animations

### Location: All select dropdowns

**Animations Applied:**
- ✅ **Hover**: Slight lift (`translateY(-1px)`)
- ✅ **Focus**: Border color and shadow transitions
- ✅ **Smooth Transitions**: All state changes

**Components:**
- TopBar status dropdown
- NodeConfigPanel select fields

---

## 13. Scrollbar Animations

### Location: All scrollable areas

**Animations Applied:**
- ✅ **Thumb Hover**: Smooth background color transition
- ✅ **Smooth Transitions**: Color changes are animated

**Components:**
- NodeConfigPanel
- NodePalette
- WorkflowSidebar
- Modal content

---

## 14. Icon Animations

### Location: All icons in buttons

**Animations Applied:**
- ✅ **Hover Scale**: Icons scale up (`scale(1.1)`) on button hover
- ✅ **Active Scale**: Icons scale down (`scale(0.95)`) on button active
- ✅ **Transform Transitions**: Smooth scale transitions

**Components:**
- All button icons across the application

---

## 15. Loading States

### Location: Loading indicators

**Animations Applied:**
- ✅ **Spin**: Continuous rotation (`spin` animation, 1s linear infinite)
- ✅ **Pulse**: Opacity pulse (`pulse` animation, 2s infinite)

**Components:**
- Loading spinners (if any)
- Skeleton loaders (if any)

---

## 16. Page Transitions

### Location: Page navigation

**Animations Applied:**
- ✅ **Fade In**: Content fades in on page load (`fadeIn` animation)
- ✅ **Scale In**: Elements scale in on mount (`scaleIn` animation)

**Components:**
- Dashboard page
- Workflow editor page

---

## 17. Special Interactions

### Back Button (TopBar)
- ✅ **Icon Translation**: Arrow icon translates left (`-translate-x-1`) on hover

### Node Palette Items
- ✅ **Staggered Animation**: Items appear with sequential delays for visual flow

### Workflow Cards
- ✅ **Group Hover**: Action buttons fade in (`opacity: 0 → 1`) on card hover

---

## Animation Timing Reference

| Element | Duration | Easing |
|---------|----------|--------|
| Buttons | 0.2s | cubic-bezier(0.4, 0, 0.2, 1) |
| Cards | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |
| Modals | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |
| Sidebars | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |
| Inputs | 0.2s | cubic-bezier(0.4, 0, 0.2, 1) |
| Nodes | 0.2s | cubic-bezier(0.4, 0, 0.2, 1) |
| Edges | 0.2s | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Validation Checklist

Use this checklist to validate all animations:

### Dashboard Page
- [ ] Create button hover/active
- [ ] Tab hover/active transitions
- [ ] Workflow card hover (lift + shadow)
- [ ] Action buttons fade in on card hover
- [ ] Delete modal fade in
- [ ] Clear All modal fade in
- [ ] Button icon scale on hover

### Workflow Editor Page
- [ ] TopBar back button (icon translate)
- [ ] TopBar all buttons hover/active
- [ ] Node palette items staggered entry
- [ ] Node palette items hover (translate right)
- [ ] Node config panel slide in from right
- [ ] Workflow sidebar slide in from left
- [ ] Canvas nodes hover (lift + shadow)
- [ ] Canvas nodes selected (scale + glow)
- [ ] Canvas edges hover (width + color)
- [ ] Canvas handles hover (scale + color)
- [ ] Input fields focus (scale + border)

### Node Config Panel
- [ ] All input fields focus
- [ ] All select dropdowns hover
- [ ] Checkboxes checkmark draw animation
- [ ] Buttons hover/active
- [ ] Delete confirmation modal

### General
- [ ] All buttons have hover lift
- [ ] All buttons have active scale
- [ ] All icons scale on hover
- [ ] Smooth color transitions everywhere
- [ ] No jarring or abrupt changes

---

## Performance Notes

- All animations use `transform` and `opacity` for GPU acceleration
- No animations trigger layout reflows
- Transitions are optimized with `will-change` where needed
- Cubic-bezier easing provides natural, smooth motion

---

## Custom Animation Classes

The following utility classes are available:

- `.fade-in` - Fade in animation
- `.scale-in` - Scale in animation
- `.slide-up` - Slide up animation
- `.node-palette-item` - Staggered node palette item animation
- `.slide-in` - Sidebar slide in animation

---

*Last Updated: 2026-01-23*
