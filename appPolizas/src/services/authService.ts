const TOKEN_KEY = 'token';

type AuthResponse = {
  token?: string;
  nombre?: string;
  rol?: string;
};

export const authService = {
  login: async (login: string, contrasena: string): Promise<AuthResponse> => {
    const response = await fetch('https://webapi-polizas-hjgroup-g4a0dwb2bpcndgcz.canadacentral-01.azurewebsites.net/api/Auth/Acceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, contrasena }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const message = await response.text();
        throw new Error(message || "Usuario o contraseña incorrectos");
      }
      throw new Error("Error al comunicarse con el servidor");
    }

    const data: AuthResponse = await response.json();

    if (!data.token) {
      throw new Error("Token no recibido. Verifique las credenciales.");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    return data; // ✅ Esto era lo que faltaba
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
