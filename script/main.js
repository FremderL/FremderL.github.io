document.addEventListener('DOMContentLoaded', function() {
    cargarListas();
    mostrarHome(); // Muestra solo las listas al inicio
});

function mostrarHome() {
    document.getElementById('crear-lista').style.display = 'none';
    document.getElementById('crear-tarea').style.display = 'none';
    document.getElementById('listas').style.display = 'block';
    document.getElementById('tareas').style.display = 'none';
    cargarListas();
}

function mostrarCrearLista() {
    document.getElementById('crear-lista').style.display = 'block';
    document.getElementById('listas').style.display = 'none';
    document.getElementById('tareas').style.display = 'none';
    document.getElementById('crear-tarea').style.display = 'none'; // Asegura que la sección de tareas esté oculta
}

function mostrarCrearTarea() {
    document.getElementById('crear-tarea').style.display = 'block';
    document.getElementById('contenedorTareas').style.display = 'none'; // Ocultar tareas mientras se crea una nueva
}

function cargarListas() {
    const contenedorListas = document.getElementById('contenedorListas');
    contenedorListas.innerHTML = '';
    const listas = Object.keys(localStorage);

    listas.forEach(lista => {
        const divLista = document.createElement('div');
        divLista.className = 'lista';
        divLista.innerHTML = `
            <h3>
                <span id="nombreLista-${lista}" onclick="cargarTareas('${lista}'); cancelMenu('${lista}')">${lista}</span>
                <button onclick="toggleMenu('${lista}')">⋮</button>
                <div id="menu-${lista}" style="display: none;">
                    <button onclick="seleccionarOpcion('${lista}', 'editar')">Editar</button>
                    <button onclick="seleccionarOpcion('${lista}', 'borrar')">Borrar</button>
                    <button onclick="cancelarMenu('${lista}')">Cancelar</button>
                </div>
            </h3>
        `;
        contenedorListas.appendChild(divLista);
    });
}

function crearLista() {
    const nombreLista = document.getElementById('nombreLista').value.trim();
    if (nombreLista.length > 20) {
        mostrarNotificacion('El nombre de la lista no puede exceder 20 caracteres.');
        return;
    }
    localStorage.setItem(nombreLista, JSON.stringify([]));
    document.getElementById('nombreLista').value = '';
    mostrarNotificacion(`Lista "${nombreLista}" creada.`);
    cargarListas();
}

function cargarTareas(nombreLista) {
    document.getElementById('listas').style.display = 'none';
    document.getElementById('tareas').style.display = 'block';
    document.getElementById('nombreListaActual').innerText = nombreLista;
    document.getElementById('contenedorTareas').innerHTML = '';
    const tareas = JSON.parse(localStorage.getItem(nombreLista)) || [];
    tareas.forEach(tarea => {
        const divTarea = document.createElement('div');
        divTarea.className = 'contenedores';
        divTarea.innerHTML = `<span>${tarea.nombre} - ${tarea.fecha}</span>`;
        document.getElementById('contenedorTareas').appendChild(divTarea);
    });
}

function agregarTarea() {
    const nombreLista = document.getElementById('nombreListaActual').innerText;
    const nuevaTarea = document.getElementById('nuevaTarea').value.trim();
    const fechaEntrega = document.getElementById('fechaEntrega').value;

    if (nuevaTarea.length > 150) {
        mostrarNotificacion('La tarea no puede exceder 150 caracteres.');
        return;
    }

    const tareas = JSON.parse(localStorage.getItem(nombreLista)) || [];
    tareas.push({ nombre: nuevaTarea, fecha: fechaEntrega });
    localStorage.setItem(nombreLista, JSON.stringify(tareas));
    document.getElementById('nuevaTarea').value = '';
    document.getElementById('fechaEntrega').value = '';
    cargarTareas(nombreLista);
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');
    notificacion.style.display = 'block';
    notificacion.innerText = mensaje;
    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 3000);
}

function seleccionarOpcion(lista, accion) {
    if (accion === 'editar') {
        // Implementa la lógica de edición si es necesario
        alert('Función de edición no implementada.');
    } else if (accion === 'borrar') {
        localStorage.removeItem(lista);
        mostrarNotificacion(`Lista "${lista}" eliminada.`);
        cargarListas();
        cancelMenu(lista);
    }
}

function toggleMenu(lista) {
    const menu = document.getElementById(`menu-${lista}`);
    const isVisible = menu.style.display === 'block';
    // Cierra todos los menús
    const todosMenus = document.querySelectorAll('.offcanvas-body div');
    todosMenus.forEach(m => m.style.display = 'none');
    // Abre el menú solo si estaba cerrado
    if (!isVisible) {
        menu.style.display = 'block';
    }
}

function cancelarMenu(lista) {
    const menu = document.getElementById(`menu-${lista}`);
    menu.style.display = 'none';
}
