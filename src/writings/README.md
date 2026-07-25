# archived writing PDF files

These PDFs and the writing data are intentionally dormant. The public application does not load or link them; keep them here so the writings feature can be restored later.

The archived detail-page convention maps each writing slug to:

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
    downloadLabel: "download afterthought"
  }
}
```

Set `src` when the PDF file name does not match the slug, and use `downloadLabel` to customize the understated link below the preview.
