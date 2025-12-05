import { requireDb } from '../config/db';
import { users, artists, albums, tracks, playlists, playlistTracks } from './schema';
import bcrypt from 'bcrypt';

/**
 * Script para popular o banco de dados com dados de exemplo
 * Usa conteúdo de domínio público e licenciado publicamente
 */

async function seed() {
  const database = requireDb();

  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes (opcional - comentar se quiser manter dados existentes)
    console.log('🧹 Limpando dados existentes...');
    await database.delete(playlistTracks);
    await database.delete(playlists);
    await database.delete(tracks);
    await database.delete(albums);
    await database.delete(artists);
    await database.delete(users);

    // Criar usuário de exemplo
    console.log('👤 Criando usuários...');
    const hashedPassword = await bcrypt.hash('senha123', 10);
    const [demoUser] = await database
      .insert(users)
      .values({
        email: 'demo@spotifyclone.com',
        password: hashedPassword,
        name: 'Usuário Demo',
      })
      .returning();

    // Criar artistas (conteúdo de domínio público)
    console.log('🎤 Criando artistas...');
    const artistsData = [
      {
        name: 'Kevin MacLeod',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        bio: 'Compositor americano de música royalty-free, conhecido por suas composições de domínio público.',
      },
      {
        name: 'Scott Buckley',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        bio: 'Compositor australiano de música cinematográfica e ambiente, disponível sob licença Creative Commons.',
      },
      {
        name: 'Bensound',
        imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
        bio: 'Biblioteca de música royalty-free com muitas faixas disponíveis gratuitamente.',
      },
      {
        name: 'Purple Planet Music',
        imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400',
        bio: 'Produtora de música royalty-free especializada em trilhas sonoras e música ambiente.',
      },
    ];

    const insertedArtists = await database.insert(artists).values(artistsData).returning();

    // Criar álbuns
    console.log('💿 Criando álbuns...');
    const albumsData = [
      {
        title: 'Cinematic Background Music',
        artistId: insertedArtists[0].id,
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        releaseDate: new Date('2020-01-15'),
      },
      {
        title: 'Epic Cinematic',
        artistId: insertedArtists[1].id,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        releaseDate: new Date('2021-03-20'),
      },
      {
        title: 'Acoustic Breeze',
        artistId: insertedArtists[2].id,
        coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
        releaseDate: new Date('2019-06-10'),
      },
      {
        title: 'Ambient Dreams',
        artistId: insertedArtists[3].id,
        coverUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400',
        releaseDate: new Date('2022-05-12'),
      },
    ];

    const insertedAlbums = await database.insert(albums).values(albumsData).returning();

    // Criar tracks (usando URLs de áudio de domínio público)
    // Nota: Estas são URLs de exemplo. Em produção, você precisaria de URLs reais de áudio
    console.log('🎵 Criando músicas...');
    const tracksData = [
      // Álbum 1 - Kevin MacLeod
      {
        title: 'Incompetech',
        albumId: insertedAlbums[0].id,
        artistId: insertedArtists[0].id,
        duration: 180,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        trackNumber: 1,
      },
      {
        title: 'Local Forecast',
        albumId: insertedAlbums[0].id,
        artistId: insertedArtists[0].id,
        duration: 195,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        trackNumber: 2,
      },
      {
        title: 'Mighty and Meek',
        albumId: insertedAlbums[0].id,
        artistId: insertedArtists[0].id,
        duration: 165,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        trackNumber: 3,
      },
      // Álbum 2 - Scott Buckley
      {
        title: 'Legion',
        albumId: insertedAlbums[1].id,
        artistId: insertedArtists[1].id,
        duration: 240,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        trackNumber: 1,
      },
      {
        title: 'Chasing Daylight',
        albumId: insertedAlbums[1].id,
        artistId: insertedArtists[1].id,
        duration: 220,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        trackNumber: 2,
      },
      {
        title: 'Ascension',
        albumId: insertedAlbums[1].id,
        artistId: insertedArtists[1].id,
        duration: 210,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        trackNumber: 3,
      },
      // Álbum 3 - Bensound
      {
        title: 'Acoustic Breeze',
        albumId: insertedAlbums[2].id,
        artistId: insertedArtists[2].id,
        duration: 190,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        trackNumber: 1,
      },
      {
        title: 'Sunny',
        albumId: insertedAlbums[2].id,
        artistId: insertedArtists[2].id,
        duration: 175,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        trackNumber: 2,
      },
      {
        title: 'Memories',
        albumId: insertedAlbums[2].id,
        artistId: insertedArtists[2].id,
        duration: 200,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        trackNumber: 3,
      },
      // Álbum 4 - Purple Planet
      {
        title: 'Ambient Dreams',
        albumId: insertedAlbums[3].id,
        artistId: insertedArtists[3].id,
        duration: 185,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        trackNumber: 1,
      },
      {
        title: 'Ethereal',
        albumId: insertedAlbums[3].id,
        artistId: insertedArtists[3].id,
        duration: 195,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
        trackNumber: 2,
      },
      {
        title: 'Serenity',
        albumId: insertedAlbums[3].id,
        artistId: insertedArtists[3].id,
        duration: 180,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
        trackNumber: 3,
      },
      // Tracks sem álbum
      {
        title: 'Epic Trailer',
        albumId: null,
        artistId: insertedArtists[1].id,
        duration: 250,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
        trackNumber: null,
      },
      {
        title: 'Happy Rock',
        albumId: null,
        artistId: insertedArtists[2].id,
        duration: 170,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
        trackNumber: null,
      },
    ];

    const insertedTracks = await database.insert(tracks).values(tracksData).returning();

    // Criar playlists
    console.log('📋 Criando playlists...');
    const playlistsData = [
      {
        name: 'Minhas Favoritas',
        userId: demoUser.id,
        description: 'Músicas que eu mais gosto',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        isPublic: true,
      },
      {
        name: 'Para Trabalhar',
        userId: demoUser.id,
        description: 'Música ambiente para focar',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        isPublic: false,
      },
      {
        name: 'Epic Music',
        userId: demoUser.id,
        description: 'Músicas épicas e cinematográficas',
        coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
        isPublic: true,
      },
    ];

    const insertedPlaylists = await database.insert(playlists).values(playlistsData).returning();

    // Adicionar tracks às playlists
    console.log('🎶 Adicionando músicas às playlists...');
    const playlistTracksData = [
      // Playlist 1 - Minhas Favoritas
      { playlistId: insertedPlaylists[0].id, trackId: insertedTracks[0].id },
      { playlistId: insertedPlaylists[0].id, trackId: insertedTracks[3].id },
      { playlistId: insertedPlaylists[0].id, trackId: insertedTracks[6].id },
      { playlistId: insertedPlaylists[0].id, trackId: insertedTracks[9].id },
      // Playlist 2 - Para Trabalhar
      { playlistId: insertedPlaylists[1].id, trackId: insertedTracks[9].id },
      { playlistId: insertedPlaylists[1].id, trackId: insertedTracks[10].id },
      { playlistId: insertedPlaylists[1].id, trackId: insertedTracks[11].id },
      // Playlist 3 - Epic Music
      { playlistId: insertedPlaylists[2].id, trackId: insertedTracks[3].id },
      { playlistId: insertedPlaylists[2].id, trackId: insertedTracks[4].id },
      { playlistId: insertedPlaylists[2].id, trackId: insertedTracks[5].id },
      { playlistId: insertedPlaylists[2].id, trackId: insertedTracks[12].id },
    ];

    await database.insert(playlistTracks).values(playlistTracksData);

    console.log('✅ Seed concluído com sucesso!');
    console.log(`   - ${insertedArtists.length} artistas criados`);
    console.log(`   - ${insertedAlbums.length} álbuns criados`);
    console.log(`   - ${insertedTracks.length} músicas criadas`);
    console.log(`   - ${insertedPlaylists.length} playlists criadas`);
    console.log(`   - ${playlistTracksData.length} músicas adicionadas às playlists`);
    console.log('\n📝 Credenciais do usuário demo:');
    console.log('   Email: demo@spotifyclone.com');
    console.log('   Senha: senha123');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Processo finalizado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

export { seed };

