# Copilot Instructions for This Project

## Project Architecture & Purpose
This is a single-page, browser-only interactive web app—a personalized, animated love letter. The app is intentionally self-contained, with all logic and UI in three files:
- **index.html**: Defines the UI structure, includes all visible elements, and links to CSS/JS and external fonts/icons.
- **main.js**: Contains all interactivity, animation, and personalization logic. No external JS dependencies.
- **style.css**: Implements a modern, glassmorphic, and animated visual style, including all layout and animation rules.

### Data Flow & UI State
- All user-facing content (names, story, reasons) is set via constants at the top of `main.js`.
- The app starts with a typewriter-animated story, then presents Yes/No buttons. Button logic is handled in `main.js`.
- Clicking "Yes" triggers a success state: the main card is hidden, a new card with a letter, reasons, and a photo frame is shown.
- Clicking "No" cycles playful responses and animates the button's position/size, making "Yes" more prominent over time.
- Floating hearts are dynamically created for background animation.
- Sound effects are generated using the Web Audio API (see `playSound()` in `main.js`).

### UI/UX Patterns & Edge Cases
- **Typewriter Effect**: Implemented in `typeNextLine()`. Handles line-by-line reveal, with natural typing speed.
- **Button Animation**: "No" button moves randomly and grows the "Yes" button on repeated clicks. After 5+ "No" clicks, "Yes" becomes very large.
- **Success Transition**: Uses opacity/transform transitions for smooth card switching. Reasons list animates in one by one (`animateReasons()`).
- **Replay**: The experience can be reset via a replay button, restoring all state and animations.
- **Sound/Autoplay**: Background music starts on "Yes" click, but may require user interaction due to browser autoplay policies.
- **No Build/No Test**: No npm, build, or test scripts. No frameworks. All logic is in `main.js` and runs on DOMContentLoaded.

## Developer Workflow
- **Preview**: Open `index.html` directly in a browser. No server or build step required.
- **Personalize**: Edit constants at the top of `main.js` to change names, story, or reasons. Example:
	- Add a reason: `reasons.push("You always make me laugh")`
	- Change the story: Edit the `storyLines` array.
- **Style**: Edit `style.css` for layout, glassmorphism, or animation changes. All visual effects are handled here.
- **Debug**: Use browser DevTools. All state and logic are in `main.js`.

## Integration & Extension Points
- **Fonts/Icons**: Uses Google Fonts and Font Awesome via CDN in `index.html`.
- **Photo Frame**: To add a real photo, replace the placeholder in the `.polaroid-img` div in `index.html` and update logic in `main.js` if needed.
- **Hearts Count**: Adjust the number of floating hearts by changing `heartCount` in `createFloatingHearts()`.
- **Sound**: To add new sound types, extend `playSound()` in `main.js`.

## File Reference
- `index.html`: UI structure, links to CSS/JS, and external fonts/icons.
- `main.js`: All personalization, animation, and event logic. All state is managed here.
- `style.css`: All visual styles, including glassmorphism, animations, and responsive layout.

---
For further customization, see comments in `main.js` for all editable sections. For new features, follow the single-file, no-build, browser-only pattern.
