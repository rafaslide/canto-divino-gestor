
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { migrateLocalDataToSupabase } from '@/lib/migration';
import { useToast } from '@/components/ui/use-toast';

export const useMigration = () => {
  const { isAuthenticated } = useAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const performMigration = async () => {
      // Check if migration is needed by looking for localStorage data
      const hasLocalMusic = !!localStorage.getItem("userMusic");
      const hasLocalPlaylists = !!localStorage.getItem("playlists");
      
      if (isAuthenticated && (hasLocalMusic || hasLocalPlaylists)) {
        setIsMigrating(true);
        const result = await migrateLocalDataToSupabase();
        
        if (result) {
          toast({
            title: "Data Migration Successful",
            description: `Migrated ${result.musicMigrated} songs and ${result.playlistsMigrated} playlists to Supabase.`
          });
        } else {
          toast({
            title: "Data Migration Failed",
            description: "There was an issue migrating your local data.",
            variant: "destructive"
          });
        }
        
        setIsMigrating(false);
      } else {
        // If no data to migrate, don't show the migration screen
        setIsMigrating(false);
      }
    };

    performMigration();
  }, [isAuthenticated, toast]);

  return { isMigrating };
};
