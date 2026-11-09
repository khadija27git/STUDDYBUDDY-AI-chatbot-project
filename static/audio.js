
document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. CONNECT HTML ELEMENTS
    // =========================================

    const musicButton = document.getElementById("musicToggleBtn");
    const dropdown = document.getElementById("musicDropdown");

    const ambientToggle = document.getElementById("ambientToggle");
    const ambientControls = document.getElementById("ambientControls");
    const volumeRow = document.getElementById("ambientVolumeRow");

    const currentSound = document.getElementById("currentSound");
    const nextButton = document.getElementById("nextAmbient");
    const volumeSlider = document.getElementById("musicVolume");

    const trackList = document.getElementById("ambientTrackList");
    const audio = document.getElementById("ambientAudio");

    // Check that the required HTML exists.
    if (!musicButton || !dropdown) {
        console.error("Music button or dropdown is missing.");
        return;
    }

    if (
        !ambientToggle || !ambientControls || !volumeRow ||
        !currentSound || !nextButton || !volumeSlider ||
        !trackList || !audio
    ) {
        console.error(
            "Music player HTML is incomplete. Check the IDs in timer.html."
        );
        return;
    }

    // =========================================
    // 2. YOUR FOUR AUDIO FILES
    // =========================================
    // These paths assume the files are MP3s.
    // If their extensions differ, update the paths.
    
const sounds = [
    {
        name: "Thunder Rain",
        src: "/static/audio/thunder%20rain.mp3"
    },
    {
        name: "Summer Evening",
        src: "/static/audio/summer%20evening.mp3"
    },
    {
        name: "Fire Crackling",
        src: "/static/audio/fire%20cracking.mp3"
    },
    {
        name: "Cricket Symphony",
        src: "/static/audio/cricket%20symphony.mp3"
    }
];


    let selectedIndex = 0;

    // =========================================
    // 3. OPEN AND CLOSE THE DROPDOWN
    // =========================================

    function setDropdown(isOpen) {
        dropdown.classList.toggle("open", isOpen);

        musicButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    }

    musicButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = dropdown.classList.contains("open");
        setDropdown(!isOpen);
    });

    // Close when clicking outside the dropdown and music button.
    document.addEventListener("click", (event) => {
        if (
            !dropdown.contains(event.target) &&
            !musicButton.contains(event.target)
        ) {
            setDropdown(false);
        }
    });

    // Close with Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setDropdown(false);
        }
    });

    // Prevent clicks inside the dropdown from bubbling outside.
    dropdown.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // =========================================
    // 4. BUILD THE FOUR SOUND OPTIONS
    // =========================================

    function renderSounds() {
        trackList.replaceChildren();

        sounds.forEach((sound, index) => {
            const row = document.createElement("button");
            row.type = "button";
            row.className = "sound-track";
            row.setAttribute("aria-label", `Play ${sound.name}`);

            const number = document.createElement("span");
            number.className = "sound-number";
            number.textContent = index + 1;

            const name = document.createElement("span");
            name.textContent = sound.name;

            // const wave = document.createElement("span");
            // wave.className = "sound-wave";
            // wave.textContent = "◉";
            // wave.setAttribute("aria-hidden", "true");
            // wave.hidden = true;

            row.append(number, name);

            row.addEventListener("click", async () => {
                selectedIndex = index;
                currentSound.textContent = sound.name;

                if (ambientToggle.checked) {
                    await playSelectedSound();
                } else {
                    updateTrackHighlight();
                }
            });

            trackList.appendChild(row);
        });

        updateTrackHighlight();
    }

    // =========================================
    // 5. HIGHLIGHT THE PLAYING SOUND
    // =========================================

    function updateTrackHighlight() {
        const rows = trackList.querySelectorAll(".sound-track");

        rows.forEach((row, index) => {
            const isPlaying =
                index === selectedIndex &&
                ambientToggle.checked &&
                !audio.paused &&
                !audio.ended;

            row.classList.toggle("active", isPlaying);

            // const wave = row.querySelector(".sound-wave");

            // if (wave) {
            //     wave.hidden = !isPlaying;
            // }
        });
    }

    // =========================================
    // 6. PLAY THE SELECTED SOUND
    // =========================================

    async function playSelectedSound() {
        const sound = sounds[selectedIndex];

        if (!sound) {
            return;
        }

        currentSound.textContent = sound.name;

        // const fileURL = new URL(
        //     sound.src,
        //     document.baseURI
        // ).href;

        // // Only reload the file when changing tracks.
        // if (audio.src !== fileURL) {
        //     audio.src = sound.src;
        //     audio.load();
        // }
        const fileURL = sound.src;

// Reload only when changing tracks.
        if (audio.getAttribute("src") !== fileURL) {
            audio.src = fileURL;
            audio.load();
        }
        audio.volume = Number(volumeSlider.value);

        try {
            await audio.play();
        } catch (error) {
            console.error(
                `Unable to play "${sound.name}". Check its filename and extension.`,
                error
            );
        }

        updateTrackHighlight();
    }

    // =========================================
    // 7. AMBIENT ON / OFF
    // =========================================

    ambientToggle.addEventListener("change", async () => {
        const isEnabled = ambientToggle.checked;

        ambientControls.hidden = !isEnabled;
        volumeRow.hidden = !isEnabled;

        if (isEnabled) {
            await playSelectedSound();
        } else {
            audio.pause();
            updateTrackHighlight();
        }
    });

    // =========================================
    // 8. NEXT SOUND BUTTON
    // =========================================

    nextButton.addEventListener("click", async () => {
        selectedIndex = (selectedIndex + 1) % sounds.length;

        currentSound.textContent = sounds[selectedIndex].name;

        if (ambientToggle.checked) {
            await playSelectedSound();
        } else {
            updateTrackHighlight();
        }
    });

    // =========================================
    // 9. VOLUME CONTROL
    // =========================================

    volumeSlider.addEventListener("input", () => {
        audio.volume = Number(volumeSlider.value);
    });

    // =========================================
    // 10. KEEP THE PLAYER IN SYNC
    // =========================================

    audio.addEventListener("play", updateTrackHighlight);
    audio.addEventListener("pause", updateTrackHighlight);
    audio.addEventListener("ended", updateTrackHighlight);

    audio.addEventListener("error", () => {
        console.error(
            "Audio file failed to load:",
            audio.currentSrc
        );
    });

    // =========================================
    // 11. INITIAL STATE
    // =========================================

    audio.volume = Number(volumeSlider.value);

    ambientToggle.checked = false;
    ambientControls.hidden = true;
    volumeRow.hidden = true;

    currentSound.textContent = sounds[selectedIndex].name;

    renderSounds();
    setDropdown(false);

});