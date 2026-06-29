<template>
  <div class="flex flex-col items-center" :class="{ 'flex-col-reverse': downward }">
    <!-- Children row -->
    <div v-if="node.children?.length" class="flex justify-around w-full"
    >
      <BracketTree v-for="(child, i) in node.children" :key="child.match.id"
        :node="child"
        :resolve-team="resolveTeam"
        :downward="downward"
        @open-detail="$emit('openDetail', $event)"
      />
    </div>

    <!-- Connector lines -->
    <div v-if="node.children?.length" class="connector relative w-full h-8"
    >
      <div class="absolute w-px bg-gold/30"
           :class="downward ? 'top-1/2 bottom-0' : 'top-0 bottom-1/2'"
           :style="{ left: '25%' }"></div>
      <div class="absolute w-px bg-gold/30"
           :class="downward ? 'top-1/2 bottom-0' : 'top-0 bottom-1/2'"
           :style="{ left: '75%' }"></div>
      <div class="absolute left-1/4 right-1/4 h-px bg-gold/30"
           :class="downward ? 'bottom-1/2' : 'top-1/2'"></div>
      <div class="absolute left-1/2 w-px bg-gold/30"
           :class="downward ? 'top-0 bottom-1/2' : 'top-1/2 bottom-0'"></div>
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
  downward: { type: Boolean, default: false },
})

defineEmits(['openDetail'])
</script>

<style scoped>
.connector {
  max-width: 100%;
}
</style>
