<template>
  <Player :src="sound" />
  <div class="sounds">
    <button
      :class="{selected: sound === s}"
      v-for="s in sounds"
      :key="s"
      @click="playSound(s)"
    >
      {{ s }}
    </button>
  </div>
</template>

<script>
import Player from './components/Player.vue';

export default {
  name: 'App',
  components: {
    Player,
  },
  methods: {
    playSound: function(s) {
      this.sound = s;
    },
  },
  mounted() {
    this.sound = this.sounds[0];
  },
  data: function() {
    return {
      sound: null,
      sounds: [
        'ahem_x.wav',
        'air_raid.wav',
        'airplane_chime_x.wav',
        'alarm_beep.wav',
        'applause_y.wav',
        'arrow_x.wav',
        'baby_x.wav',
        'bicycle_bell.wav',
        'blip.wav',
        'bloop_x.wav',
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.sounds {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.sounds button {
  margin: 0.5rem;
}
.sounds button.selected {
  background-color: #ccc;
}
</style>
