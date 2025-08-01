<template>
  <header class="page-header">
    <h1 class="page-header__title">Социальная лента</h1>
    <button
      @click="refreshFeed"
      class="page-header__refresh-button"
      :class="{ 'page-header__refresh-button--loading': isLoading }"
      :disabled="isLoading"
    >
      <span
        class="page-header__refresh-icon"
        :class="{ 'page-header__refresh-icon--rotating': isLoading }"
        >🔄</span
      >
      <span class="page-header__refresh-text">Обновить</span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostsStore } from "@/stores/posts";

const postsStore = usePostsStore();
const { isLoading } = storeToRefs(postsStore);

const refreshFeed = () => {
  postsStore.fetchPosts(true);
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/bem-utils" as *;

.page-header {
  background: white;
  border-bottom: 1px solid #e4e6eb;
  padding: $spacing-md $spacing-md + 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  @include element(title) {
    font-size: $font-size-xl;
    color: $color-text-primary;
  }

  @include element(refresh-button) {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: $color-primary;
    color: $color-white;
    border: none;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: $color-primary-hover;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  @include element-modifier(refresh-button, loading) {
    background-color: $color-text-secondary;
  }

  @include element(refresh-button) {
    display: inline-block;
    font-size: $font-size-base;
  }

  @include element-modifier(refresh-icon, rotating) {
    animation: page-header__rotate 1s linear infinite;
  }

  @include mobile {
    padding: 12px 16px;

    @include element(title) {
      font-size: 20px;
    }

    @include element(refresh-button) {
      padding: 6px 12px;
      font-size: 13px;
    }
  }
}

@keyframes page-header__rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
