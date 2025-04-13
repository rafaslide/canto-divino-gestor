
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
      if (isAuthenticated) {
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
      }
    };

    performMigration();
  }, [isAuthenticated]);

  return { isMigrating };
};
