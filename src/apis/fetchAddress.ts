export const fetchAddress = async (lat: number, lng: number): Promise<string> => {
  console.debug('[API] fetchAddress');

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&email=photomap24@gmail.com&zoom=10&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.display_name.split(', ').slice(-3).join(', ');
};
