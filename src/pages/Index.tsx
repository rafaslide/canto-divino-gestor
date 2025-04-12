
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MusicCard from "@/components/MusicCard";
import { mockMusic, mockPlaylists } from "@/lib/data";
import { Link } from "react-router-dom";
import { Music, ListMusic, Import } from "lucide-react";

const Index = () => {
  // Get the 3 most recently added songs
  const recentMusic = [...mockMusic]
    .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
    .slice(0, 3);

  // Count total songs and playlists
  const totalSongs = mockMusic.length;
  const totalPlaylists = mockPlaylists.length;

  return (
    <Layout>
      <div className="space-y-8">
        <section className="text-center py-8">
          <h1 className="text-4xl font-serif font-bold mb-4 text-liturgy-900">
            Canto Divino
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Gerenciador de músicas litúrgicas para celebrações católicas
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-liturgy-700 hover:bg-liturgy-800">
              <Link to="/library" className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                <span>Explorar Biblioteca</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/import" className="flex items-center gap-2">
                <Import className="h-5 w-5" />
                <span>Importar Música</span>
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-liturgy-50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{totalSongs}</h3>
                <p className="text-muted-foreground">Músicas</p>
              </div>
              <Music className="h-12 w-12 text-liturgy-700" />
            </CardContent>
          </Card>
          <Card className="bg-liturgy-50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{totalPlaylists}</h3>
                <p className="text-muted-foreground">Playlists</p>
              </div>
              <ListMusic className="h-12 w-12 text-liturgy-700" />
            </CardContent>
          </Card>
          <Card className="bg-gold-50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Começar</h3>
                <p className="text-muted-foreground">Criar Nova Playlist</p>
              </div>
              <Button asChild className="bg-gold-500 hover:bg-gold-600">
                <Link to="/playlists">
                  <ListMusic className="h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold">Músicas Recentes</h2>
            <Button asChild variant="ghost">
              <Link to="/library" className="flex items-center gap-2">
                <span>Ver Tudo</span>
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMusic.map((music) => (
              <MusicCard key={music.id} music={music} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
