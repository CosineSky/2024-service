export const loadSongDuration = (song, durationsMap) => {
  return new Promise((resolve) => {
    const audio = new Audio(song.filePath);

    audio.addEventListener('loadedmetadata', () => {
      durationsMap.value.set(song.id, audio.duration);
      resolve();
    });
    audio.preload = 'metadata';
  });
};

export const loadSongDurations = async (songs, durationsMap) => {
  if (songs) {
    for (const song of songs) {
      if (!durationsMap.value.has(song.id)) {
        await loadSongDuration(song, durationsMap);
      }
    }
  }
}; 