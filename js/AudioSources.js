class AudioSources {
    constructor() {
        this.peopleTalking = document.createElement('source');
        this.peopleTalking.src = 'assets/sound/env.mp3';

        this.envMusic = document.createElement('source');
        this.envMusic.src = 'assets/sound/Rack_Em_Up_Jonny_Lang.mp3';

        this.tableHit = document.createElement('source');
        this.tableHit.src = 'assets/sound/tableHit.wav';

        this.ballBallHit = document.createElement('source');
        this.ballBallHit.src = 'assets/sound/ball_ball.mp3';

        this.ballEdgeHit = document.createElement('source');
        this.ballEdgeHit.src = 'assets/sound/ball_edge.mp3';

        this.ballFall = document.createElement('source');
        this.ballFall.src = 'assets/sound/ball_fall.mp3';
    }
}
let audioSources = new AudioSources();
