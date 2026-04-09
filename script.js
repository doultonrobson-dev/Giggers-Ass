const audioPlayer = document.getElementById('audioPlayer');
const lyricDisplay = document.getElementById('lyricDisplay');
const trackName = document.getElementById('trackName');
let lyrics = [];

// Handle MP3 Selection
document.getElementById('audioInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audioPlayer.src = URL.createObjectURL(file);
        trackName.innerText = file.name;
    }
});

// Handle Lyric File
document.getElementById('lyricInput').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => parseLyrics(event.target.result);
    reader.readAsText(e.target.files[0]);
});

// Toggle/Save Manual
document.getElementById('toggleManual').onclick = () => {
    document.getElementById('manualInputArea').style.display = 'block';
};

document.getElementById('saveManual').onclick = () => {
    parseLyrics(document.getElementById('manualText').value);
    document.getElementById('manualInputArea').style.display = 'none';
};

function parseLyrics(text) {
    lyrics = text.split('\n').map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            return { time: parseInt(match[1]) * 60 + parseFloat(match[2]), text: match[3].trim() };
        }
        return null;
    }).filter(l => l !== null).sort((a,b) => a.time - b.time);
    lyricDisplay.innerText = "Lyrics Ready!";
}

// Syncing
audioPlayer.addEventListener('timeupdate', () => {
    const active = lyrics.reduce((prev, curr) => (curr.time <= audioPlayer.currentTime ? curr : prev), { text: "..." });
    if(lyricDisplay.innerText !== active.text) {
        lyricDisplay.innerText = active.text;
    }
});
