function padTime(input) {
  return input.toString().padStart(2, '0');
}

export function formatTime(secondDuration) {
  const hours = Math.floor(secondDuration / 3600);
  const minutes = Math.floor((secondDuration - hours * 3600) / 60);
  const seconds = Math.floor(secondDuration - hours * 3600 - minutes * 60);

  return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}
