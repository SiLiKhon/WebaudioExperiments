import Slider from "../gui/slider.js";

const NOTES = [
    1, 5 / 4, 3 / 2, 2, 5 / 2, 3, 4, 5, 6, 8
];

class MainScene extends Phaser.Scene {
    async create() {
        this.freq_slider = new Slider(this, 50, 500, 100, 200, 700, 60, 60, "Base freq");
        this.vol_slider = new Slider(this, 0, 1, 0.25, 200, 700, 100, 100, "Volume");
        this.atk_slider = new Slider(this, 0, 500, 50, 200, 700, 140, 140, "Atk");
        this.rel_slider = new Slider(this, 0, 500, 50, 200, 700, 180, 180, "Release");
        this.len_slider = new Slider(this, 0, 1000, 100, 200, 700, 220, 220, "Note length");

        this.input.keyboard.on("keydown", this.keyHandler, this);
        this.audioCtx = new window.AudioContext();
        await this.audioCtx.audioWorklet.addModule('./src/audio/limiter.js');
        this.limiter = new AudioWorkletNode(
            this.audioCtx, "bw_limiter", {outputChannelCount: [1]}
        );
        this.limiter.connect(this.audioCtx.destination);

        this.add.text(100, 300, "Hit keys on the keyboard to play sounds.\nKey codes are mapped to notes that are the following\nmutiples of the base frequency:\n" + NOTES);
    }

    keyHandler(evt) {
        var osc = this.audioCtx.createOscillator();
        var gain = this.audioCtx.createGain();
        var note = NOTES[(evt.keyCode % NOTES.length)];

        osc.frequency.value = this.freq_slider.value * note;
        osc.type = "sawtooth";

        var atk = this.atk_slider.value / 1000;
        var len = this.len_slider.value / 1000;
        var rel = this.rel_slider.value / 1000;

        osc.connect(gain).connect(this.limiter);
        osc.start(this.audioCtx.currentTime + 0.005);
        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(this.vol_slider.value, this.audioCtx.currentTime + atk);
        gain.gain.setValueAtTime(this.vol_slider.value, this.audioCtx.currentTime + atk + len);
        gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + atk + len + rel);
        osc.stop(this.audioCtx.currentTime + atk + len + rel + 0.005);

        // console.log(evt.keyCode);
    }
};

export default MainScene;
