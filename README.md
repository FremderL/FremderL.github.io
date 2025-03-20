# FremderL.github.io

Este repositorio contiene el código fuente de la página web personal de FremderL. La página está construida utilizando HTML, CSS y JavaScript. A continuación, se proporciona una descripción de los elementos utilizados y cómo crear una base de datos MySQL utilizando Docker.

## Descripción de la Página

La página web incluye las siguientes secciones y funcionalidades:

- **Inicio**: Una introducción breve del propietario de la página.
- **Sobre mí**: Información detallada sobre el propietario, incluyendo su experiencia y habilidades.
- **Proyectos**: Una lista de proyectos realizados con enlaces a sus repositorios.
- **Contacto**: Un formulario de contacto para que los visitantes puedan enviar mensajes.

## Tecnologías Utilizadas

- **HTML**: Estructura de la página web.
- **CSS**: Estilos y diseño de la página web.
- **JavaScript**: Funcionalidades interactivas de la página web.

## Crear una Base de Datos MySQL con Docker

Para configurar y ejecutar una base de datos MySQL utilizando Docker, sigue los siguientes pasos:

### Paso 1: Crear el Archivo Dockerfile

Crea un archivo llamado `Dockerfile` en la raíz del repositorio con el siguiente contenido:

````dockerfile
# Usamos una imagen base de MySQL
FROM mysql:8.0

# Copiamos el script SQL de inicialización al contenedor
COPY ./init.sql /docker-entrypoint-initdb.d/

# Exponemos el puerto 3306
EXPOSE 3306
