import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Music, ExternalLink, Plus } from 'lucide-react';
import { getEmbedUrl } from '../utils';

export default function Playlists({ data, updateData }) {
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');

  if (!data) return null;

  const addPlaylist = () => {
    if (!newPlaylistUrl) return;
    const newPlaylist = {
      id: Date.now(),
      name: `Playlist ${data.playlists.items.length + 1}`,
      url: newPlaylistUrl,
      type: 'spotify'
    };
    updateData('playlists.items', [...data.playlists.items, newPlaylist]);
    setNewPlaylistUrl('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Music className="text-green-500" /> Zona de Enfoque
      </h2>

      <IOSCard>
        <div className="flex gap-2">
            <input 
                value={newPlaylistUrl}
                onChange={(e) => setNewPlaylistUrl(e.target.value)}
                placeholder="Pegar enlace de Spotify/YouTube..."
                className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
            />
            <IOSButton onClick={addPlaylist} variant="secondary">
                <Plus size={20} />
            </IOSButton>
        </div>
      </IOSCard>

      <div className="space-y-4">
        {data.playlists.items.map(playlist => (
            <IOSCard key={playlist.id} className="p-0 overflow-hidden">
                <div className="p-4 flex justify-between items-center bg-green-900/20">
                    <h3 className="font-bold">{playlist.name}</h3>
                    <a 
                        href={playlist.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300"
                    >
                        Abrir App <ExternalLink size={12} />
                    </a>
                </div>
                <div className="aspect-video w-full bg-black">
                    <iframe 
                        src={getEmbedUrl(playlist.url)} 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        allow="encrypted-media" 
                        title={playlist.name}
                    ></iframe>
                </div>
            </IOSCard>
        ))}
      </div>
    </div>
  );
}
