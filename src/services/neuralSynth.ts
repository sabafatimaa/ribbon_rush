/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class NeuralSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isStarted = false;
  private intervalId: NodeJS.Timeout | null = null;
  private currentStep = 0;
  private bpms = 120;

  private scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77]; // C Major Higher Octave

  constructor() {}

  public async start() {
    if (this.isStarted) return;
    
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.12;
    
    this.isStarted = true;
    this.playLoop();
  }

  public stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.ctx) {
      this.ctx.close();
    }
    this.isStarted = false;
  }

  private playLoop() {
    const stepTime = (60 / this.bpms) / 1; // Slower, more melodic
    this.intervalId = setInterval(() => {
      this.tick();
    }, stepTime * 1000);
  }

  private tick() {
    if (!this.ctx || !this.masterGain) return;

    // Music box pluck - Sine wave with long decay
    if (this.currentStep % 2 === 0) {
      // Create a more structured "girlish" melody
      const patterns = [
        [0, 4, 7, 12], // Major arpeggio
        [0, 2, 4, 7], // Pentatonic
        [5, 9, 12, 17], // Subdominant feel
      ];
      const pattern = patterns[Math.floor(this.currentStep / 8) % patterns.length]; 
      const scaleIndex = pattern[Math.floor(Math.random() * pattern.length)];
      const freq = this.scale[0] * Math.pow(2, scaleIndex / 12);
      this.playNote(freq, 1.5, 'sine');
    }

    // High sparkle pluck
    if (this.currentStep % 4 === 2 && Math.random() > 0.5) {
      const sparkleIndex = [12, 16, 19, 24][Math.floor(Math.random() * 4)];
      const freq = this.scale[0] * Math.pow(2, sparkleIndex / 12);
      this.playNote(freq, 0.8, 'sine');
    }

    this.currentStep = (this.currentStep + 1) % 16;
  }

  public playFoodSound() {
    if (!this.ctx || !this.masterGain) return;
    this.playNote(this.scale[4] * 2, 0.5, 'sine');
  }

  private playNote(freq: number, duration: number, type: OscillatorType) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    env.gain.setValueAtTime(0, this.ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(env);
    env.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  private playNoise(duration: number) {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.1, this.ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    whiteNoise.start();
    whiteNoise.stop(this.ctx.currentTime + duration);
  }
}

export const neuralSynth = new NeuralSynth();
