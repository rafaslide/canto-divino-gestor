
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getMusicByIds, getPlaylistById } from "@/lib/data";
import { Music, Playlist } from "@/lib/types";
import { ArrowLeft, ListMusic } from "lucide-react";
import MusicCard from "@/components/MusicCard";

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistMusic, setPlaylistMusic] = useState<Music[]>([]);
  
  useEffect(() => {
    if (id) {
      const foundPlaylist = getPlaylistById(id);
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
        setPlaylistMusic(getMusicByIds(foundPlaylist.musicIds));
      }
    }
  }, [id]);

  if (!playlist) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Playlist não encontrada</h2>
          <p className="text-muted-foreground mt-2">
            A playlist que você está procurando não existe ou foi removida.
          </p>
          <Button asChild className="mt-4">
            <Link to="/playlists">Voltar para Playlists</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
          >
            <Link to="/playlists" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Playlists
            </Link>
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-muted-foreground mt-1">{playlist.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-medium flex items-center mb-4">
            <ListMusic className="mr-2 h-5 w-5" />
            Músicas ({playlistMusic.length})
          </h2>

          {playlistMusic.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {playlistMusic.map((music) => (
                <MusicCard 
                  key={music.id}
                  music={music}
                  onFavoriteToggle={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <ListMusic className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Playlist vazia</h3>
              <p className="text-muted-foreground mt-1">
                Adicione músicas a esta playlist na página de biblioteca.
              </p>
              <Button asChild className="mt-4">
                <Link to="/library">Ir para Biblioteca</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlaylistDetail;
