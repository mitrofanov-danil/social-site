import { defineStore } from "pinia";
import type { Post, PostsState } from "@/types/post";

// Функция для генерации случайных постов
const generateMockPost = (index: number): Post => {
  // Чтобы использовать данный сервис с картинками, то надо включить VPN

  // const randomImagesFromPicsum =
  //   Math.random() > 0.3
  //     ? Array.from(
  //         { length: Math.floor(Math.random() * 3) + 1 },
  //         (_, i) =>
  //           `https://picsum.photos/600/${400 + Math.floor(Math.random() * 200)}?random=${index}-${i}`,
  //       )
  //     : [];

  const randomImagesWithBears =
    Math.random() > 0.3
      ? Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          () => `https://placebear.com/g/600/${400 + Math.floor(Math.random() * 200)}`,
        )
      : [];

  return {
    id: `post-${index}`,
    author: {
      id: `user-${Math.floor(Math.random() * 10)}`,
      name: `User ${Math.floor(Math.random() * 100)}`,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    },
    content: `This is post #${index}. ${Math.random() > 0.5 ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." : "Short post content."}`,
    images: randomImagesWithBears,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
    isLiked: Math.random() > 0.7,
  };
};

export const usePostsStore = defineStore("posts", {
  state: (): PostsState => ({
    posts: [],
    isLoading: false,
    hasMore: true,
    page: 1,
    error: null,
  }),

  actions: {
    async fetchPosts(reset = false) {
      if (this.isLoading || (!this.hasMore && !reset)) return;

      this.isLoading = true;
      this.error = null;

      try {
        // Имитация задержки API
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (reset) {
          this.posts = [];
          this.page = 1;
          this.hasMore = true;
        }

        // Генерируем 10 постов за раз
        const newPosts = Array.from({ length: 10 }, (_, i) =>
          generateMockPost((this.page - 1) * 10 + i),
        );

        this.posts.push(...newPosts);
        this.page++;

        // Останавливаем загрузку после 50 постов
        if (this.posts.length >= 50) {
          this.hasMore = false;
        }
      } catch (error) {
        this.error = "Failed to load posts";
        console.error("Error fetching posts:", error);
      } finally {
        this.isLoading = false;
      }
    },

    toggleLike(postId: string) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
    },
  },
});
