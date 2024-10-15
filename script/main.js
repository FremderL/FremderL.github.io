if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch(error => {
          console.log('Error al registrar el Service Worker:', error);
        });
    });
  }
  
document.addEventListener('DOMContentLoaded', function() {
    // Cargar tareas desde localStorage cuando la página se carga
    cargarTareas();

    document.getElementById('nuevaTarea').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            tarea();
        }
    });
});

function tarea() {
    var texto = document.getElementById('nuevaTarea').value.trim();
    if (texto === "") {
        alert('Ingresa una tarea');
        return false;
    }

    if (texto.length > 250) {
        alert('La tarea no puede tener más de 250 caracteres');
        return false;
    }

    // Verificar si la tarea ya existe
    if (tareaExiste(texto)) {
        alert('La tarea ya existe');
        return false;
    }

    var fecha = new Date().toLocaleDateString();
    var contenedor = document.createElement('div');
    contenedor.className = 'contenedores';
    var contentText = document.createElement('span');
    contentText.textContent = texto;

    var fechaText = document.createElement('span');
    fechaText.className = 'fecha';
    fechaText.textContent = ` (${fecha})`;

    var editar = document.createElement('button');
    editar.className = 'editar';
    editar.textContent = 'Editar';
    editar.addEventListener('click', function() {
        iniciarEdicion(contenedor, contentText, editar);
    });

    var borrar = document.createElement('button');
    borrar.className = 'borrar';
    borrar.textContent = 'Borrar';
    borrar.addEventListener('click', function() {
        borrarTarea(contenedor, texto);
    });

    contenedor.appendChild(contentText);
    contenedor.appendChild(fechaText);
    contenedor.appendChild(editar);
    contenedor.appendChild(borrar);

    var contenedorPrincipal = document.getElementById('contenedorPrincipal');
    contenedorPrincipal.appendChild(contenedor);

    // Guardar la tarea en localStorage
    guardarTarea(texto, fecha);

    document.getElementById('nuevaTarea').value = '';
}

function tareaExiste(texto) {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    return tareas.some(tarea => tarea.texto === texto);
}

function guardarTarea(texto, fecha) {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.push({ texto: texto, fecha: fecha });
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function borrarTarea(elemento, texto) {
    elemento.remove();

    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareas.filter(tarea => tarea.texto !== texto);
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function cargarTareas() {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.forEach(tarea => {
        var contenedor = document.createElement('div');
        contenedor.className = 'contenedores';
        var contentText = document.createElement('span');
        contentText.textContent = tarea.texto;

        var fechaText = document.createElement('span');
        fechaText.className = 'fecha';
        fechaText.textContent = ` (${tarea.fecha})`;

        var editar = document.createElement('button');
        editar.className = 'editar';
        editar.textContent = 'Editar';
        editar.addEventListener('click', function() {
            iniciarEdicion(contenedor, contentText, editar);
        });

        var borrar = document.createElement('button');
        borrar.className = 'borrar';
        borrar.textContent = 'Borrar';
        borrar.addEventListener('click', function() {
            borrarTarea(contenedor, tarea.texto);
        });

        contenedor.appendChild(contentText);
        contenedor.appendChild(fechaText);
        contenedor.appendChild(editar);
        contenedor.appendChild(borrar);

        var contenedorPrincipal = document.getElementById('contenedorPrincipal');
        contenedorPrincipal.appendChild(contenedor);
    });
}

function iniciarEdicion(elemento, contenido, botonEditar) {
    if (elemento.querySelector('.editar-tarea')) {
        return;
    }

    // Ocultar el botón de editar
    botonEditar.style.display = 'none';

    var editarInput = document.createElement('input');
    editarInput.className = 'editar-tarea';
    editarInput.type = 'text';
    editarInput.value = contenido.textContent;

    var botonGuardar = document.createElement('button');
    botonGuardar.textContent = 'Guardar';
    botonGuardar.className = 'boton-guardar';
    botonGuardar.addEventListener('click', function() {
        guardarCambios(elemento, contenido, editarInput, botonEditar);
    });

    var botonCancelar = document.createElement('button');
    botonCancelar.textContent = 'Cancelar';
    botonCancelar.className = 'boton-cancelar';
    botonCancelar.addEventListener('click', function() {
        cancelarEdicion(elemento, contenido, editarInput, botonEditar);
    });

    contenido.style.display = 'none';
    elemento.appendChild(editarInput);
    elemento.appendChild(botonGuardar);
    elemento.appendChild(botonCancelar);

    editarInput.focus();

    editarInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            guardarCambios(elemento, contenido, editarInput, botonEditar);
        }
    });
}

function guardarCambios(elemento, contenido, editarInput, botonEditar) {
    var nuevoTexto = editarInput.value.trim();

    if (nuevoTexto === '') {
        alert('Por favor, ingresa un texto válido.');
        return;
    }

    if (nuevoTexto.length > 250) {
        alert('La tarea no puede tener más de 250 caracteres');
        return;
    }

    var fecha = new Date().toLocaleDateString();
    contenido.textContent = nuevoTexto;
    elemento.querySelector('.fecha').textContent = ` (${fecha})`;

    // Actualizar localStorage
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareas.map(tarea => tarea.texto === contenido.textContent ? { texto: nuevoTexto, fecha: fecha } : tarea);
    localStorage.setItem('tareas', JSON.stringify(tareas));

    // Elimina el campo de edición, el botón de guardar y el botón de cancelar
    elemento.removeChild(editarInput);
    elemento.removeChild(elemento.querySelector('.boton-guardar'));
    elemento.removeChild(elemento.querySelector('.boton-cancelar'));

    // Mostrar el botón de editar nuevamente
    botonEditar.style.display = '';

    contenido.style.display = '';
}

function cancelarEdicion(elemento, contenido, editarInput, botonEditar) {
    // Elimina el campo de edición, el botón de guardar y el botón de cancelar
    elemento.removeChild(editarInput);
    elemento.removeChild(elemento.querySelector('.boton-guardar'));
    elemento.removeChild(elemento.querySelector('.boton-cancelar'));

    // Mostrar el botón de editar nuevamente
    botonEditar.style.display = '';

    contenido.style.display = '';
}
