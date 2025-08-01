<template>
  <div class="feed">
    <div class="feed__content">
      <div v-if="posts.length === 0 && !isLoading" class="feed__empty">
        <p class="feed__empty-text">
          Пока нет публикаций. Подпишитесь на пользователей, чтобы видеть их публикации!
        </p>
      </div>

      <TransitionGroup name="post" tag="div">
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
      </TransitionGroup>

      <div v-if="isLoading" class="feed__loader">
        <div class="feed__loader-spinner"></div>
        <p class="feed__loader-text">Загрузка постов...</p>
      </div>

      <div v-if="!hasMore && posts.length > 0" class="feed__end">
        <p class="feed__end-text">Вы дошли до конца! 🎉</p>
      </div>

      <div v-if="error" class="feed__error">
        <p class="feed__error-text">{{ error }}</p>
        <button @click="retry" class="feed__retry-button">Попробуйте еще раз</button>
      </div>

      <div ref="trigger"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { usePostsStore } from "@/stores/posts";
import PostItem from "./PostItem.vue";

const postsStore = usePostsStore();
const { posts, isLoading, hasMore, error } = storeToRefs(postsStore);

const trigger = ref<HTMLElement>();
let observer: IntersectionObserver | null = null;

const retry = () => {
  postsStore.fetchPosts(true);
};

const setupObserver = () => {
  const options = {
    root: null,
    rootMargin: "100px",
    threshold: 0.1,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isLoading.value && hasMore.value) {
        postsStore.fetchPosts();
      }
    });
  }, options);

  if (trigger.value) {
    observer.observe(trigger.value);
  }
};

onMounted(() => {
  postsStore.fetchPosts(true);
  setupObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/bem-utils";
.feed {
  height: 100vh;
  overflow-y: auto;
  background-color: $color-background;

  @include element(content) {
    max-width: 600px;
    margin: 0 auto;
    padding: $spacing-lg - 4px $spacing-md;
  }

  @include element(empty) {
    text-align: center;
    padding: $spacing-xxl + 12px $spacing-lg - 4px;
  }

  @include element(empty-text) {
    margin: 0;
    color: $color-text-secondary;
    font-size: $font-size-base;
  }

  @include element(loader) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xl + 8px 0;
  }

  @include element(loader-spinner) {
    width: 40px;
    height: 40px;
    margin-bottom: $spacing-md;
    border: 3px solid $color-background;
    border-top-color: $color-primary;
    border-radius: $border-radius-full;
    animation: feed__spin 0.8s linear infinite;
  }

  @include element(loader-text) {
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }

  @include element(end) {
    text-align: center;
    padding: $spacing-xl + 8px $spacing-lg - 4px;
  }

  @include element(end-text) {
    font-size: $font-size-base;
    color: $color-text-secondary;
  }

  @include element(error) {
    text-align: center;
    padding: $spacing-xl + 8px $spacing-lg - 4px;
  }

  @include element(error-text) {
    margin: 0 0 $spacing-md;
    color: $color-error;
    font-size: $font-size-base;
  }

  @include element(retry-button) {
    padding: $spacing-sm $spacing-lg;
    background-color: $color-primary;
    color: $color-white;
    border: none;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-primary-hover;
    }
  }

  @include mobile {
    @include element(content) {
      padding: 0;
    }
  }
}

// Анимации
@keyframes feed__spin {
  to {
    transform: rotate(360deg);
  }
}

.post-enter-active,
.post-leave-active {
  transition: all 0.3s ease;
}

.post-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.post-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
