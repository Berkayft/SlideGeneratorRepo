const Theme = require("../utils/theme");

const classicTheme = new Theme(
    "Classic Light",
    "Arial, sans-serif", // Font 0
    "Open Sans, sans-serif", // Font 1
    "Roboto, sans-serif", // Font 2
    "#ffffff", // Background 0 (white)
    "#f5f5f5", // Background 1 (light gray)
    "#e0e0e0", // Background 2 (mid gray)
    "#cccccc", // Background 3 (dark gray)
    "#333333", // Font Color 0 (black)
    "#666666", // Font Color 1 (gray)
    "#999999", // Font Color 2 (light gray)
    "#aaaaaa", // Font Color 3 (dark gray)
  );

const modernTheme = new Theme(
    "Modern Dark",
    "Lato, sans-serif", // Font 0
    "Nunito, sans-serif", // Font 1
    "Poppins, sans-serif", // Font 2
    "#222222", // Background 0 (black)
    "#333333", // Background 1 (dark gray)
    "#444444", // Background 2 (mid gray)
    "#555555", // Background 3 (light gray)
    "#ffffff", // Font Color 0 (white)
    "#cccccc", // Font Color 1 (light gray)
    "#bbbbbb", // Font Color 2 (mid gray)
    "#aaaaaa", // Font Color 3 (dark gray)
  );

const creativeTheme = new Theme(
    "Creative",
    "Pacifico, cursive", // Font 0
    "Lobster, cursive", // Font 1
    "Dancing Script, cursive", // Font 2
    "#fffafa", // Background 0 (light beige)
    "#f2f2f2", // Background 1 (light gray)
    "#e0e0e0", // Background 2 (mid gray)
    "#d7d7d7", // Background 3 (dark gray)
    "#000000", // Font Color 0 (black)
    "#ff0000", // Font Color 1 (red)
    "#00ff00", // Font Color 2 (green)
    "#0000ff", // Font Color 3 (blue)
  );

const themeList = [
    classicTheme,
    modernTheme,
    creativeTheme
]



module.exports = themeList;