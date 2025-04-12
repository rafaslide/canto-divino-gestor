
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Playlist } from "@/lib/types";
import { ListMusic, Plus, Search, MoveUp, MoveDown, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Playlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();
  const location = useLocation();

  // Load playlists from localStorage on component mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem("playlists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
    
    // Check if we should open the dialog (coming from Library)
    if (location.state?.openDialog) {
      setIsDialogOpen(true);
      
      // If we have a musicId, store it for later
      if (location.state.musicId) {
        localStorage.setItem("pendingMusicId", location.state.musicId);
      }
    }
  }, [location]);

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
    
    // Check if there's a pending music to add
    const pendingMusicId = localStorage.getItem("pendingMusicId");
    if (pendingMusicId) {
      newPlaylist.musicIds.push(pendingMusicId);
      localStorage.removeItem("pendingMusicId");
    }
    
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
    
    // If we created this playlist with a pending music, navigate to the playlist
    if (pendingMusicId) {
      toast({
        title: "Música adicionada",
        description: "A música foi adicionada à nova playlist.",
      });
    }
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
    let aValue: any = a[sortField as keyof Playlist];
    let bValue: any = b[sortField as keyof Playlist];
    
    // Handle date fields
    if (sortField === "dateCreated" || sortField === "dateModified") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
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

  const currentItems = sortedPlaylists.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPlaylists.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

        {filteredPlaylists.length > 0 ? (
          <>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="w-[300px] cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Nome
                        {sortField === "name" && (
                          sortDirection === "asc" ? <MoveUp className="ml-1 h-4 w-4" /> : <MoveDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("dateModified")}
                    >
                      <div className="flex items-center">
                        Última atualização
                        {sortField === "dateModified" && (
                          sortDirection === "asc" ? <MoveUp className="ml-1 h-4 w-4" /> : <MoveDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Músicas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((playlist) => (
                    <TableRow key={playlist.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <ListMusic className="h-4 w-4 mr-2 text-liturgy-600" />
                          {playlist.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {playlist.description || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(playlist.dateModified), "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {playlist.musicIds.length}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm">
                          <Link to={`/playlists/${playlist.id}`}>
                            <ListMusic className="h-4 w-4 mr-1" />
                            Ver Playlist
                          </Link>
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
    </Layout>
  );
};

export default Playlists;
