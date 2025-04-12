
import { useState } from "react";
import Layout from "@/components/Layout";
import MusicCard from "@/components/MusicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockMusic } from "@/lib/data";
import { Music } from "@/lib/types";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMusic, setFilteredMusic] = useState<Music[]>(mockMusic);
  const [selectedMoment, setSelectedMoment] = useState<string>("");

  // Get all unique liturgical moments from the music data
  const liturgicalMoments = Array.from(
    new Set(
      mockMusic
        .flatMap((music) => music.liturgicalMoment || [])
        .filter(Boolean)
    )
  ).sort();

  // Search and filter logic
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedMoment);
  };

  const handleMomentFilter = (moment: string) => {
    setSelectedMoment(moment);
    applyFilters(searchTerm, moment);
  };

  const applyFilters = (term: string, moment: string) => {
    let result = [...mockMusic];

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
    if (moment) {
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
    setFilteredMusic(mockMusic);
  };

  const handleFavoriteToggle = (id: string, favorite: boolean) => {
    // In a real app, this would update the database
    console.log(`Toggle favorite for music ${id}: ${favorite}`);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMusic.length > 0 ? (
            filteredMusic.map((music) => (
              <MusicCard
                key={music.id}
                music={music}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium">Nenhuma música encontrada</h3>
              <p className="text-muted-foreground mt-2">
                Tente usar outros termos de busca ou filtros
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Library;
