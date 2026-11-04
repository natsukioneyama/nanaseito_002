// Videos shown at the end of the Overview grid (after the photos) and on moving-image.html.
// Kept separate so portfolio-data.js stays photo data. Same schema as a
// portfolio-data.js project; overview.js already handles media `type: 'video'` (`src`).
// Order = source file name ascending (nanaseito_img/video/), ties by folder name.
// title / line1 are taken verbatim from the source folder names "Project : Photographer".
// dataW/dataH = actual video frame size (ffprobe), used for the grid cell / Lightbox ratio.
// Faddy: 01-web.mp4 = web encode of 01.mp4 (H.264 CRF 23 preset slow, AAC 128k, faststart);
// 01.mp4 is the untouched original copy (not referenced by the site).
window.OVERVIEW_VIDEO_PROJECTS = [
  {
    "id": "dr-martin-video",
    "category": "overview",
    "title": "DR MARTIN",
    "line1": "Dani Aphrodite",
    "line2": "",
    "media": [
      { "type": "video", "src": "video/dr-martin/01.mp4", "alt": "DR MARTIN", "dataW": 1916, "dataH": 1080 }
    ]
  },
  {
    "id": "faddy-magazine-video",
    "category": "overview",
    "title": "FADDY MAGAZINE",
    "line1": "Tugcan S Temizkan",
    "line2": "",
    "media": [
      { "type": "video", "src": "video/faddy-magazine/01-web.mp4", "alt": "FADDY MAGAZINE", "dataW": 1920, "dataH": 1080 }
    ]
  },
  {
    "id": "v-magazine-video",
    "category": "overview",
    "title": "V MAGAZINE",
    "line1": "Joshua Charow",
    "line2": "",
    "media": [
      { "type": "video", "src": "video/v-magazine/01.mp4", "alt": "V MAGAZINE", "dataW": 1280, "dataH": 674 }
    ]
  }
];
