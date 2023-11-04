export const fetchAddress = async (lat: number, lng: number): Promise<string> => {
  console.debug('[API] fetchAddress');

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&email=photomap24@gmail.com&zoom=10&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const json = await res.json();
  const { country, state, county, city } = json.address;

  if (!country) {
    throw new Error('No Address');
  }

  if (city) {
    return `${city}-${country}`;
  } else if (county) {
    return `${county}-${country}`;
  } else if (state) {
    return `${state}-${country}`;
  } else {
    return country;
  }
};
