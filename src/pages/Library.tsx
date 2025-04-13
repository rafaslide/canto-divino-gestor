import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockMusic } from "@/lib/data";
import { Music } from "@/lib/types";
import { Search, Filter, X, MoveUp, MoveDown, Heart, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allMusic, setAllMusic] = useState<Music[]>([]);
  const [filteredMusic, setFilteredMusic] = useState<Music[]>([]);
  const [selectedMoment, setSelectedMoment] = useState<string>("");
  const [sortField, setSortField] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const [selectedMusicId, setSelectedMusicId] = useState<string>("");
  const [showAddToPlaylist, setShowAddToPlaylist] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Carregar músicas do mockMusic e do localStorage
    const loadMusic = () => {
      // Carregar músicas do localStorage
      const savedMusic = localStorage.getItem("userMusic");
      const userMusic = savedMusic ? JSON.parse(savedMusic) : [];
      
      // Combinar com as músicas de exemplo
      const combinedMusic = [...mockMusic, ...userMusic];
      
      // Converter datas para objetos Date
      const processedMusic = combinedMusic.map(music => ({
        ...music,
        dateAdded: new Date(music.dateAdded)
      }));
      
      setAllMusic(processedMusic);
      setFilteredMusic(processedMusic);
    };
    
    // Carregar playlists do localStorage
    const loadPlaylists = () => {
      const savedPlaylists = localStorage.getItem("playlists");
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      }
    };
    
    loadMusic();
    loadPlaylists();
    
    // Get playlist ID from URL if present
    const params = new URLSearchParams(location.search);
    const playlistId = params.get('selectForPlaylist');
    if (playlistId) {
      setSelectedPlaylist(playlistId);
      setShowAddToPlaylist(true);
    }
  }, [location]);

  // Get all unique liturgical moments from the music data
  const liturgicalMoments = Array.from(
    new Set(
      allMusic
        .flatMap((music) => music.liturgicalMoment || [])
        .filter(Boolean)
    )
  ).sort();

  // Search and filter logic
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedMoment);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleMomentFilter = (moment: string) => {
    setSelectedMoment(moment);
    applyFilters(searchTerm, moment);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const applyFilters = (term: string, moment: string) => {
    let result = [...allMusic];

    // Apply search term filter
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      result = result.filter(
        (music) =>
          music.title.toLowerCase().includes(lowercaseTerm) ||
          (music.author && music.author.toLowerCase().includes(lowercaseTerm))
      );
    }

    // Apply liturgical moment filter
    if (moment && moment !== "all") {
      result = result.filter(
        (music) =>
          music.liturgicalMoment && music.liturgicalMoment.includes(moment)
      );
    }

    setFilteredMusic(result);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMoment("");
    setFilteredMusic(allMusic);
    setCurrentPage(1);
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const sortedMusic = [...filteredMusic].sort((a, b) => {
    let aValue: any = a[sortField as keyof Music];
    let bValue: any = b[sortField as keyof Music];
    
    // Handle nested properties or missing values
    if (!aValue) aValue = "";
    if (!bValue) bValue = "";
    
    // For string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // For number or date comparison
    return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const currentItems = sortedMusic.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedMusic.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddToPlaylist = () => {
    if (showNewPlaylistInput && newPlaylistName.trim()) {
      // Criar nova playlist
      const newPlaylist = {
        id: uuidv4(),
        name: newPlaylistName.trim(),
        description: "",
        musicIds: [selectedMusicId],
        dateCreated: new Date(),
        dateModified: new Date()
      };
      
      const updatedPlaylists = [...playlists, newPlaylist];
      localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
      setPlaylists(updatedPlaylists);
      
      toast({
        title: "Playlist criada",
        description: `"${newPlaylistName}" foi criada com a música selecionada`,
      });
      
      setNewPlaylistName("");
      setShowNewPlaylistInput(false);
      setShowAddToPlaylist(false);
      return;
    }
  
    if (!selectedPlaylist || !selectedMusicId) return;

    // Find the selected playlist
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === selectedPlaylist) {
        // Check if music is already in playlist
        if (!playlist.musicIds.includes(selectedMusicId)) {
          return {
            ...playlist,
            musicIds: [...playlist.musicIds, selectedMusicId],
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
    const musicName = filteredMusic.find(m => m.id === selectedMusicId)?.title;
    
    // Show success toast
    toast({
      title: "Música adicionada",
      description: `"${musicName}" foi adicionada à playlist "${playlistName}"`,
    });
    
    // Reset selection and close dialog
    setSelectedMusicId("");
    setShowAddToPlaylist(false);
    
    // If we came from a playlist, navigate back to it
    const params = new URLSearchParams(location.search);
    const playlistId = params.get('selectForPlaylist');
    if (playlistId) {
      navigate(`/playlists/${playlistId}`);
    }
  };

  const handleNewPlaylist = () => {
    setShowNewPlaylistInput(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold">Biblioteca de Músicas</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por título ou autor..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={selectedMoment}
              onValueChange={handleMomentFilter}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Momento Litúrgico" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {liturgicalMoments.map((moment) => (
                  <SelectItem key={moment} value={moment}>
                    {moment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || selectedMoment) && (
            <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {filteredMusic.length > 0 ? (
          <>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="w-[400px] cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Título
                        {sortField === "title" && (
                          sortDirection === "asc" ? <MoveUp className="ml-1 h-4 w-4" /> : <MoveDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("author")}
                    >
                      <div className="flex items-center">
                        Autor
                        {sortField === "author" && (
                          sortDirection === "asc" ? <MoveUp className="ml-1 h-4 w-4" /> : <MoveDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Momento Litúrgico</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((music) => (
                    <TableRow key={music.id}>
                      <TableCell className="font-medium">{music.title}</TableCell>
                      <TableCell>{music.author || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {music.liturgicalMoment?.map((moment) => (
                            <Badge key={moment} variant="outline" className="bg-liturgy-50 text-liturgy-900">
                              {moment}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setSelectedMusicId(music.id);
                            setShowAddToPlaylist(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar à Playlist
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link to={`/music/${music.id}`}>Ver detalhes</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && paginate(currentPage - 1)} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    // Show first page, last page, current page and one page before/after current
                    let pageToShow: number | null = null;
                    
                    if (i === 0) pageToShow = 1;
                    else if (i === 1 && currentPage > 3) pageToShow = null; // ellipsis
                    else if (i === Math.min(totalPages, 5) - 1) pageToShow = totalPages;
                    else if (i === Math.min(totalPages, 5) - 2 && currentPage < totalPages - 2) pageToShow = null; // ellipsis
                    else if (totalPages <= 5) pageToShow = i + 1;
                    else if (currentPage <= 3) pageToShow = i + 1;
                    else if (currentPage >= totalPages - 2) pageToShow = totalPages - (Math.min(totalPages, 5) - 1 - i);
                    else pageToShow = currentPage + (i - 2);
                    
                    return (
                      <PaginationItem key={i}>
                        {pageToShow === null ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={pageToShow === currentPage}
                            onClick={() => paginate(pageToShow as number)}
                          >
                            {pageToShow}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-xl font-medium">Nenhuma música encontrada</h3>
            <p className="text-muted-foreground mt-2">
              Tente usar outros termos de busca ou filtros
            </p>
          </div>
        )}
      </div>
      
      {/* Dialog for adding to playlist */}
      <Dialog open={showAddToPlaylist} onOpenChange={setShowAddToPlaylist}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar à Playlist</DialogTitle>
            <DialogDescription>
              Selecione a playlist onde deseja adicionar esta música.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {showNewPlaylistInput ? (
              <div className="space-y-2">
                <Label htmlFor="newPlaylist">Nome da nova playlist</Label>
                <Input
                  id="newPlaylist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Digite o nome da playlist..."
                  autoFocus
                />
              </div>
            ) : (
              <>
                {playlists.length > 0 ? (
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
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Você ainda não tem playlists. Crie uma playlist primeiro.
                  </p>
                )}
              </>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {showNewPlaylistInput ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewPlaylistInput(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddToPlaylist} 
                  disabled={!newPlaylistName.trim()}
                >
                  Criar e Adicionar
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleNewPlaylist}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Nova Playlist
                </Button>
                
                {playlists.length > 0 && (
                  <Button 
                    onClick={handleAddToPlaylist} 
                    disabled={!selectedPlaylist}
                  >
                    Adicionar
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Library;
