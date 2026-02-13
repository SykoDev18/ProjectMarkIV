import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  ExternalLink, 
  Plus, 
  Trash2, 
  X, 
  Search,
  ListMusic,
  Link,
  Sparkles,
  Edit2,
  Check
} from 'lucide-react';
import { getEmbedUrl, triggerHaptic } from '../utils';

// Popular playlist suggestions (no API needed)
const SUGGESTED_PLAYLISTS = [
  { name: "Lo-Fi Beats", url: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn", category: "Focus" },
  { name: "Deep Focus", url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ", category: "Focus" },
  { name: "Peaceful Piano", url: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO", category: "Relax" },
  { name: "Beast Mode", url: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP", category: "Workout" },
  { name: "Power Workout", url: "https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh", category: "Workout" },
  { name: "Motivation Mix", url: "https://open.spotify.com/playlist/37i9dQZF1DXdxcBWuJkbcy", category: "Motivation" },
  { name: "Chill Hits", url: "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6", category: "Chill" },
  { name: "Jazz Vibes", url: "https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT", category: "Relax" },
];

export default function Playlists({ data, updateData }) {
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('library'); // library, discover
  const [searchFilter, setSearchFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!data) return null;

  const playlists = data.playlists?.items || [];

  // Extract Spotify ID from various URL formats
  const extractSpotifyId = (url) => {
    const patterns = [
      /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
      /spotify\.com\/album\/([a-zA-Z0-9]+)/,
      /spotify\.com\/track\/([a-zA-Z0-9]+)/,
      /spotify\.com\/embed\/playlist\/([a-zA-Z0-9]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return { id: match[1], type: url.includes('/album/') ? 'album' : url.includes('/track/') ? 'track' : 'playlist' };
    }
    return null;
  };

  const addPlaylist = () => {
    if (!newPlaylistUrl) return;
    
    const extracted = extractSpotifyId(newPlaylistUrl);
    if (!extracted) {
      alert('URL de Spotify no válida. Pega un enlace de playlist, álbum o canción.');
      return;
    }

    triggerHaptic();
    const cleanUrl = `https://open.spotify.com/${extracted.type}/${extracted.id}`;
    
    const newPlaylist = {
      id: Date.now(),
      name: newPlaylistName || `${extracted.type === 'playlist' ? 'Playlist' : extracted.type === 'album' ? 'Álbum' : 'Canción'} ${playlists.length + 1}`,
      url: cleanUrl,
      type: extracted.type,
      addedAt: new Date().toISOString()
    };
    
    updateData('playlists', { ...data.playlists, items: [...playlists, newPlaylist] });
    setNewPlaylistUrl('');
    setNewPlaylistName('');
    setShowAdd(false);
  };

  const addSuggested = (suggestion) => {
    triggerHaptic();
    const newPlaylist = {
      id: Date.now(),
      name: suggestion.name,
      url: suggestion.url,
      type: 'playlist',
      category: suggestion.category,
      addedAt: new Date().toISOString()
    };
    updateData('playlists', { ...data.playlists, items: [...playlists, newPlaylist] });
  };

  const deletePlaylist = (id) => {
    triggerHaptic();
    const newItems = playlists.filter(p => p.id !== id);
    updateData('playlists', { ...data.playlists, items: newItems });
  };

  const startEditing = (playlist) => {
    setEditingId(playlist.id);
    setEditName(playlist.name);
  };

  const saveEdit = (id) => {
    if (!editName.trim()) return;
    triggerHaptic();
    const newItems = playlists.map(p => 
      p.id === id ? { ...p, name: editName.trim() } : p
    );
    updateData('playlists', { ...data.playlists, items: newItems });
    setEditingId(null);
  };

  // Filter playlists by search
  const filteredPlaylists = playlists.filter(p => 
    p.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Filter suggestions by category
  const filteredSuggestions = selectedCategory === 'all' 
    ? SUGGESTED_PLAYLISTS 
    : SUGGESTED_PLAYLISTS.filter(s => s.category === selectedCategory);

  const categories = ['all', ...new Set(SUGGESTED_PLAYLISTS.map(s => s.category))];

  return (
    <div className="space-y-4">
      {/* Header with tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'library' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            <ListMusic size={16} className="inline mr-1" /> Mi Música
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'discover' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            <Sparkles size={16} className="inline mr-1" /> Descubrir
          </button>
        </div>
        
        {activeTab === 'library' && (
          <IOSButton size="sm" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? <X size={18} /> : <Plus size={18} />}
          </IOSButton>
        )}
      </div>

      {activeTab === 'library' ? (
        <>
          {/* Add playlist form */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <IOSCard>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Link size={14} /> Pega un enlace de Spotify
                    </div>
                    <input 
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Nombre (opcional)..."
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                    />
                    <div className="flex gap-2">
                      <input 
                        value={newPlaylistUrl}
                        onChange={(e) => setNewPlaylistUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPlaylist()}
                        placeholder="https://open.spotify.com/playlist/..."
                        className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                      />
                      <IOSButton onClick={addPlaylist} variant="primary">
                        Añadir
                      </IOSButton>
                    </div>
                    <p className="text-xs text-gray-500">
                      Soporta playlists, álbumes y canciones de Spotify
                    </p>
                  </div>
                </IOSCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search filter */}
          {playlists.length > 3 && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar en tu biblioteca..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
              />
            </div>
          )}

          {/* Playlists Library */}
          {filteredPlaylists.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Music size={48} className="mx-auto mb-3 opacity-20" />
              <p>{searchFilter ? 'No se encontraron playlists' : 'Añade playlists de Spotify'}</p>
              {!searchFilter && (
                <IOSButton 
                  onClick={() => setActiveTab('discover')} 
                  variant="secondary" 
                  className="mt-4"
                >
                  <Sparkles size={16} className="mr-2" /> Explorar sugerencias
                </IOSButton>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlaylists.map(playlist => (
                <motion.div
                  key={playlist.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <IOSCard className="p-0 overflow-hidden group">
                    <div className="p-4 flex justify-between items-center bg-green-900/20">
                      {editingId === playlist.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(playlist.id)}
                            className="flex-1 bg-gray-800 px-3 py-1 rounded-lg text-white outline-none border border-gray-600 focus:border-green-500"
                            autoFocus
                          />
                          <button onClick={() => saveEdit(playlist.id)} className="text-green-400 p-1">
                            <Check size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 p-1">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <Music size={20} className="text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-bold">{playlist.name}</h3>
                              {playlist.type && playlist.type !== 'playlist' && (
                                <span className="text-xs text-gray-500 capitalize">{playlist.type}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => startEditing(playlist)}
                              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity p-1"
                            >
                              <Edit2 size={14} />
                            </button>
                            <a 
                              href={playlist.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300"
                            >
                              Abrir <ExternalLink size={12} />
                            </a>
                            <button 
                              onClick={() => deletePlaylist(playlist.id)}
                              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="aspect-[2/1] w-full bg-black">
                      <iframe 
                        src={getEmbedUrl(playlist.url)} 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={playlist.name}
                        className="rounded-b-xl"
                      ></iframe>
                    </div>
                  </IOSCard>
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Discover Tab - Curated Suggestions */
        <div className="space-y-4">
          <IOSCard className="bg-gradient-to-br from-green-900/30 to-gray-900 border-green-500/20">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Sparkles size={24} className="text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Playlists populares</h3>
                <p className="text-sm text-gray-400">
                  Selecciona para añadir a tu biblioteca
                </p>
              </div>
            </div>
          </IOSCard>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>

          {/* Suggestions Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredSuggestions.map((suggestion, idx) => {
              const alreadyAdded = playlists.some(p => p.url === suggestion.url);
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !alreadyAdded && addSuggested(suggestion)}
                  disabled={alreadyAdded}
                  className={`text-left ${alreadyAdded ? 'opacity-50' : ''}`}
                >
                  <IOSCard className={`h-full ${alreadyAdded ? '' : 'hover:bg-gray-800/50'} transition-colors`}>
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Music size={20} className="text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{suggestion.name}</h4>
                        <span className="text-xs text-gray-500">{suggestion.category}</span>
                      </div>
                      {alreadyAdded ? (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <Check size={12} /> Añadida
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Plus size={12} /> Añadir
                        </span>
                      )}
                    </div>
                  </IOSCard>
                </motion.button>
              );
            })}
          </div>

          {/* Spotify Web Search Link */}
          <IOSCard className="text-center">
            <p className="text-sm text-gray-400 mb-3">
              ¿Buscas algo específico?
            </p>
            <a
              href="https://open.spotify.com/search"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-400 transition-colors"
            >
              <Search size={16} /> Buscar en Spotify
              <ExternalLink size={14} />
            </a>
            <p className="text-xs text-gray-500 mt-2">
              Copia el enlace y pégalo en "Mi Música"
            </p>
          </IOSCard>
        </div>
      )}
    </div>
  );
}
