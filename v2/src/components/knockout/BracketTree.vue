<template>
  <div class="flex items-center" :class="{ 'flex-row-reverse': reverse }">
    <!-- Children -->
    <div v-if="node.children?.length" class="flex flex-col justify-around">
      <BracketTree v-for="(child, i) in node.children" :key="child.match.id"
        :node="child"
        :resolve-team="resolveTeam"
        :reverse="reverse"
        @open-detail="$emit('openDetail', $event)"
      />
    </div>

    <!-- Connector lines -->
    <div v-if="node.children?.length" class="connector relative flex-shrink-0 mx-2"
    >
      <!-- Horizontal lines from children side -->
      <div class="absolute h-px bg-gold/30 w-1/2"
           :class="reverse ? 'right-0' : 'left-0'"
           :style="{ top: node.children.length > 1 ? '25%' : '50%' }"></div>
      <div v-if="node.children.length > 1"
           class="absolute h-px bg-gold/30 w-1/2"
           :class="reverse ? 'right-0' : 'left-0'"
           style="top: 75%"></div>

      <!-- Vertical line on parent side -->
      <div v-if="node.children.length > 1"
           class="absolute top-1/4 bottom-1/4 w-px bg-gold/30"
           :class="reverse ? 'left-1/2' : 'right-1/2'"></div>

      <!-- Horizontal line to parent -->
      <div class="absolute top-1/2 w-1/2 h-px bg-gold/30"
           :class="reverse ? 'left-0' : 'right-0'"></div>
    </div>

    <!-- Match card -->
    <BracketMatch :match="node.match"
      :resolve-team="resolveTeam"
      @open-detail="$emit('openDetail', node.match)"
    />
  </div>
</template>

<script setup>
import BracketMatch from './BracketMatch.vue'

defineProps({
  node: { type: Object, required: true },
  resolveTeam: { type: Function, required: true },
  reverse: { type: Boolean, default: false },
})

defineEmits(['openDetail'])
</script>

<style scoped>
.connector {
  width: 1rem;
  height: 100%;
}
</style>
