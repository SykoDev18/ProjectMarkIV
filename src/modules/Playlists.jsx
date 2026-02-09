import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Music, ExternalLink, Plus, Trash2, Edit2, X } from 'lucide-react';
import { getEmbedUrl, triggerHaptic } from '../utils';

export default function Playlists({ data, updateData }) {
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  if (!data) return null;

  const addPlaylist = () => {
    if (!newPlaylistUrl) return;
    triggerHaptic();
    const newPlaylist = {
      id: Date.now(),
      name: newPlaylistName || `Playlist ${data.playlists.items.length + 1}`,
      url: newPlaylistUrl,
      type: 'spotify'
    };
    updateData('playlists', { ...data.playlists, items: [...data.playlists.items, newPlaylist] });
    setNewPlaylistUrl('');
    setNewPlaylistName('');
    setShowAdd(false);
  };

  const deletePlaylist = (id) => {
    triggerHaptic();
    const newItems = data.playlists.items.filter(p => p.id !== id);
    updateData('playlists', { ...data.playlists, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Music className="text-green-500" /> Zona de Enfoque
        </h2>
        <IOSButton size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? <X size={18} /> : <Plus size={18} />}
        </IOSButton>
      </div>

      {showAdd && (
        <IOSCard className="animate-in fade-in slide-in-from-top-4">
          <div className="space-y-3">
            <input 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Nombre de la playlist..."
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
            />
            <div className="flex gap-2">
              <input 
                  value={newPlaylistUrl}
                  onChange={(e) => setNewPlaylistUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlaylist()}
                  placeholder="Pegar enlace de Spotify..."
                  className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
              />
              <IOSButton onClick={addPlaylist} variant="primary">
                  Añadir
              </IOSButton>
            </div>
          </div>
        </IOSCard>
      )}

      {data.playlists.items.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Music size={48} className="mx-auto mb-3 opacity-20" />
          <p>Añade playlists de Spotify para concentrarte</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.playlists.items.map(playlist => (
              <IOSCard key={playlist.id} className="p-0 overflow-hidden group">
                  <div className="p-4 flex justify-between items-center bg-green-900/20">
                      <h3 className="font-bold">{playlist.name}</h3>
                      <div className="flex items-center gap-2">
                        <a 
                            href={playlist.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300"
                        >
                            Abrir App <ExternalLink size={12} />
                        </a>
                        <button 
                          onClick={() => deletePlaylist(playlist.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
      )}
    </div>
  );
}
