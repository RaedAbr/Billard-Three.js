class OneShotAudio {
    constructor(src, volume = 1) {
        this.audio = document.createElement('audio');
        this.audio.appendChild(src);
        this.audio.volume = volume;
        this.audio.play();
    }
}
