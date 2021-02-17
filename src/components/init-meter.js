import createAudioMeter from './volume-meter';

let canvasContext;
let audioContext;
let track;
let meter;
const WIDTH = 500;
const HEIGHT = 50;

export const initCanvaMeter = (meterContext, player) => {
  // canva
  canvasContext = meterContext.getContext('2d');
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
  track = audioContext.createMediaElementSource(player);
  meter = createAudioMeter(audioContext);
  track.connect(meter);
  track.connect(audioContext.destination);
};

export const drawLoop = () => {
  // clear the background
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  // check if we're currently clipping
  if (meter.checkClipping()) canvasContext.fillStyle = 'red';
  else canvasContext.fillStyle = 'green';

  // draw a bar based on the current volume
  canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

  // set up the next visual callback
  window.requestAnimationFrame(drawLoop);
};
