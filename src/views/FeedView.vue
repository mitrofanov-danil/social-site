<template>
  <div class="feed-page">
    <Headers />
    <PostFeed />
  </div>
</template>

<script setup lang="ts">
import PostFeed from "@/components/PostFeed.vue";
import Headers from "@/components/TheHeaders.vue";
</script>

<style lang="scss" scoped>
.feed-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
