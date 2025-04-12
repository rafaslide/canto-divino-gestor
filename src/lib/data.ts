
import { Music, Playlist } from "./types";

export const mockMusic: Music[] = [
  {
    id: "1",
    title: "Ave Maria",
    author: "Franz Schubert",
    tempo: "Lento",
    key: "C Major",
    liturgicalMoment: ["Offertory", "Communion"],
    tags: ["Mary", "Traditional", "Classical"],
    lyrics: "Ave Maria, gratia plena\nDominus tecum\nBenedicta tu in mulieribus\nEt benedictus fructus ventris tui, Jesus\nSancta Maria, Mater Dei\nOra pro nobis peccatoribus\nNunc et in hora mortis nostrae\nAmen.",
    dateAdded: new Date("2023-01-01"),
    favorite: true,
  },
  {
    id: "2",
    title: "Panis Angelicus",
    author: "César Franck",
    tempo: "Moderato",
    key: "A Major",
    liturgicalMoment: ["Communion"],
    tags: ["Eucharist", "Traditional", "Latin"],
    lyrics: "Panis angelicus\nFit panis hominum\nDat panis coelicus\nFiguris terminum\nO res mirabilis\nManducat Dominum\nPauper, pauper, servus et humilis.",
    dateAdded: new Date("2023-01-02"),
    favorite: false,
  },
  {
    id: "3",
    title: "Amazing Grace",
    author: "John Newton",
    tempo: "Andante",
    key: "G Major",
    liturgicalMoment: ["Entrance", "Closing"],
    tags: ["Mercy", "Popular"],
    lyrics: "Amazing grace, how sweet the sound\nThat saved a wretch like me.\nI once was lost, but now I'm found.\nWas blind but now I see.",
    dateAdded: new Date("2023-01-03"),
    favorite: true,
  },
  {
    id: "4",
    title: "Salve Regina",
    author: "Traditional",
    tempo: "Andante",
    key: "F Major",
    liturgicalMoment: ["Marian Devotion", "Closing"],
    tags: ["Mary", "Traditional", "Latin"],
    lyrics: "Salve, Regina, mater misericordiae;\nvita, dulcedo et spes nostra, salve.\nAd te clamamus, exsules filii Evae.\nAd te suspiramus, gementes et flentes\nin hac lacrimarum valle.",
    dateAdded: new Date("2023-01-04"),
    favorite: false,
  },
  {
    id: "5",
    title: "Adoro Te Devote",
    author: "St. Thomas Aquinas",
    tempo: "Lento",
    key: "D Minor",
    liturgicalMoment: ["Communion", "Adoration"],
    tags: ["Eucharist", "Traditional", "Latin"],
    lyrics: "Adoro te devote, latens Deitas,\nQuae sub his figuris vere latitas;\nTibi se cor meum totum subiicit,\nQuia te contemplans totum deficit.",
    dateAdded: new Date("2023-01-05"),
    favorite: true,
  },
  {
    id: "6",
    title: "How Great Thou Art",
    author: "Carl Boberg",
    tempo: "Moderato",
    key: "Bb Major",
    liturgicalMoment: ["Entrance", "Closing"],
    tags: ["Praise", "Popular"],
    lyrics: "O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made,\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.",
    dateAdded: new Date("2023-01-06"),
    favorite: false,
  },
];

// Helper function to get music by ID
export const getMusicById = (id: string): Music | undefined => {
  // First try to find in mock data
  const mockResult = mockMusic.find((music) => music.id === id);
  if (mockResult) return mockResult;
  
  // If not found, check localStorage
  const savedMusic = localStorage.getItem("userMusic");
  if (savedMusic) {
    const userMusic: Music[] = JSON.parse(savedMusic);
    const userResult = userMusic.find((music) => music.id === id);
    if (userResult) {
      // Ensure date is converted back to Date object
      return {
        ...userResult,
        dateAdded: new Date(userResult.dateAdded)
      };
    }
  }
  
  return undefined;
};

// Helper function to get music list by IDs
export const getMusicByIds = (ids: string[]): Music[] => {
  // Combine mock and user data
  const savedMusic = localStorage.getItem("userMusic");
  const userMusic = savedMusic ? JSON.parse(savedMusic) : [];
  const allMusic = [...mockMusic, ...userMusic];
  
  return allMusic.filter((music) => ids.includes(music.id)).map(music => ({
    ...music,
    dateAdded: new Date(music.dateAdded)
  }));
};

// Helper function to get playlist by ID from localStorage
export const getPlaylistById = (id: string): Playlist | undefined => {
  const savedPlaylists = localStorage.getItem("playlists");
  if (savedPlaylists) {
    const playlists: Playlist[] = JSON.parse(savedPlaylists);
    return playlists.find((playlist) => playlist.id === id);
  }
  return undefined;
};
