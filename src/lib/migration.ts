
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const migrateLocalDataToSupabase = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Migrate Music
    const savedMusic = localStorage.getItem("userMusic");
    const localMusic = savedMusic ? JSON.parse(savedMusic) : [];
    
    if (localMusic.length > 0) {
      const musicToInsert = localMusic.map(music => ({
        id: music.id || uuidv4(),
        title: music.title,
        author: music.author || null,
        tempo: music.tempo || null,
        key: music.key || null,
        liturgical_moment: music.liturgicalMoment || [],
        tags: music.tags || [],
        lyrics: music.lyrics,
        chords: music.chords || null,
        date_added: music.dateAdded ? new Date(music.dateAdded).toISOString() : new Date().toISOString(),
        favorite: music.favorite || false,
        created_by: userId
      }));

      const { error: musicError } = await supabase
        .from('music')
        .upsert(musicToInsert, { 
          onConflict: 'id',
          ignoreDuplicates: true 
        });

      if (musicError) throw musicError;
    }

    // Migrate Playlists
    const savedPlaylists = localStorage.getItem("playlists");
    const localPlaylists = savedPlaylists ? JSON.parse(savedPlaylists) : [];
    
    if (localPlaylists.length > 0) {
      const playlistsToInsert = localPlaylists.map(playlist => ({
        id: playlist.id || uuidv4(),
        name: playlist.name,
        description: playlist.description || null,
        music_ids: playlist.musicIds || [],
        date_created: playlist.dateCreated ? new Date(playlist.dateCreated).toISOString() : new Date().toISOString(),
        date_modified: playlist.dateModified ? new Date(playlist.dateModified).toISOString() : new Date().toISOString(),
        created_by: userId
      }));

      const { error: playlistError } = await supabase
        .from('playlists')
        .upsert(playlistsToInsert, { 
          onConflict: 'id',
          ignoreDuplicates: true 
        });

      if (playlistError) throw playlistError;
    }

    // Clear localStorage after successful migration
    localStorage.removeItem("userMusic");
    localStorage.removeItem("playlists");

    return {
      musicMigrated: localMusic.length,
      playlistsMigrated: localPlaylists.length
    };
  } catch (error) {
    console.error("Migration error:", error);
    return null;
  }
};
