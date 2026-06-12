<template>
  <div>
    <StadiumLightBeam v-for="(beam, i) in beams" :key="i"
      :pos="beam.pos" :delay="beam.delay" :height="beam.height" />
  </div>
</template>

<script setup>
import StadiumLightBeam from './StadiumLightBeam.vue'

const beams = [
  { pos: 20, delay: 0, height: 300 },
  { pos: 40, delay: 1, height: 250 },
  { pos: 60, delay: 2, height: 280 },
  { pos: 80, delay: 0.5, height: 220 },
  { pos: 30, delay: 1.5, height: 260 },
  { pos: 70, delay: 3, height: 240 },
]
</script>
