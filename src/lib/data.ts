
import { Music, Playlist } from "./types";

export const mockMusic: Music[] = [];

// Helper function to get music by ID
export const getMusicById = (id: string): Music | undefined => {
  // First try to find in mock data
  const mockResult = mockMusic.find((music) => music.id === id);
  if (mockResult) return mockResult;
  
  // If not found, check localStorage
  const savedMusic = localStorage.getItem("userMusic");
  if (savedMusic) {
    const userMusic: Music[] = JSON.parse(savedMusic);
    const userResult = userMusic.find((music) => music.id === id);
    if (userResult) {
      // Ensure date is converted back to Date object
      return {
        ...userResult,
        dateAdded: new Date(userResult.dateAdded)
      };
    }
  }
  
  return undefined;
};

// Helper function to get music list by IDs
export const getMusicByIds = (ids: string[]): Music[] => {
  // Combine mock and user data
  const savedMusic = localStorage.getItem("userMusic");
  const userMusic = savedMusic ? JSON.parse(savedMusic) : [];
  const allMusic = [...mockMusic, ...userMusic];
  
  return allMusic.filter((music) => ids.includes(music.id)).map(music => ({
    ...music,
    dateAdded: new Date(music.dateAdded)
  }));
};

// Helper function to get playlist by ID from localStorage
export const getPlaylistById = (id: string): Playlist | undefined => {
  const savedPlaylists = localStorage.getItem("playlists");
  if (savedPlaylists) {
    const playlists: Playlist[] = JSON.parse(savedPlaylists);
    return playlists.find((playlist) => playlist.id === id);
  }
  return undefined;
};
