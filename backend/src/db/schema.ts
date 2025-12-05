import { pgTable, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/** Tabela de usuários */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Hash bcrypt
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Tabela de artistas */
export const artists = pgTable('artists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Tabela de álbuns */
export const albums = pgTable('albums', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  coverUrl: text('cover_url'),
  releaseDate: timestamp('release_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Tabela de músicas (tracks) */
export const tracks = pgTable('tracks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  albumId: uuid('album_id').references(() => albums.id, { onDelete: 'set null' }),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  duration: integer('duration').notNull(), // Duração em segundos
  audioUrl: text('audio_url').notNull(),
  trackNumber: integer('track_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Tabela de playlists */
export const playlists = pgTable('playlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  description: text('description'),
  coverUrl: text('cover_url'),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Tabela de junção: tracks em playlists */
export const playlistTracks = pgTable('playlist_tracks', {
  playlistId: uuid('playlist_id').notNull().references(() => playlists.id, { onDelete: 'cascade' }),
  trackId: uuid('track_id').notNull().references(() => tracks.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

/** Relacionamentos do Drizzle ORM */
export const usersRelations = relations(users, ({ many }) => ({
  playlists: many(playlists),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  albums: many(albums),
  tracks: many(tracks),
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
  artist: one(artists, {
    fields: [albums.artistId],
    references: [artists.id],
  }),
  tracks: many(tracks),
}));

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id],
  }),
  artist: one(artists, {
    fields: [tracks.artistId],
    references: [artists.id],
  }),
  playlistTracks: many(playlistTracks),
}));

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
  playlistTracks: many(playlistTracks),
}));

export const playlistTracksRelations = relations(playlistTracks, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistTracks.playlistId],
    references: [playlists.id],
  }),
  track: one(tracks, {
    fields: [playlistTracks.trackId],
    references: [tracks.id],
  }),
}));
