const API_CONFIG = {
  BASE_URL: 'http://localhost:3001' // Cambia esto por tu IP cuando lo necesites
};

export const getApiUrl = (endpoint = '') => {
  // Elimina barras diagonales duplicadas
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
};

export default API_CONFIG;