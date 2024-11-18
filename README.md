# SGITT Frontend

## Descripción

Sistema de Gestión Integral para Trabajo Terminal (SGITT) es una plataforma web diseñada para facilitar la gestión y seguimiento de propuestas de trabajos terminales entre alumnos y profesores. Esta aplicación permite a los usuarios buscar, crear y administrar propuestas, así como establecer comunicación entre los participantes.

## Características Principales

- 🔐 **Autenticación de Usuarios**
  - Registro diferenciado para alumnos y profesores
  - Verificación de correo electrónico
  - Gestión de sesiones con JWT

- 👤 **Perfiles de Usuario**
  - Perfiles personalizados para alumnos y profesores
  - Gestión de áreas de conocimiento
  - Historial de propuestas

- 📝 **Gestión de Propuestas**
  - Creación y edición de propuestas
  - Sistema de búsqueda avanzada
  - Filtros por carrera, área y tipo de propuesta

- 💬 **Sistema de Chat**
  - Comunicación en tiempo real
  - Historial de conversaciones
  - Notificaciones

## Tecnologías Utilizadas

- [Next.js 14](https://nextjs.org/) - Framework de React
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript tipado
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Lucide React](https://lucide.dev/) - Iconos
- [Zustand](https://zustand-demo.pmnd.rs/) - Gestión de estado
- [Axios](https://axios-http.com/) - Cliente HTTP

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Git

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/sgitt-front.git
cd sgitt-front
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

```
sgitt-front/
├── public/           # Archivos estáticos
├── src/
│   ├── app/         # Páginas y rutas de la aplicación
│   ├── components/  # Componentes reutilizables
│   ├── utils/       # Utilidades y funciones auxiliares
│   └── styles/      # Estilos globales
├── package.json
└── tsconfig.json
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## Convenciones de Código

- Utilizar TypeScript para todos los archivos nuevos
- Seguir el estilo de código de ESLint configurado
- Utilizar componentes funcionales con hooks
- Nombrar los archivos en formato PascalCase para componentes
- Mantener los componentes pequeños y reutilizables

## Despliegue

Para desplegar en producción:

1. Construir la aplicación:
```bash
npm run build
```

2. Verificar la construcción localmente:
```bash
npm run start
```

3. Desplegar en tu plataforma preferida (Vercel, Netlify, etc.)

## Contribuir

1. Fork del repositorio
2. Crear una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Realizar cambios y commits (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

- Nombre del Equipo - TT 2024 B163
- Email del Proyecto - sgitt@gmail.com

## Agradecimientos

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)