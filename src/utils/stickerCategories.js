const stickerImports = import.meta.glob("../assets/Stickers/**/*.png", {
    eager: true,
    import: "default",
});

const stickerCategories = {};

Object.entries(stickerImports).forEach(([path, src]) => {
    const parts = path.split("/");
    const folderName = parts[parts.length - 2]; //category
    const fileName = parts[parts.length - 1];

    stickerCategories[folderName] = stickerCategories[folderName] || {};
    stickerCategories[folderName][fileName.replace(".png", "")] = src;
});

export { stickerCategories };
