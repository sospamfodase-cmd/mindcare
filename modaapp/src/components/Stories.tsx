import React, { useEffect, useState, useRef } from 'react';
import api from '../lib/api';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { useAuthStore } from '../store/authStore';

interface Story {
  id: string;
  image_url: string;
  created_at: string;
}

interface UserStories {
  user_id: string;
  username: string;
  avatar_url?: string;
  stories: Story[];
}

export const Stories = () => {
  const [stories, setStories] = useState<UserStories[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<{userIndex: number, storyIndex: number} | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await api.get('/stories');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleCreateStory = async (base64: string) => {
      if (!base64) return;
      try {
          await api.post('/stories', { image_url: base64 });
          setIsCreateOpen(false);
          fetchStories();
      } catch (error) {
          console.error('Error creating story:', error);
      }
  };

  const openStory = (userIndex: number) => {
      setActiveStoryIndex({ userIndex, storyIndex: 0 });
  };

  const nextStory = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!activeStoryIndex) return;
      
      const currentUserStories = stories[activeStoryIndex.userIndex].stories;
      
      if (activeStoryIndex.storyIndex < currentUserStories.length - 1) {
          setActiveStoryIndex({ 
              ...activeStoryIndex, 
              storyIndex: activeStoryIndex.storyIndex + 1 
          });
      } else if (activeStoryIndex.userIndex < stories.length - 1) {
          setActiveStoryIndex({ 
              userIndex: activeStoryIndex.userIndex + 1, 
              storyIndex: 0 
          });
      } else {
          setActiveStoryIndex(null);
      }
  };

  const prevStory = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!activeStoryIndex) return;
      
      if (activeStoryIndex.storyIndex > 0) {
          setActiveStoryIndex({ 
              ...activeStoryIndex, 
              storyIndex: activeStoryIndex.storyIndex - 1 
          });
      } else if (activeStoryIndex.userIndex > 0) {
          const prevUserStories = stories[activeStoryIndex.userIndex - 1].stories;
          setActiveStoryIndex({ 
              userIndex: activeStoryIndex.userIndex - 1, 
              storyIndex: prevUserStories.length - 1 
          });
      } else {
          setActiveStoryIndex(null);
      }
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer" onClick={() => setIsCreateOpen(true)}>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                  <Plus size={24} className="text-gray-400" />
                  <div className="absolute bottom-0 right-0 bg-black text-white rounded-full p-0.5 border-2 border-white">
                      <Plus size={10} />
                  </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Seu story</span>
          </div>

          {/* Story List */}
          {stories.map((userStory, idx) => (
              <div key={userStory.user_id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer" onClick={() => openStory(idx)}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px] hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-full bg-white p-[2px]">
                          {userStory.avatar_url ? (
                              <img src={userStory.avatar_url} className="w-full h-full rounded-full object-cover" />
                          ) : (
                              <div className="w-full h-full rounded-full bg-gray-200" />
                          )}
                      </div>
                  </div>
                  <span className="text-xs text-gray-500 truncate w-16 text-center">{userStory.username}</span>
              </div>
          ))}
      </div>

      {/* Create Story Modal */}
      {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">
                  <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-black">
                      <X size={24} />
                  </button>
                  <h3 className="text-lg font-bold mb-4 text-center">Novo Story</h3>
                  <ImageUpload onImageSelected={handleCreateStory} label="Tirar ou escolher foto" />
              </div>
          </div>
      )}

      {/* Story Viewer */}
      {activeStoryIndex && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setActiveStoryIndex(null)}>
              <div className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-2xl overflow-hidden bg-gray-900" onClick={e => e.stopPropagation()}>
                  {/* Progress Bar */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
                      {stories[activeStoryIndex.userIndex].stories.map((_, idx) => (
                          <div key={idx} className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-white transition-all duration-300 ${idx < activeStoryIndex.storyIndex ? 'w-full' : idx === activeStoryIndex.storyIndex ? 'w-full' : 'w-0'}`}
                              />
                          </div>
                      ))}
                  </div>

                  {/* Header */}
                  <div className="absolute top-8 left-4 z-10 flex items-center gap-3 text-white">
                       <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {stories[activeStoryIndex.userIndex].avatar_url && (
                              <img src={stories[activeStoryIndex.userIndex].avatar_url} className="w-full h-full object-cover" />
                          )}
                       </div>
                       <span className="font-semibold">{stories[activeStoryIndex.userIndex].username}</span>
                       <span className="text-white/60 text-sm">
                           {new Date(stories[activeStoryIndex.userIndex].stories[activeStoryIndex.storyIndex].created_at).getHours()}h
                       </span>
                  </div>

                  {/* Image */}
                  <img 
                      src={stories[activeStoryIndex.userIndex].stories[activeStoryIndex.storyIndex].image_url} 
                      className="w-full h-full object-contain"
                  />

                  {/* Controls */}
                  <div className="absolute inset-0 flex">
                      <div className="w-1/2 h-full" onClick={prevStory} />
                      <div className="w-1/2 h-full" onClick={nextStory} />
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
