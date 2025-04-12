
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PlaylistCard from "@/components/PlaylistCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Playlist } from "@/lib/types";
import { ListMusic, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const Playlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { toast } = useToast();

  // Load playlists from localStorage on component mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem("playlists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  // Filter playlists based on search term
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePlaylist = () => {
    const newPlaylist: Playlist = {
      id: uuidv4(),
      name: newPlaylistName,
      description: newPlaylistDescription,
      musicIds: [],
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    
    // Add new playlist to state
    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    
    // Save to localStorage
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    
    // Display success message
    toast({
      title: "Playlist criada",
      description: `A playlist "${newPlaylistName}" foi criada com sucesso.`,
    });
    
    // Reset form and close dialog
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold">Playlists</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-liturgy-700 hover:bg-liturgy-800">
                <Plus className="h-4 w-4 mr-2" />
                Nova Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Playlist</DialogTitle>
                <DialogDescription>
                  Crie uma nova playlist para organizar suas músicas litúrgicas.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Playlist</Label>
                  <Input
                    id="name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Ex: Missa de Domingo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    placeholder="Ex: Músicas para a celebração dominical"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                >
                  Criar Playlist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                musicCount={playlist.musicIds.length}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <ListMusic className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Nenhuma playlist encontrada</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? "Tente usar outros termos de busca"
                  : "Crie sua primeira playlist para começar a organizar suas músicas"}
              </p>
              {!searchTerm && (
                <Button
                  className="mt-4 bg-liturgy-700 hover:bg-liturgy-800"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Playlist
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Playlists;
