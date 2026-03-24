const audioPlayer = document.getElementById('audioPlayer');
const lyricDisplay = document.getElementById('lyricDisplay');
const manualArea = document.getElementById('manualInputArea');
const toggleBtn = document.getElementById('toggleManual');
const saveBtn = document.getElementById('saveManual');
let lyrics = [];

// Handle Audio Upload
document.getElementById('audioInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        audioPlayer.src = URL.createObjectURL(file);
    }
});

// Handle File Lyric Upload
document.getElementById('lyricInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => parseLyrics(event.target.result);
    reader.readAsText(e.target.files[0]);
});

// Toggle Manual Entry Mode
toggleBtn.addEventListener('click', () => {
    manualArea.style.display = manualArea.style.display === 'none' ? 'block' : 'none';
});

// Save Manual Lyrics
saveBtn.addEventListener('click', () => {
    const text = document.getElementById('manualText').value;
    parseLyrics(text);
    manualArea.style.display = 'none';
    alert("Lyrics synced!");
});

// The Parser (Supports [mm:ss.xx] format)
function parseLyrics(text) {
    const lines = text.split('\n');
    lyrics = lines.map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            const time = parseInt(match[1]) * 60 + parseFloat(match[2]);
            return { time, text: match[3].trim() };
        }
        return null;
    }).filter(l => l !== null);
    
    // Sort by time just in case they were typed out of order
    lyrics.sort((a, b) => a.time - b.time);
}

// Playback Sync
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const activeLyric = lyrics.reduce((prev, curr) => {
        return (curr.time <= currentTime) ? curr : prev;
    }, { text: "..." });
    
    lyricDisplay.innerText = activeLyric.text;
});
