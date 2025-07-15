const backgroundImports = import.meta.glob("../assets/Background/**/*.JPG", {
  eager: true,
  import: "default",
});

const backgroundCategories = {};

Object.entries(backgroundImports).forEach(([path, src]) => {
  const parts = path.split("/");
  const folderName = parts[parts.length - 2]; // Category name (folder)
  const fileName = parts[parts.length - 1];

  const nameWithoutExtension = fileName.replace(/\.(jpg|jpeg|png)$/i, "");

  if (!backgroundCategories[folderName]) {
    backgroundCategories[folderName] = {};
  }

  backgroundCategories[folderName][nameWithoutExtension] = src;
});

export { backgroundCategories };
