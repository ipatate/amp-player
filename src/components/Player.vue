<template>
  <audio ref="player">
    <source :src="sound" type="audio/wav" />
  </audio>
  <div>
    <button @click="play">Play</button>
    <button @click="pause">Pause</button>
  </div>
  <div class="info">
    <div>{{ currentTime }}</div>
    <input
      type="range"
      @change="updateSound"
      v-model="currentPosition"
      ref="slider"
      step="1"
    />
    <div>
      {{ duration.minutes !== 0 ? `${duration.minutes}min:` : ''
      }}{{ duration.seconds !== 0 ? `${duration.seconds}sec` : '' }}
    </div>
  </div>
</template>

<script>
// https://gist.githubusercontent.com/lukewduncan/3e041e4b22a50855f9faaf01dec40137/raw/4565e193c2dbe6bfcbed7264d5a6a3f10991b9a2/audio-player.js
const calculateTotalValue = length => {
  const minutes = Math.floor(length / 60);
  //   const seconds = +(length - minutes * 60)
  //     .toString()
  //     .substr(0, 2)
  //     .replace('.', '');
  const seconds = +(length - minutes * 60).toFixed(1);
  return {minutes, seconds};
};

const calculateCurrentValue = currentTime => {
  // var current_hour = parseInt(currentTime / 3600) % 24,
  const current_minute = parseInt(currentTime / 60) % 60;
  const current_seconds_long = currentTime % 60;
  const current_seconds = current_seconds_long.toFixed();
  const current_time =
    (current_minute < 10 ? '0' + current_minute : current_minute) +
    ':' +
    (current_seconds < 10 ? '0' + current_seconds : current_seconds);

  return current_time;
};
export default {
  name: 'Player',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      currentPosition: 0,
      currentTime: 0,
      duration: {},
    };
  },
  mounted() {
    this.$refs.player.addEventListener('loadeddata', this.onCanPlay);
    this.$refs.player.addEventListener('play', this.onPlay);
    this.$refs.player.addEventListener('timeupdate', this.onProgress);
    this.currentTime = calculateCurrentValue(0);
  },
  computed: {
    sound: function() {
      return this.src ? require(`../sound/${this.src}`) : null;
    },
  },
  watch: {
    sound: function() {
      this.$refs.player.load();
    },
  },
  methods: {
    updateSound: function(e) {
      const {value} = e.currentTarget;
      this.$refs.player.currentTime =
        (value * this.$refs.player.duration) / 100;
      this.currentTime = calculateCurrentValue(this.$refs.player.currentTime);
      if (!this.$refs.player.paused) this.$refs.player.play();
    },
    onCanPlay: function() {
      this.duration = calculateTotalValue(this.$refs.player.duration);
      this.currentTime = calculateCurrentValue(0);
      this.currentPosition = 0;
    },
    onPlay: function() {
      calculateTotalValue(this.$refs.player.duration);
    },
    onProgress: function() {
      this.currentTime = calculateCurrentValue(this.$refs.player.currentTime);
      this.currentPosition =
        (this.$refs.player.currentTime / this.$refs.player.duration) * 100;
    },
    play: function() {
      if (this.$refs.player.paused) {
        this.$refs.player.play();
      }
    },
    pause: function() {
      if (!this.$refs.player.paused) {
        this.$refs.player.pause();
      }
    },
  },
};
</script>
<style>
/** https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/
https://nosmoking.developpez.com/demos/css/range-slider-custom.html
 **/
.info {
  display: flex;
}
.info input[type='range'] {
  flex: 1;
  -webkit-appearance: none; /*nécessaire pour Chrome */
  padding: 0; /* nécessaire pour IE */
  font: inherit; /* même rendu suivant font document */
  outline: none;
  color: #069; /* sert pour couleur de référence, via currentColor, pour le curseur */
  opacity: 0.8;
  background: #ccc; /* sert pour couleur de fond de la zone de déplacement */
  box-sizing: border-box; /* même modèle de boîte pour tous */
  transition: opacity 0.2s;
  cursor: pointer;
}

/* la zone de déplacement */
input[type='range']::-ms-track {
  height: 100%;
  border: none;
  border-radius: 0;
  color: transparent; /* supprime les graduations pour IE */
  background-color: transparent; /* supprimé définie sur l'input */
}
/* le curseur */
input[type='range']::-ms-thumb {
  width: 1em;
  height: inherit; /* s'adapte à la hauteur de l'input */
  border: none; /* supprimer la bordure */
  border-radius: 0; /* supprimer le rayon */
  background: currentColor;
}
/* la tooltip de la valeur */
input[type='range']::-ms-tooltip {
  display: none; /* supprime l'affichage de la valeur au survol */
}
/* barre progression avant */
input[type='range']::-ms-fill-lower {
  background: transparent;
}
/* barre progression après */
input[type='range']::-ms-fill-upper {
  background: transparent;
}
/* la zone de déplacement */
input[type='range']::-moz-range-track {
  height: 100%;
  border: none;
  border-radius: 0;
  background-color: transparent; /* supprimé définie sur l'input */
}
/* le curseur */
input[type='range']::-moz-range-thumb {
  width: 1em;
  height: 20px; /* s'adapte à la hauteur de l'input */
  border: none; /* supprimer la bordure */
  border-radius: 0; /* supprimer le rayon */
  background: yellow;
}
/* barre progression avant */
input[type='range']::-moz-range-progress {
  height: 0;
  background: transparent; /* supprime barre progression avant */
}
/* la zone de déplacement */
input[type='range']::-webkit-slider-runnable-track {
  height: 100%;
  border: none;
  border-radius: 0;
  background-color: transparent; /* supprimé définie sur l'input */
}
/* le curseur */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none; /* également nécessaire sur le curseur */
  width: 1em;
  height: inherit; /* s'adapte à la hauteur de l'input */
  border: none;
  border-radius: 0; /* pris en compte sur Webkit et Edge */
  background: currentColor; /* pris en compte sur Webkit only */
}
</style>
