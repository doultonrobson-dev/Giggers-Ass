// Function to load a song from your GitHub folder
function loadGigSong(mp3Path, lrcPath) {
    // 1. Set the audio source
    audioPlayer.src = "tracks/" + mp3Path;
    document.getElementById('currentTrackTitle').innerText = mp3Path.replace('.mp3', '');

    // 2. Fetch the lyric file from your folder automatically
    fetch("tracks/" + lrcPath)
        .then(response => response.text())
        .then(data => {
            parseLyrics(data);
            lyricDisplay.innerText = "Ready for " + mp3Path;
        })
        .catch(err => {
            lyricDisplay.innerText = "Lyric file missing!";
            console.error(err);
        });
}
