const audioPlayer = document.getElementById('audioPlayer');
const lyricDisplay = document.getElementById('lyricDisplay');
const trackName = document.getElementById('trackName');
const googleBtn = document.getElementById('googleSearch');
let lyrics = [];
let currentFileName = "";

// 1. Load MP3
document.getElementById('audioInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        currentFileName = file.name.replace(/\.[^/.]+$/, ""); // Strip extension
        audioPlayer.src = URL.createObjectURL(file);
        trackName.innerText = currentFileName.toUpperCase();
        lyricDisplay.innerText = "AUDIO LOADED. NOW ADD LYRICS.";
    }
});

// 2. Google Search Button
googleBtn.onclick = () => {
    // Search for the song name + 'LRC' so you find timestamped versions
    const query = currentFileName ? encodeURIComponent(currentFileName + " LRC lyrics") : "LRC+lyrics+template";
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
};

// 3. Manual Toggle & Save
document.getElementById('toggleManual').onclick = () => {
    document.getElementById('manualInputArea').style.display = 'block';
};

document.getElementById('saveManual').onclick = () => {
    const text = document.getElementById('manualText').value;
    parseLyrics(text);
    document.getElementById('manualInputArea').style.display = 'none';
};

// 4. The Sync Logic
function parseLyrics(text) {
    lyrics = text.split('\n').map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            return { 
                time: parseInt(match[1]) * 60 + parseFloat(match[2]), 
                text: match[3].trim() 
            };
        }
        return null;
    }).filter(l => l !== null).sort((a,b) => a.time - b.time);
    
    if (lyrics.length > 0) lyricDisplay.innerText = "LYRICS READY";
    else alert("No timestamps found! Ensure you use [00:00.00] format.");
}

audioPlayer.addEventListener('timeupdate', () => {
    const active = lyrics.reduce((prev, curr) => (curr.time <= audioPlayer.currentTime ? curr : prev), { text: "..." });
    if(lyricDisplay.innerText !== active.text) {
        lyricDisplay.innerText = active.text;
    }
});
