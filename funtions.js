const scene = getScene(code, isDay);
    applyBackground(scene);
    renderEffects(scene);

function getScene(code, isDay) {
  if (!isDay) return 'night';
  if (code === 45 || code === 48) return 'fog';
  if ((code>=71&&code<=77)||(code>=85&&code<=86)) return 'snowy';
  if (code>=95) return 'thunderstorm';
  if ((code>=51&&code<=67)||(code>=80&&code<=82)) return 'rainy';
  if (code===0) return 'sunny';
  if (code<=2) return 'partly-cloudy';
  return 'cloudy';
}