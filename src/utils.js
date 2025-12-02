export const addToCalendar = (title, details = "") => {
  const text = encodeURIComponent(title);
  const det = encodeURIComponent(details);
  const now = new Date();
  const start = now.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${det}&dates=${start}/${end}`;
  window.open(url, '_blank');
};

export const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };

export const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('spotify.com') && !url.includes('/embed')) {
    return url.replace('spotify.com', 'spotify.com/embed');
  }
  return url; 
};
