# My_Shots 📸

A Pinterest-style responsive photo gallery built as a frontend practice project — exploring CSS Grid, Masonry layout, and vanilla JavaScript interactions.

> **Note:** This is a UI/frontend practice project, not a full-stack application. Built to strengthen HTML, CSS, and JavaScript fundamentals.

---

## Preview

A clean, responsive masonry grid layout that reflows based on screen size — similar to Pinterest's photo feed style.

---

## What I Practiced

| Concept | How It's Used |
|---|---|
| CSS Grid | Masonry-style multi-column photo layout |
| Responsive Design | Grid reflows from 3 columns → 2 → 1 on smaller screens |
| CSS Hover Effects | Smooth overlay and scale transitions on image hover |
| JavaScript DOM | Dynamic rendering of photo cards from a data array |
| Flexbox | Navigation bar and footer layout |

---

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, transitions, media queries)
- Vanilla JavaScript

---

## Project Structure

```
My_Shots/
├── index.html       # Gallery layout
├── style.css        # Grid, hover effects, responsive breakpoints
├── script.js        # Dynamic card rendering
├── images/          # Photo assets
└── README.md
```

---

## Setup & Run

No build step needed — just open in browser:

```bash
git clone https://github.com/Rajnish7569/My_Shots.git
cd My_Shots
open index.html
```

---

## Key Learnings

- How CSS Grid `auto-fill` and `minmax()` create fluid responsive layouts without media queries
- Managing image aspect ratios in a grid without distortion using `object-fit: cover`
- Layering CSS transitions for smooth UX without JavaScript overhead

---

## Future Improvements

- [ ] Add search/filter by tag
- [ ] Add a backend (Django/Flask) for dynamic image uploads
- [ ] Add lightbox modal for full-size image view
- [ ] Deploy on GitHub Pages

---

## Author

**Rajnish Kumar** — [github.com/Rajnish7569](https://github.com/Rajnish7569) | [LinkedIn](https://linkedin.com/in/rajnish7569)
