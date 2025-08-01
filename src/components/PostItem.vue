<template>
  <article class="post-card">
    <header class="post-card__header">
      <img :src="post.author.avatar" :alt="post.author.name" class="post-card__avatar" />
      <div class="post-card__author">
        <h3 class="post-card__author-name">{{ post.author.name }}</h3>
        <time class="post-card__time">{{ formatTime(post.createdAt) }}</time>
      </div>
    </header>

    <div class="post-card__content">
      <p class="post-card__text">{{ post.content }}</p>
    </div>

    <div
      v-if="post.images.length > 0"
      class="post-card__images"
      :class="`post-card__images--count-${post.images.length}`"
    >
      <img
        v-for="(image, index) in post.images"
        :key="index"
        :src="image"
        :alt="`Post image ${index + 1}`"
        class="post-card__image"
        @click="openImage(image)"
      />
    </div>

    <footer class="post-card__footer">
      <button
        class="post-card__action"
        :class="{ 'post-card__action--liked': post.isLiked }"
        @click="handleLike"
      >
        <span class="post-card__action-icon">{{ post.isLiked ? "❤️" : "🤍" }}</span>
        <span class="post-card__action-count">{{ post.likes }}</span>
      </button>

      <button class="post-card__action">
        <span class="post-card__action-icon">💬</span>
        <span class="post-card__action-count">{{ post.comments }}</span>
      </button>

      <button class="post-card__action">
        <span class="post-card__action-icon">📤</span>
        <span class="post-card__action-text">Поделиться</span>
      </button>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { Post } from "@/types/post";
import { usePostsStore } from "@/stores/posts";

interface Props {
  post: Post;
}

const props = defineProps<Props>();
const postsStore = usePostsStore();

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}м назад`;
  } else if (hours < 24) {
    return `${hours}ч назад`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days}д назад`;
  }
};

const handleLike = () => {
  postsStore.toggleLike(props.post.id);
};

const openImage = (imageUrl: string) => {
  window.open(imageUrl, "_blank");
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/bem-utils" as *;

.post-card {
  background: $color-white;
  border-radius: $border-radius-md;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: $spacing-md;
  overflow: hidden;

  @include element(header) {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    gap: $spacing-md - 4px;
  }

  @include element(avatar) {
    width: 48px;
    height: 48px;
    border-radius: $border-radius-full;
    object-fit: cover;
  }

  @include element(author) {
    flex: 1;
  }

  @include element(author-name) {
    font-size: $font-size-base;
    font-weight: 600;
    color: $color-text-primary;
  }

  @include element(time) {
    font-size: $font-size-sm - 1px;
    color: $color-text-secondary;
  }

  @include element(content) {
    padding: 0 $spacing-md $spacing-md;
  }

  @include element(text) {
    font-size: $font-size-base - 1px;
    line-height: 1.5;
    color: $color-text-primary;
    white-space: pre-wrap;
  }

  @include element(images) {
    display: grid;
    gap: 2px;

    @include modifier(count-1) {
      grid-template-columns: 1fr;
    }

    @include modifier(count-2) {
      grid-template-columns: 1fr 1fr;
    }

    @include modifier(count-3) {
      grid-template-columns: 1fr 1fr;

      .post-card__image:first-child {
        grid-column: 1 / -1;
      }
    }
  }

  @include element(image) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.95;
    }
  }

  @include element(footer) {
    display: flex;
    padding: $spacing-sm $spacing-md;
    border-top: 1px solid $color-border;
    gap: $spacing-xs;
  }

  @include element(action) {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm - 2px;
    padding: $spacing-sm;
    background: none;
    border: none;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-background;
    }

    @include modifier(liked) {
      color: #e41e3f;
    }
  }

  @include element(action-icon) {
    font-size: $font-size-lg;
  }

  @include element(action-count) {
    font-weight: 600;
  }

  @include element(action-text) {
    font-weight: 600;
  }

  @include mobile {
    border-radius: 0;
    margin-bottom: $spacing-sm;

    @include element(header) {
      padding: $spacing-md - 4px;
    }

    @include element(content) {
      padding: 0 $spacing-md - 4px $spacing-md - 4px;
    }
  }
}
</style>
