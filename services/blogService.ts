import { BlogPost } from '../types';
import { sql } from '@/src/lib/db';

export const blogService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    try {
      // Fetch only necessary columns for the list view to avoid large payload errors
      const posts = await sql`
        SELECT id, title, excerpt, date, category, image, author, created_at 
        FROM posts 
        ORDER BY created_at DESC
      `;
      return posts as unknown as BlogPost[];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  getPostById: async (id: string): Promise<BlogPost | undefined> => {
    try {
      // Exclude heavy columns (pdf, images) from initial load
      const posts = await sql`
        SELECT id, title, excerpt, content, date, category, image, author, created_at 
        FROM posts 
        WHERE id = ${id}
      `;
      return posts[0] as unknown as BlogPost | undefined;
    } catch (error) {
      console.error('Error fetching post by id:', error);
      return undefined;
    }
  },

  getPostImages: async (id: string): Promise<string[]> => {
    try {
      const result = await sql`SELECT images FROM posts WHERE id = ${id}`;
      return result[0]?.images || [];
    } catch (error) {
      console.error('Error fetching post images:', error);
      return [];
    }
  },

  getPostPdf: async (id: string): Promise<string | null> => {
    try {
      const result = await sql`SELECT pdf FROM posts WHERE id = ${id}`;
      return result[0]?.pdf || null;
    } catch (error) {
      console.error('Error fetching post pdf:', error);
      return null;
    }
  },

  createPost: async (post: Omit<BlogPost, 'id' | 'date' | 'author'>): Promise<BlogPost> => {
    try {
      console.log('Starting post creation...');
      const id = crypto.randomUUID();
      const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      const author = "Dra. Bianca Amaral";
      
      console.log('Sending data to Neon DB...', { id, title: post.title, imageSize: post.image?.length });

      const [newPost] = await sql`
        INSERT INTO posts (id, title, excerpt, content, date, category, image, images, pdf, author)
        VALUES (${id}, ${post.title}, ${post.excerpt}, ${post.content}, ${date}, ${post.category}, ${post.image}, ${post.images || []}, ${post.pdf || null}, ${author})
        RETURNING *
      `;
      
      console.log('Post created successfully:', newPost.id);
      return newPost as unknown as BlogPost;
    } catch (error) {
      console.error('Error creating post in blogService:', error);
      throw error;
    }
  },

  updatePost: async (id: string, updatedData: Partial<BlogPost>): Promise<BlogPost | null> => {
    try {
      const existing = await blogService.getPostById(id);
      if (!existing) return null;
      
      const finalData = { ...existing, ...updatedData };
      
      const [updated] = await sql`
        UPDATE posts 
        SET title = ${finalData.title}, 
            excerpt = ${finalData.excerpt}, 
            content = ${finalData.content}, 
            category = ${finalData.category}, 
            image = ${finalData.image},
            images = ${finalData.images || []},
            pdf = ${finalData.pdf || null},
            date = ${finalData.date},
            author = ${finalData.author}
        WHERE id = ${id}
        RETURNING *
      `;
      return updated as unknown as BlogPost;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  deletePost: async (id: string): Promise<boolean> => {
    try {
      const result = await sql`DELETE FROM posts WHERE id = ${id} RETURNING id`;
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  },

  addSubscriber: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO subscribers (id, email)
        VALUES (${id}, ${email})
      `;
      return { success: true, message: 'Inscrição realizada com sucesso!' };
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'Este e-mail já está cadastrado.' };
      }
      console.error('Error adding subscriber:', error);
      return { success: false, message: 'Erro ao processar inscrição.' };
    }
  },

  getAllSubscribers: async (): Promise<{ id: string; email: string; created_at: string }[]> => {
    try {
      const subscribers = await sql`
        SELECT id, email, created_at 
        FROM subscribers 
        ORDER BY created_at DESC
      `;
      return subscribers as any;
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }
};
