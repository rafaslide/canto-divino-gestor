
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  ArrowLeft, 
  Music, 
  Clock, 
  Tag,
  ListMusic,
  Plus
} from "lucide-react";
import { getMusicById } from "@/lib/data";
import { Music } from "@/lib/types";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const MusicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [music, setMusic] = useState<Music | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Load music
    if (id) {
      const foundMusic = getMusicById(id);
      if (foundMusic) {
        setMusic(foundMusic);
      }
    }

    // Load playlists from localStorage
    const savedPlaylists = localStorage.getItem("playlists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, [id]);

  const handleAddToPlaylist = () => {
    if (!selectedPlaylist || !music) return;

    // Find the selected playlist
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === selectedPlaylist) {
        // Check if music is already in playlist
        if (!playlist.musicIds.includes(music.id)) {
          return {
            ...playlist,
            musicIds: [...playlist.musicIds, music.id],
            dateModified: new Date()
          };
        }
      }
      return playlist;
    });

    // Save updated playlists to localStorage
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    
    // Get playlist name for the toast
    const playlistName = playlists.find(p => p.id === selectedPlaylist)?.name;
    
    // Show success toast
    toast({
      title: "Música adicionada",
      description: `"${music.title}" foi adicionada à playlist "${playlistName}"`,
    });
    
    // Reset selection
    setSelectedPlaylist("");
  };

  if (!music) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Música não encontrada</h2>
          <p className="text-muted-foreground mt-2">
            A música que você está procurando não existe ou foi removida.
          </p>
          <Button asChild className="mt-4">
            <Link to="/library">Voltar para Biblioteca</Link>
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
            <Link to="/library" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Biblioteca
            </Link>
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold">{music.title}</h1>
              {music.author && (
                <p className="text-xl mt-1">{music.author}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              className={`${music.favorite ? "text-red-500" : "text-muted-foreground"}`}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-medium mb-3 flex items-center">
                <Music className="mr-2 h-5 w-5" />
                Letra
              </h2>
              <div className="whitespace-pre-line">
                {music.lyrics}
              </div>
            </div>

            {music.chords && (
              <div className="border p-4 rounded-md">
                <h2 className="text-xl font-medium mb-3">Cifra</h2>
                <div className="font-mono whitespace-pre-line">
                  {music.chords}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="border p-4 rounded-md">
              <h2 className="text-lg font-medium mb-3">Informações</h2>
              <div className="space-y-4">
                {music.key && (
                  <div className="flex items-start">
                    <Music className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tonalidade</p>
                      <p className="text-muted-foreground">{music.key}</p>
                    </div>
                  </div>
                )}

                {music.tempo && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Andamento</p>
                      <p className="text-muted-foreground">{music.tempo}</p>
                    </div>
                  </div>
                )}

                {music.liturgicalMoment && music.liturgicalMoment.length > 0 && (
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Momento Litúrgico</p>
                      <p className="text-muted-foreground">
                        {music.liturgicalMoment.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border p-4 rounded-md">
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <ListMusic className="mr-2 h-5 w-5" />
                Adicionar à Playlist
              </h2>
              
              {playlists.length > 0 ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar à Playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar à Playlist</DialogTitle>
                      <DialogDescription>
                        Selecione a playlist onde deseja adicionar "{music.title}".
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        {playlists.map((playlist) => (
                          <div key={playlist.id} className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id={playlist.id} 
                              name="playlist" 
                              value={playlist.id}
                              checked={selectedPlaylist === playlist.id}
                              onChange={(e) => setSelectedPlaylist(e.target.value)}
                              className="h-4 w-4"
                            />
                            <label htmlFor={playlist.id} className="text-sm font-medium">
                              {playlist.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        onClick={handleAddToPlaylist} 
                        disabled={!selectedPlaylist}
                      >
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm mb-4">
                    Você ainda não tem playlists. Crie uma playlist para adicionar esta música.
                  </p>
                  <Button asChild>
                    <Link to="/playlists">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Playlist
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MusicDetail;
