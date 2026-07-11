# PDF writing files

Each writing detail page links to a PDF file instead of rendering inline prose.

By default, the page looks for a PDF named after the writing slug:

- `src/writings/afterthought.pdf`
- `src/writings/a-b-c.pdf`
- `src/writings/keep-calm-and-carry-on.pdf`
- `src/writings/the-man-in-the-hole.pdf`
- `src/writings/lull.pdf`
- `src/writings/room-413.pdf`

To customize an individual PDF, add a `pdf` object to the corresponding entry in `src/writings.js`:

```js
{
  slug: "afterthought",
  title: "Afterthought",
  excerpt: "...",
  year: 2026,
  pdf: {
    src: "/src/writings/afterthought.pdf",
    title: "Afterthought screenplay PDF",
    openLabel: "open afterthought",
    downloadLabel: "download afterthought"
  }
}
```

Only `src` is needed when the PDF file name does not match the slug; the other fields customize the labels shown on the writing detail page.
