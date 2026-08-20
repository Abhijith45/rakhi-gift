---
name: 3d-memory-wall
description: Implementation and design rules for the 3D animated Memory Wall in the Personalized Rakhi Memory Website. Use this skill whenever building, modifying, optimizing, or reviewing photo frames, threads, pins, wall scenes, 3D effects, animations, or responsive behavior.
---

# 3D Memory Wall Skill

## 1. Experience objective

Build a web-based "mounted photo memory wall" that feels tactile and dimensional without becoming a heavy 3D game scene.

Visual metaphor:

> Printed memories mounted on a warm wall and physically connected by thread.

The user should perceive:
- depth
- paper/card thickness
- slight imperfections
- physical attachment
- connected memories
- warmth

The user should not perceive:
- a game engine
- a complex CAD scene
- unnecessary camera movement
- gimmicky particle effects

## 2. Rendering strategy

Preferred frontend:
- React
- Vite
- JavaScript
- React Router
- React Three Fiber for 3D scenes
- Three.js
- CSS for standard UI and lightweight effects
- optional Framer Motion for UI transitions

Use 3D only where it materially improves the experience.

Recommended split:
- 3D: photo frames, pins/tacks, thread depth, subtle wall depth
- CSS/HTML: headings, message cards, buttons, forms, timeline, admin UI
- Framer Motion only where a transition is materially easier or more robust than R3F animation

Do not put the entire page into a Three.js canvas.

## 3. Scene structure

Suggested hierarchy:

```text
MemoryWallScene
├── WallBackground
├── ThreadNetwork
├── PhotoFrame[]
│   ├── PhotoTexture
│   ├── Frame
│   ├── Pin
│   └── Shadow
└── DecorativeElements
```

Keep content data separate from rendering components.

Example conceptual data:

```js
{
  id: "photo-01",
  imageUrl: "...",
  caption: "Partners in crime",
  position: { x, y, z },
  rotation: { x, y, z },
  scale: 1,
  pin: "top-center"
}
```

## 4. Frame design

Frames should be:
- broad rectangular
- visually lightweight
- slightly elevated from wall
- softly shadowed
- consistent enough to look like a collection

Use controlled variants rather than fully random styling.

Allowed:
- 2–4 frame visual variants
- subtle border variations
- paper texture
- slight bevel/rounded corner

Avoid:
- giant 3D blocks
- excessive metallic effects
- glass-heavy styles
- neon borders

## 5. Photo placement

Placement should use deterministic randomness.

Never use `Math.random()` directly during rendering if it causes layout changes between renders.

Seed placement from:
- gift ID
- photo ID
- stable hash

This ensures:
- refresh produces the same arrangement
- share links produce the same scene
- screenshot consistency
- no hydration/randomness issues if rendering strategy changes later

Placement rules:
- keep photo centers within safe bounds
- preserve minimum spacing
- avoid text overlay zones
- avoid severe edge clipping
- ensure every photo remains discoverable

## 6. Rotation

Preferred range:
- approximately -6° to +6° around the screen-facing axis

Use smaller ranges on mobile.

Randomness must be controlled.

Never produce:
- upside-down frames
- steep diagonal frames
- intentionally chaotic scrapbook placement unless a specific playful theme requires it

## 7. Depth

Use subtle depth cues:
- small z offsets
- frame thickness
- pin protrusion
- soft shadow
- light parallax

Avoid:
- large perspective distortion
- aggressive camera orbit
- auto-spinning wall
- deep zoom that makes text/photos unreadable

## 8. Camera behavior

Default:
- stable
- front-biased
- minimal movement

Suggested interaction:
- very subtle pointer parallax on desktop
- optional low-amplitude scene response
- no continuous camera motion

On mobile:
- disable or heavily reduce pointer-based parallax
- prioritize stable readability and scroll performance

## 9. Threads

Threads are a core visual element.

Each thread should:
- connect meaningful frame anchors
- have slight natural curvature when visually appropriate
- sit behind frames where physically plausible
- use a warm, festive accent
- remain thin enough not to dominate photos

Preferred implementation:
- line/curve geometry
- lightweight mesh/line technique
- deterministic connection graph

Do not connect every photo to every other photo.

Use a curated graph.

Example:
- main chain across rows
- 1–2 cross connections
- optional theme-specific branching

## 10. Pins/tacks

Pins visually explain how photos are mounted.

Use:
- small sphere/dome
- shallow cylinder
- simple metallic/wooden appearance

Keep geometry low-poly where possible.

Do not create thousands of tiny meshes.

## 11. Wall surface

The wall should not be an enormous texture-heavy asset.

Prefer:
- simple plane
- subtle procedural/CSS texture if outside canvas
- compressed texture if needed

Color family:
- warm cream
- soft beige
- muted blush
- festive but restrained accents

Avoid pure white unless a theme specifically calls for it.

## 12. Lighting

Use soft lighting.

Good:
- ambient/base illumination
- one broad key light
- gentle fill
- subtle shadowing

Avoid:
- dramatic game lighting
- deep black shadows
- high bloom
- excessive HDR effects

The goal is "premium memory wall", not "cinematic game trailer".

## 13. Animation system

Animations must have hierarchy.

### Entrance
1. Wall fades/settles in
2. Threads appear subtly
3. Frames arrive with slight stagger
4. Pins settle
5. Headline/content appears
6. CTA becomes active

### Interaction
- slight frame lift on hover
- subtle shadow increase
- small tilt response
- no major camera movement

### Reveal
Use one strong animation sequence for the surprise reveal.

Do not animate everything continuously.

## 14. Animation timing

Recommended:
- micro interaction: 120–220ms
- card hover: 180–320ms
- section entrance: 450–800ms
- stagger: 50–110ms
- reveal sequence: 700–1400ms

Use easing that feels soft and physical.

Avoid:
- linear movement for major UI animation
- excessive spring overshoot
- long intro sequences that delay content

## 15. Mobile strategy

Mandatory.

The 3D wall must have a mobile composition strategy rather than simply shrinking desktop coordinates.

At mobile widths:
- use fewer simultaneous frame elements if necessary
- reduce depth
- reduce rotation
- reduce shadows
- reduce decorative geometry
- disable nonessential parallax
- keep image faces and captions readable

If performance is poor, in this order:
1. reduce geometry
2. reduce texture resolution
3. reduce shadow complexity
4. reduce animation
5. reduce number of active frame meshes

Do not sacrifice basic content visibility.

## 16. Image handling

Images are the heaviest component.

Before display:
- validate file type
- validate dimensions
- enforce maximum size
- create optimized derivatives where possible
- use CDN URLs
- load appropriate resolution for viewport

Prefer:
- WebP/AVIF where infrastructure supports it
- lazy loading for below-the-fold images
- responsive image sizing

Do not load original giant camera images into a 3D texture if an optimized version exists.

## 17. Accessibility fallback

The product is visually led but must not become inaccessible.

Provide:
- alt text for images where meaningful
- keyboard-accessible reveal controls
- visible focus states
- text version of messages
- reduced-motion behavior

If `prefers-reduced-motion: reduce` is active:
- disable camera movement
- reduce frame entrance animation
- remove nonessential looping effects
- keep the final page fully usable

## 18. Performance budget

Treat performance as a product requirement.

Target:
- responsive interaction on mid-range mobile devices
- minimal long main-thread tasks
- no unnecessary continuous render loops
- no excessive draw calls
- no giant textures
- no massive JS bundles

Avoid:
- dozens of post-processing passes
- thousands of meshes
- physics engines
- particle systems unless clearly justified
- video textures
- huge background assets

Only use `frameloop="always"` when needed.

Prefer event-driven or demand-driven rendering for static scenes when feasible.

## 19. Component boundaries

Suggested components:

```text
MemoryWall
├── MemoryWallScene
│   ├── Wall
│   ├── ThreadNetwork
│   ├── PhotoFrame
│   └── Pin
├── MemoryWallOverlay
└── MemoryWallMobileFallback
```

Do not create one giant component.

## 20. Data and rendering separation

Never hard-code customer photos/content into scene components.

Use data:

```js
const gift = {
  recipientName,
  senderName,
  photos,
  message,
  reasons,
  timeline,
  theme
};
```

The scene receives data and transforms it into presentation.

## 21. Failure states

If an image fails:
- show a styled placeholder frame
- preserve layout
- do not break the scene

If there are fewer photos:
- reflow gracefully

If there are more photos:
- cap or paginate according to product rules

If WebGL is unavailable:
- provide a clean CSS/static memory-wall fallback

## 22. 3D acceptance criteria

- [ ] Scene renders reliably on desktop.
- [ ] Scene renders reliably on common mobile widths.
- [ ] Photos remain recognizable.
- [ ] Frames appear physically attached to the wall.
- [ ] Threads visibly connect frames.
- [ ] Random placement is deterministic.
- [ ] Refresh does not change the arrangement unexpectedly.
- [ ] No frame covers another frame's primary image area.
- [ ] No critical text is hidden behind the 3D canvas.
- [ ] Page remains scrollable.
- [ ] Reduced-motion mode works.
- [ ] WebGL failure has a fallback.
- [ ] 3D does not monopolize the entire application architecture.
- [ ] No console errors are produced during the normal gift experience.
