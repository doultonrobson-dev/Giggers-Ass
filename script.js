const audioPlayer = document.getElementById('audioPlayer');
const lyricDisplay = document.getElementById('lyricDisplay');
const manualArea = document.getElementById('manualInputArea');
const toggleBtn = document.getElementById('toggleManual');
const saveBtn = document.getElementById('saveManual');
const manualText = document.getElementById('manualText');
let lyrics = [];

// --- 1. Audio Loading ---
document.getElementById('audioInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
        lyricDisplay.innerText = "Audio loaded. Now add lyrics.";
    }
});

// --- 2. Lyric Loading (File) ---
document.getElementById('lyricInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        parseLyrics(event.target.result);
        lyricDisplay.innerText = "Lyrics loaded from file!";
    };
    reader.readAsText(e.target.files[0]);
});

// --- 3. Manual Entry Logic ---
toggleBtn.addEventListener('click', () => {
    manualArea.style.display = manualArea.style.display === 'none' ? 'block' : 'none';
});

saveBtn.addEventListener('click', () => {
    const textValue = manualText.value.trim();
    if (!textValue) {
        alert("Please type some lyrics first.");
        return;
    }

    parseLyrics(textValue);

    if (lyrics.length > 0) {
        manualArea.style.display = 'none';
        lyricDisplay.innerText = "Manual lyrics synced!";
    } else {
        alert("Error: No timestamps found. Use [00:00.00] format.");
    }
});

// --- 4. The Parser ---
function parseLyrics(text) {
    const lines = text.split('\n');
    lyrics = []; 

    lines.forEach(line => {
        const match = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseFloat(match[2]);
            const time = (minutes * 60) + seconds;
            const lyricText = match[3].trim();
            lyrics.push({ time, text: lyricText });
        }
    });
    
    lyrics.sort((a, b) => a.time - b.time);
}

// --- 5. Playback Synchronization ---
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    
    // Find the latest lyric that is less than or equal to current time
    const activeLyric = lyrics.reduce((prev, curr) => {
        return (curr.time <= currentTime) ? curr : prev;
    }, { text: "..." });
    
    lyricDisplay.innerText = activeLyric.text;
});
