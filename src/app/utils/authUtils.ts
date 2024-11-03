export const logout = () => {
    // Limpiar todos los datos de autenticación del localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user-Type');
    
    // Redireccionar al inicio
    window.location.href = '/';
  };