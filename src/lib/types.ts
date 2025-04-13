
export interface Music {
  id: string;
  title: string;
  author?: string;
  tempo?: string;
  key?: string;
  liturgicalMoment?: string[];
  tags?: string[];
  lyrics: string;
  chords?: string;
  dateAdded: Date;
  favorite: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  musicIds: string[];
  dateCreated: Date;
  dateModified: Date;
}

export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
}
