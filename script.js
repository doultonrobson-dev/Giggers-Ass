const audioPlayer = document.getElementById('audioPlayer');
const lyricDisplay = document.getElementById('lyricDisplay');
const manualArea = document.getElementById('manualInputArea');
const toggleBtn = document.getElementById('toggleManual');
const saveBtn = document.getElementById('saveManual');
const manualText = document.getElementById('manualText');
const audioInput = document.getElementById('audioInput');
const lyricInput = document.getElementById('lyricInput');

let lyrics = [];

// --- 1. Load Audio (MP3) ---
audioInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
        lyricDisplay.innerText = "Audio loaded! Now add some lyrics.";
    }
});

// --- 2. Load Lyrics (From File) ---
lyricInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            parseLyrics(event.target.result);
            if (lyrics.length > 0) {
                lyricDisplay.innerText = "Lyrics file synced successfully!";
            }
        };
        reader.readAsText(file);
    }
});

// --- 3. Manual Entry Controls ---
toggleBtn.addEventListener('click', () => {
    manualArea.style.display = manualArea.style.display === 'none' ? 'block' : 'none';
});

saveBtn.addEventListener('click', () => {
    const content = manualText.value.trim();
    if (!content) {
        alert("The box is empty! Please type your lyrics.");
        return;
    }

    parseLyrics(content);

    if (lyrics.length > 0) {
        manualArea.style.display = 'none';
        lyricDisplay.innerText = "Manual lyrics ready to play!";
    } else {
        alert("Formatting Error: I couldn't find any timestamps. Make sure every line starts like [00:12.00]");
    }
});

// --- 4. The Sync Engine ---
function parseLyrics(text) {
    const lines = text.split('\n');
    lyrics = []; 

    lines.forEach(line => {
        // Looking for [minutes:seconds]
        const match = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
        if (match) {
            const time = (parseInt(match[1]) * 60) + parseFloat(match[2]);
            const lyricText = match[3].trim();
            lyrics.push({ time, text: lyricText });
        }
    });
    
    lyrics.sort((a, b) => a.time - b.time);
}

// Update lyrics as the music plays
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const activeLyric = lyrics.reduce((prev, curr) => {
        return (curr.time <= currentTime) ? curr : prev;
    }, { text: "..." });
    
    lyricDisplay.innerText = activeLyric.text;
});
