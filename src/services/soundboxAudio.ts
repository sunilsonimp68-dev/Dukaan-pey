// Soundbox Audio & Voice Synthesis Service

export const playSoundboxChime = async (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Bell chime tone 1 (523.25 Hz - C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.5);

      // Bell chime tone 2 (Higher harmonic)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.12);
      osc2.stop(now + 0.7);

      setTimeout(() => {
        resolve();
      }, 700);
    } catch (e) {
      console.warn('AudioContext chime error:', e);
      resolve();
    }
  });
};

export const announcePaymentSoundbox = async (
  amount: number,
  language: 'hi-IN' | 'en-IN' | 'hinglish' = 'hi-IN',
  volume: number = 1.0,
  rate: number = 0.95
): Promise<void> => {
  // 1. Play signature soundbox chime
  await playSoundboxChime();

  // 2. Play voice announcement using Web Speech Synthesis
  if (!('speechSynthesis' in window)) {
    return;
  }

  // Cancel any previous utterance
  window.speechSynthesis.cancel();

  let text = '';
  let langCode = 'hi-IN';

  if (language === 'hi-IN') {
    text = `व्यापार सहायक पर ${amount} रुपये प्राप्त हुए।`;
    langCode = 'hi-IN';
  } else if (language === 'hinglish') {
    text = `Vyapar Sahayak par ${amount} Rupees prapt hue.`;
    langCode = 'hi-IN';
  } else {
    text = `Received ${amount} Rupees on Vyapar Sahayak.`;
    langCode = 'en-IN';
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = Math.max(0.1, Math.min(1.0, volume));
  utterance.rate = rate;
  utterance.pitch = 1.05;

  // Try to find a natural Hindi or Indian English voice
  const voices = window.speechSynthesis.getVoices();
  const voice =
    voices.find((v) => v.lang.startsWith(langCode.split('-')[0]) || v.lang.includes('IN')) ||
    voices.find((v) => v.lang.includes('en-GB') || v.lang.includes('en-US')) ||
    null;

  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = langCode;

  window.speechSynthesis.speak(utterance);
};
