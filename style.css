const audioPlayer = document.getElementById('audioPlayer');
const lyricDisplay = document.getElementById('lyricDisplay');
let lyrics = [];

// 1. Load Audio
document.getElementById('audioInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => { audioPlayer.src = event.target.result; };
    reader.readAsDataURL(e.target.files[0]);
});

// 2. Load and Parse Lyrics
document.getElementById('lyricInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        parseLyrics(event.target.result);
    };
    reader.readAsText(e.target.files[0]);
});

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
}

// 3. Sync Logic
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const activeLyric = lyrics.reduce((prev, curr) => {
        return (curr.time <= currentTime) ? curr : prev;
    }, { text: "" });
    
    lyricDisplay.innerText = activeLyric.text;
});
