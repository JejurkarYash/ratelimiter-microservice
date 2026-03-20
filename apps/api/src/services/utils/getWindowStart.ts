export function getWindowStart(window: number) {
  // get the current timestamp in mseconds
  const now = Math.floor(Date.now() / 1000);
  // calculate the start of the current window
  return Math.floor(now / window) * window;
}
