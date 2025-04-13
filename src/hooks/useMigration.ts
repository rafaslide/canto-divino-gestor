
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { migrateLocalDataToSupabase } from '@/lib/migration';
import { useToast } from '@/components/ui/use-toast';

export const useMigration = () => {
  const { isAuthenticated } = useAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  // Function to manually trigger migration when needed
  const runMigration = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to migrate data.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if migration is needed by looking for localStorage data
    const hasLocalMusic = !!localStorage.getItem("userMusic");
    const hasLocalPlaylists = !!localStorage.getItem("playlists");
    
    if (hasLocalMusic || hasLocalPlaylists) {
      setIsMigrating(true);
      const result = await migrateLocalDataToSupabase();
      
      if (result) {
        toast({
          title: "Data Migration Successful",
          description: `Migrated ${result.musicMigrated} songs and ${result.playlistsMigrated} playlists to Supabase.`
        });
        setIsMigrating(false);
        return true;
      } else {
        toast({
          title: "Data Migration Failed",
          description: "There was an issue migrating your local data.",
          variant: "destructive"
        });
        setIsMigrating(false);
        return false;
      }
    } else {
      toast({
        title: "No Local Data",
        description: "There is no local data to migrate."
      });
      return false;
    }
  };

  return { isMigrating, runMigration };
};
