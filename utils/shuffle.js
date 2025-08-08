// Fisher-Yates shuffle for 2D array
export function shuffle(array) {
  const flat = array.flat();
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }
  // Rebuild 2D array
  const size = array.length;
  return Array.from({ length: size }, (_, i) =>
    flat.slice(i * size, (i + 1) * size)
  );
}
