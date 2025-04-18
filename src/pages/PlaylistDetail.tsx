
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getMusicByIds, getPlaylistById } from "@/lib/data";
import { Music, Playlist } from "@/lib/types";
import { ArrowLeft, ListMusic, Plus, MoveUp, MoveDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistMusic, setPlaylistMusic] = useState<Music[]>([]);
  const [sortField, setSortField] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    if (id) {
      const foundPlaylist = getPlaylistById(id);
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
        setPlaylistMusic(getMusicByIds(foundPlaylist.musicIds));
      }
    }
  }, [id]);

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

  const sortedMusic = [...playlistMusic].sort((a, b) => {
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
            
            <Button asChild className="bg-liturgy-700 hover:bg-liturgy-800">
              <Link to="/library" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Músicas
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-medium flex items-center mb-4">
            <ListMusic className="mr-2 h-5 w-5" />
            Músicas ({playlistMusic.length})
          </h2>

          {playlistMusic.length > 0 ? (
            <>
              <div className="border rounded-md">
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
                        <TableCell className="text-right">
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
            <div className="text-center py-8 border border-dashed rounded-md">
              <ListMusic className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Playlist vazia</h3>
              <p className="text-muted-foreground mt-1">
                Adicione músicas a esta playlist na página de biblioteca.
              </p>
              <Button asChild className="mt-4">
                <Link to="/library">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Músicas
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlaylistDetail;
