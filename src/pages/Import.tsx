
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Upload, Music } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Import = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [key, setKey] = useState("");
  const [tempo, setTempo] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [liturgicalMoment, setLiturgicalMoment] = useState("");

  // Musical key options
  const keyOptions = [
    "C Major", "G Major", "D Major", "A Major", "E Major", "B Major", "F# Major",
    "Db Major", "Ab Major", "Eb Major", "Bb Major", "F Major",
    "A Minor", "E Minor", "B Minor", "F# Minor", "C# Minor", "G# Minor",
    "D# Minor", "Bb Minor", "F Minor", "C Minor", "G Minor", "D Minor"
  ];

  // Tempo options
  const tempoOptions = [
    "Largo", "Larghetto", "Adagio", "Andante", "Moderato",
    "Allegro", "Vivace", "Presto", "Prestissimo"
  ];

  // Liturgical moment options
  const liturgicalMomentOptions = [
    "Entrance", "Kyrie", "Gloria", "Alleluia", "Gospel Acclamation",
    "Offertory", "Sanctus", "Eucharistic Acclamations", "Communion",
    "Meditation", "Recessional", "Marian Devotion", "Adoration"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !lyrics) {
      toast({
        title: "Campos Obrigatórios",
        description: "Título e letra da música são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save the music to the database
    console.log("Importing new music:", {
      title,
      author,
      key,
      tempo,
      liturgicalMoment: liturgicalMoment ? [liturgicalMoment] : [],
      lyrics,
    });

    toast({
      title: "Música Importada",
      description: `A música "${title}" foi importada com sucesso!`,
    });

    // Reset form
    setTitle("");
    setAuthor("");
    setKey("");
    setTempo("");
    setLyrics("");
    setLiturgicalMoment("");
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold">Importar Música</h1>
          <p className="text-muted-foreground mt-2">
            Adicione uma nova música à sua biblioteca
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base">
                  Título da Música *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Ave Maria"
                  required
                />
              </div>

              <div>
                <Label htmlFor="author" className="text-base">
                  Autor/Compositor
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ex: Franz Schubert"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="key" className="text-base">
                    Tonalidade
                  </Label>
                  <Select value={key} onValueChange={setKey}>
                    <SelectTrigger id="key">
                      <SelectValue placeholder="Selecione uma tonalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {keyOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tempo" className="text-base">
                    Andamento
                  </Label>
                  <Select value={tempo} onValueChange={setTempo}>
                    <SelectTrigger id="tempo">
                      <SelectValue placeholder="Selecione um andamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {tempoOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="liturgicalMoment" className="text-base">
                  Momento Litúrgico
                </Label>
                <Select
                  value={liturgicalMoment}
                  onValueChange={setLiturgicalMoment}
                >
                  <SelectTrigger id="liturgicalMoment">
                    <SelectValue placeholder="Selecione um momento litúrgico" />
                  </SelectTrigger>
                  <SelectContent>
                    {liturgicalMomentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lyrics" className="text-base">
                  Letra da Música *
                </Label>
                <Textarea
                  id="lyrics"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Insira a letra da música aqui..."
                  className="min-h-[200px]"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Arquivo
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-liturgy-700 hover:bg-liturgy-800"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Música
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Import;
