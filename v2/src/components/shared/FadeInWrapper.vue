<template>
  <div ref="el" :class="{ visible: isVisible }" class="fade-in">
    <slot />
  </div>
</template>

<script setup>
import { useScrollAnimation } from '../../composables/useScrollAnimation'
const { el, isVisible } = useScrollAnimation()
</script>
