
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMusicById } from "@/lib/data";
import { 
  ArrowLeft, 
  Heart, 
  Edit, 
  Trash, 
  Music, 
  Plus 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockPlaylists } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";

const MusicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const music = getMusicById(id || "");
  const [favorite, setFavorite] = useState(music?.favorite || false);

  if (!music) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Música não encontrada</h2>
          <Button onClick={() => navigate("/library")}>
            Voltar para a Biblioteca
          </Button>
        </div>
      </Layout>
    );
  }

  const handleFavoriteToggle = () => {
    setFavorite(!favorite);
    // In a real app, this would update the database
    toast({
      title: favorite ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
      description: `"${music.title}" foi ${
        favorite ? "removido dos" : "adicionado aos"
      } favoritos.`,
    });
  };

  const handleAddToPlaylist = (playlistId: string) => {
    // In a real app, this would add the music to the selected playlist
    const playlist = mockPlaylists.find((p) => p.id === playlistId);
    toast({
      title: "Adicionado à Playlist",
      description: `"${music.title}" foi adicionado à playlist "${playlist?.name}".`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteToggle}
              className="h-10 w-10"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  favorite ? "fill-red-500 text-red-500" : "text-gray-400"
                )}
              />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar à Playlist</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar à Playlist</DialogTitle>
                  <DialogDescription>
                    Escolha uma playlist para adicionar "{music.title}".
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                  {mockPlaylists.map((playlist) => (
                    <Button
                      key={playlist.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddToPlaylist(playlist.id)}
                    >
                      <Music className="h-4 w-4 mr-2" />
                      {playlist.name}
                    </Button>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-bold">{music.title}</h1>
            {music.author && (
              <p className="text-lg text-muted-foreground">{music.author}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {music.liturgicalMoment?.map((moment) => (
              <Badge key={moment} variant="outline" className="bg-liturgy-50">
                {moment}
              </Badge>
            ))}
            {music.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-lg font-bold">Informações</h3>
                <div className="grid grid-cols-2 gap-4">
                  {music.key && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tonalidade</p>
                      <p>{music.key}</p>
                    </div>
                  )}
                  {music.tempo && (
                    <div>
                      <p className="text-sm text-muted-foreground">Andamento</p>
                      <p>{music.tempo}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Adição</p>
                    <p>{music.dateAdded.toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Letra</h3>
              <div className="whitespace-pre-line font-serif text-lg">
                {music.lyrics}
              </div>
            </CardContent>
          </Card>

          {music.chords && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Acordes</h3>
                <div className="whitespace-pre-line font-mono text-lg">
                  {music.chords}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MusicDetail;
