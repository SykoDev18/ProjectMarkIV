import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock,
  Trash2,
  Edit3,
  X,
  MapPin,
  Bell,
  ExternalLink,
  CloudOff,
  Check,
  RefreshCw,
  LogOut,
  Loader2
} from 'lucide-react';
import { triggerHaptic } from '../utils';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday, addWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_CONFIG } from '../config/apiKeys';

const COLORS = [
  { name: 'Azul', value: 'bg-blue-500', border: 'border-blue-500' },
  { name: 'Verde', value: 'bg-green-500', border: 'border-green-500' },
  { name: 'Rojo', value: 'bg-red-500', border: 'border-red-500' },
  { name: 'Amarillo', value: 'bg-yellow-500', border: 'border-yellow-500' },
  { name: 'Morado', value: 'bg-purple-500', border: 'border-purple-500' },
  { name: 'Rosa', value: 'bg-pink-500', border: 'border-pink-500' },
];

const CATEGORIES = [
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'work', name: 'Trabajo', icon: '💼' },
  { id: 'health', name: 'Salud', icon: '🏥' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'finance', name: 'Finanzas', icon: '💰' },
  { id: 'education', name: 'Educación', icon: '📚' },
];

export default function Agenda({ data, updateData }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('calendar'); // calendar, list
  
  // Google Calendar state
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const tokenClientRef = useRef(null);

  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    color: 'bg-blue-500',
    category: 'personal',
    reminder: '30',
    allDay: false
  });

  // Initialize Google API
  useEffect(() => {
    const initGapi = () => {
      if (window.gapi) {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              discoveryDocs: API_CONFIG.google.discoveryDocs,
            });
            setGapiInited(true);
            console.log('GAPI client initialized');
          } catch (err) {
            console.error('Error initializing GAPI client:', err);
          }
        });
      }
    };

    const initGis = () => {
      if (window.google?.accounts?.oauth2) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: API_CONFIG.google.clientId,
          scope: API_CONFIG.google.scopes,
          callback: (tokenResponse) => {
            if (tokenResponse.error) {
              console.error('Token error:', tokenResponse);
              return;
            }
            setGoogleConnected(true);
            fetchGoogleEvents();
          },
        });
        setGisInited(true);
        console.log('GIS initialized');
      }
    };

    // Check if scripts are already loaded
    if (window.gapi) {
      initGapi();
    } else {
      // Wait for gapi to load
      const checkGapi = setInterval(() => {
        if (window.gapi) {
          clearInterval(checkGapi);
          initGapi();
        }
      }, 100);
      setTimeout(() => clearInterval(checkGapi), 5000);
    }

    if (window.google?.accounts?.oauth2) {
      initGis();
    } else {
      const checkGis = setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          clearInterval(checkGis);
          initGis();
        }
      }, 100);
      setTimeout(() => clearInterval(checkGis), 5000);
    }
  }, []);

  // Fetch Google Calendar events
  const fetchGoogleEvents = async () => {
    if (!window.gapi?.client?.calendar) {
      console.log('Google Calendar API not ready');
      return;
    }
    
    setLoadingGoogle(true);
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date(new Date().getFullYear(), 0, 1).toISOString(),
        timeMax: addWeeks(new Date(), 12).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime',
      });

      const events = response.result.items || [];
      const formattedEvents = events.map(event => ({
        id: `google_${event.id}`,
        googleId: event.id,
        title: event.summary || 'Sin título',
        date: event.start.date || event.start.dateTime?.split('T')[0],
        startTime: event.start.dateTime ? format(new Date(event.start.dateTime), 'HH:mm') : null,
        endTime: event.end.dateTime ? format(new Date(event.end.dateTime), 'HH:mm') : null,
        allDay: !!event.start.date,
        location: event.location || '',
        description: event.description || '',
        color: 'bg-green-500',
        category: 'work',
        isGoogle: true,
        htmlLink: event.htmlLink
      }));

      setGoogleEvents(formattedEvents);
      console.log('Fetched', formattedEvents.length, 'Google Calendar events');
    } catch (err) {
      console.error('Error fetching Google Calendar events:', err);
      if (err.status === 401) {
        setGoogleConnected(false);
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Connect to Google Calendar
  const connectGoogle = () => {
    if (!tokenClientRef.current) {
      alert('Google Identity Services no está listo. Recarga la página.');
      return;
    }
    triggerHaptic();
    tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
  };

  // Disconnect from Google Calendar
  const disconnectGoogle = () => {
    const token = window.gapi?.client?.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
    setGoogleConnected(false);
    setGoogleEvents([]);
    triggerHaptic();
  };

  const localEvents = useMemo(() => data?.agenda?.events || [], [data?.agenda?.events]);
  
  // Combine local and Google events
  const events = useMemo(() => {
    return [...localEvents, ...googleEvents];
  }, [localEvents, googleEvents]);

  // Calendar grid generation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getEventsForDate = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr).sort((a, b) => a.startTime?.localeCompare(b.startTime));
  }, [events]);

  const selectedDateEvents = useMemo(() => getEventsForDate(selectedDate), [selectedDate, getEventsForDate]);

  const upcomingEvents = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime?.localeCompare(b.startTime))
      .slice(0, 10);
  }, [events]);

  if (!data) return null;

  const resetForm = () => {
    setEventForm({
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      description: '',
      color: 'bg-blue-500',
      category: 'personal',
      reminder: '30',
      allDay: false
    });
    setEditingEvent(null);
  };

  const openAddEvent = (date = selectedDate) => {
    resetForm();
    setEventForm(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    setShowEventModal(true);
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      startTime: event.startTime || '09:00',
      endTime: event.endTime || '10:00',
      location: event.location || '',
      description: event.description || '',
      color: event.color || 'bg-blue-500',
      category: event.category || 'personal',
      reminder: event.reminder || '30',
      allDay: event.allDay || false
    });
    setShowEventModal(true);
  };

  const saveEvent = () => {
    if (!eventForm.title.trim()) return;
    triggerHaptic();

    const eventData = {
      ...eventForm,
      id: editingEvent?.id || Date.now(),
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let newEvents;
    if (editingEvent) {
      newEvents = localEvents.map(e => e.id === editingEvent.id ? eventData : e);
    } else {
      newEvents = [...localEvents, eventData];
    }

    updateData('agenda', { ...data.agenda, events: newEvents });
    setShowEventModal(false);
    resetForm();
  };

  const deleteEvent = (eventId) => {
    // Don't allow deleting Google events from here
    if (String(eventId).startsWith('google_')) {
      alert('Los eventos de Google Calendar solo se pueden eliminar desde Google Calendar');
      return;
    }
    triggerHaptic();
    const newEvents = localEvents.filter(e => e.id !== eventId);
    updateData('agenda', { ...data.agenda, events: newEvents });
  };

  return (
    <div className="space-y-4">
      {/* Header with Google Calendar status */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Calendario
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Próximos
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {loadingGoogle && (
            <Loader2 size={14} className="text-blue-400 animate-spin" />
          )}
          {googleConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check size={12} /> Google Calendar
              </span>
              <button 
                onClick={fetchGoogleEvents}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                title="Sincronizar"
              >
                <RefreshCw size={12} className="text-gray-400" />
              </button>
              <button 
                onClick={disconnectGoogle}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                title="Desconectar"
              >
                <LogOut size={12} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={connectGoogle}
              disabled={!gapiInited || !gisInited}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                gapiInited && gisInited 
                  ? 'text-blue-400 hover:bg-gray-800' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              <CalendarIcon size={12} /> Conectar Google
            </button>
          )}
        </div>
      </div>

      {view === 'calendar' ? (
        <>
          {/* Month Navigation */}
          <IOSCard>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
              <div className="text-center">
                <h2 className="text-lg font-bold capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h2>
                <button 
                  onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Hoy
                </button>
              </div>
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </IOSCard>

          {/* Calendar Grid */}
          <IOSCard className="p-2">
            {/* Day names */}
            <div className="grid grid-cols-7 mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);

                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setSelectedDate(day); triggerHaptic(); }}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-blue-500 text-white' 
                        : isTodayDate
                          ? 'bg-blue-500/20 text-blue-400'
                          : isCurrentMonth 
                            ? 'hover:bg-gray-800 text-white' 
                            : 'text-gray-600'
                    }`}
                  >
                    <span className="text-sm font-medium">{format(day, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${e.color}`} />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </IOSCard>

          {/* Selected Date Events */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400">
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </h3>
              <IOSButton onClick={() => openAddEvent()} variant="secondary" className="!py-1.5 !px-3">
                <Plus size={16} className="mr-1" /> Evento
              </IOSButton>
            </div>

            {selectedDateEvents.length === 0 ? (
              <IOSCard className="text-center py-8">
                <CalendarIcon size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No hay eventos este día</p>
              </IOSCard>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={() => openEditEvent(event)}
                    onDelete={() => deleteEvent(event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* List View - Upcoming Events */
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-400">Próximos eventos</h3>
            <IOSButton onClick={() => openAddEvent(new Date())} variant="secondary" className="!py-1.5 !px-3">
              <Plus size={16} className="mr-1" /> Nuevo
            </IOSButton>
          </div>

          {upcomingEvents.length === 0 ? (
            <IOSCard className="text-center py-8">
              <CalendarIcon size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No hay eventos próximos</p>
            </IOSCard>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  showDate
                  onEdit={() => openEditEvent(event)}
                  onDelete={() => deleteEvent(event.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  {editingEvent ? 'Editar evento' : 'Nuevo evento'}
                </h2>
                <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-gray-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Título *</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Nombre del evento"
                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Fecha</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eventForm.allDay}
                        onChange={(e) => setEventForm({ ...eventForm, allDay: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      Todo el día
                    </label>
                  </div>
                </div>

                {!eventForm.allDay && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Hora inicio</label>
                      <input
                        type="time"
                        value={eventForm.startTime}
                        onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Hora fin</label>
                      <input
                        type="time"
                        value={eventForm.endTime}
                        onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Ubicación</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Lugar del evento"
                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setEventForm({ ...eventForm, category: cat.id })}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors ${
                          eventForm.category === cat.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <span>{cat.icon}</span> {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setEventForm({ ...eventForm, color: color.value })}
                        className={`w-8 h-8 rounded-full ${color.value} ${
                          eventForm.color === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Reminder */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Recordatorio</label>
                  <select
                    value={eventForm.reminder}
                    onChange={(e) => setEventForm({ ...eventForm, reminder: e.target.value })}
                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
                  >
                    <option value="0">Sin recordatorio</option>
                    <option value="5">5 minutos antes</option>
                    <option value="15">15 minutos antes</option>
                    <option value="30">30 minutos antes</option>
                    <option value="60">1 hora antes</option>
                    <option value="1440">1 día antes</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Notas</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Descripción o notas adicionales"
                    rows={3}
                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <IOSButton onClick={saveEvent} variant="primary" className="flex-1">
                    {editingEvent ? 'Guardar cambios' : 'Crear evento'}
                  </IOSButton>
                  {editingEvent && (
                    <IOSButton 
                      onClick={() => { deleteEvent(editingEvent.id); setShowEventModal(false); }} 
                      variant="secondary"
                      className="!bg-red-500/20 !text-red-400"
                    >
                      <Trash2 size={18} />
                    </IOSButton>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Calendar Setup Info */}
      {!googleConnected && gapiInited && gisInited && (
        <IOSCard className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border-blue-500/30">
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CalendarIcon size={20} className="text-blue-400" />
              <span className="font-medium text-white">Sincroniza con Google Calendar</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Ve tus eventos de Google Calendar junto con tus eventos locales
            </p>
            <IOSButton 
              variant="primary" 
              className="!py-2"
              onClick={connectGoogle}
            >
              <ExternalLink size={14} className="mr-1" /> Conectar Google Calendar
            </IOSButton>
          </div>
        </IOSCard>
      )}

      {googleConnected && googleEvents.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          {googleEvents.length} eventos sincronizados de Google Calendar
        </div>
      )}
    </div>
  );
}

// Event Card Component
function EventCard({ event, showDate, onEdit, onDelete }) {
  const category = CATEGORIES.find(c => c.id === event.category);
  const isGoogleEvent = event.isGoogle;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <IOSCard className={`border-l-4 ${event.color?.replace('bg-', 'border-') || 'border-blue-500'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {category && <span className="text-sm">{category.icon}</span>}
              <h4 className="font-medium text-white truncate">{event.title}</h4>
              {isGoogleEvent && (
                <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                  Google
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
              {showDate && (
                <span className="flex items-center gap-1">
                  <CalendarIcon size={12} />
                  {format(parseISO(event.date), "d MMM", { locale: es })}
                </span>
              )}
              {!event.allDay && event.startTime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {event.startTime} - {event.endTime}
                </span>
              )}
              {event.allDay && (
                <span className="text-blue-400">Todo el día</span>
              )}
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {event.location}
                </span>
              )}
            </div>

            {event.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description}</p>
            )}
          </div>

          <div className="flex items-center gap-1 ml-2">
            {isGoogleEvent ? (
              <a 
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Ver en Google Calendar"
              >
                <ExternalLink size={14} />
              </a>
            ) : (
              <>
                <button 
                  onClick={onEdit}
                  className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  onClick={onDelete}
                  className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </IOSCard>
    </motion.div>
  );
}
