class BWLimiterJS extends AudioWorkletProcessor {
    constructor(options) {
        super();
        // console.log("limiter channels: ", options.outputChannelCount[0]);
        this.envelope_state = (new Array(options.outputChannelCount[0])).fill(0);
        // console.log("env: ", this.envelope_state);
        // console.log(sampleRate);
        this.rel_len = sampleRate * 0.1;
        this.rel_gain = Math.exp(-1.0 / this.rel_len);
        this.thr_db = 0.0;
        this.thr_amp = Math.pow(10, this.thr_db / 20);
    }
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        for (let i_ch = 0; i_ch < input.length; i_ch++) {
            for (let i_sample = 0; i_sample < input[i_ch].length; i_sample++) {
                var env_in = Math.abs(input[i_ch][i_sample])
                if (this.envelope_state[i_ch] < env_in ) {
                    this.envelope_state[i_ch] = env_in;
                } else {
                    this.envelope_state[i_ch] = env_in + this.rel_gain * (this.envelope_state[i_ch] - env_in);
                }
                output[i_ch][i_sample] = input[i_ch][i_sample] * Math.min(1.0, this.thr_amp / this.envelope_state[i_ch]);
            }
        }
        return true;
    }
};

registerProcessor("bw_limiter", BWLimiterJS);
