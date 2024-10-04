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
                <span id="nombreLista-${lista}" onclick="cargarTareas('${lista}')">${lista}</span>
                <button onclick="toggleMenu('${lista}')">⋮</button>
                <div id="menu-${lista}" style="display: none;">
                    <button onclick="editarLista('${lista}')">Editar</button>
                    <button onclick="borrarLista('${lista}')">Borrar</button>
                    <button onclick="cancelarMenu('${lista}')">Cancelar</button>
                </div>
            </h3>
        `;
        contenedorListas.appendChild(divLista);
    });
}

function crearLista() {
    const nombreLista = document.getElementById('nombreLista').value.trim();
    if (nombreLista === '' || localStorage.getItem(nombreLista)) {
        alert('Por favor, ingresa un nombre único para la lista.');
        return;
    }
    localStorage.setItem(nombreLista, JSON.stringify([]));
    document.getElementById('nombreLista').value = '';
    cargarListas();
    mostrarHome();
}

function toggleMenu(lista) {
    const menu = document.getElementById(`menu-${lista}`);
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function cancelarMenu(lista) {
    const menu = document.getElementById(`menu-${lista}`);
    menu.style.display = 'none';
}

function borrarLista(nombreLista) {
    if (confirm(`¿Estás seguro de que deseas borrar la lista "${nombreLista}"?`)) {
        localStorage.removeItem(nombreLista);
        cargarListas();
    }
}

function editarLista(nombreActual) {
    const divLista = document.getElementById(`nombreLista-${nombreActual}`).parentElement;
    divLista.innerHTML = `
        <input type="text" id="nuevoNombreLista" value="${nombreActual}" />
        <button onclick="guardarEdicionLista('${nombreActual}')">Guardar</button>
        <button onclick="cancelarEdicionLista('${nombreActual}')">Cancelar</button>
    `;
}

function guardarEdicionLista(nombreActual) {
    const nuevoNombre = document.getElementById('nuevoNombreLista').value.trim();
    if (nuevoNombre === '' || localStorage.getItem(nuevoNombre)) {
        alert('Por favor, ingresa un nombre único para la lista.');
        return;
    }
    const tareas = localStorage.getItem(nombreActual);
    localStorage.removeItem(nombreActual);
    localStorage.setItem(nuevoNombre, tareas);
    cargarListas();
}

function cancelarEdicionLista(nombreActual) {
    cargarListas(); // Cargar las listas de nuevo, sin cambios
}

function cargarTareas(lista) {
    document.getElementById('nombreListaActual').innerText = lista;
    document.getElementById('crear-tarea').style.display = 'none'; // Ocultar la sección de crear tarea
    document.getElementById('contenedorTareas').style.display = 'block'; // Mostrar contenedor de tareas
    const contenedorTareas = document.getElementById('contenedorTareas');
    contenedorTareas.innerHTML = ''; // Limpiar contenido anterior
    document.getElementById('listas').style.display = 'none';
    document.getElementById('tareas').style.display = 'block';

    const tareas = JSON.parse(localStorage.getItem(lista)) || [];
    tareas.forEach((tarea, index) => {
        const divTarea = document.createElement('div');
        divTarea.className = 'contenedores';
        divTarea.innerHTML = `
            <span>${tarea.texto} (Fecha de Entrega: ${tarea.fecha})</span>
            <button onclick="editarTarea('${lista}', ${index})">✏️</button>
            <button onclick="borrarTarea('${lista}', ${index})">🗑️</button>
        `;
        contenedorTareas.appendChild(divTarea);
    });
}

function agregarTarea() {
    const lista = document.getElementById('nombreListaActual').innerText; // Obtener la lista actual
    const nuevaTarea = document.getElementById('nuevaTarea').value.trim();
    const fechaEntrega = document.getElementById('fechaEntrega').value;

    if (nuevaTarea === '') {
        alert('Por favor, ingresa una tarea.');
        return;
    }

    let tareas = JSON.parse(localStorage.getItem(lista)) || [];
    const tareaExistente = tareas.some(tarea => tarea.texto === nuevaTarea);
    if (tareaExistente) {
        alert('Esta tarea ya existe en la lista.');
        return;
    }

    tareas.push({ texto: nuevaTarea, fecha: fechaEntrega, realizada: false });
    localStorage.setItem(lista, JSON.stringify(tareas));
    cargarTareas(lista);
    document.getElementById('nuevaTarea').value = '';
    document.getElementById('fechaEntrega').value = '';
}

function borrarTarea(lista, index) {
    let tareas = JSON.parse(localStorage.getItem(lista));
    tareas.splice(index, 1);
    localStorage.setItem(lista, JSON.stringify(tareas));
    cargarTareas(lista);
}

function editarTarea(lista, index) {
    let tareas = JSON.parse(localStorage.getItem(lista));
    const tareaActual = tareas[index];

    const contenedorTareas = document.getElementById('contenedorTareas');
    const divTarea = contenedorTareas.children[index];

    divTarea.innerHTML = `
        <input type="text" value="${tareaActual.texto}" id="editTarea-${index}" />
        <button onclick="guardarEdicion('${lista}', ${index})">Guardar</button>
        <button onclick="cancelarEdicion('${lista}', ${index}, '${tareaActual.texto}')">Cancelar</button>
    `;
}

function guardarEdicion(lista, index) {
    const nuevaTareaTexto = document.getElementById(`editTarea-${index}`).value.trim();
    if (nuevaTareaTexto === '') {
        alert('Por favor, ingresa un texto válido.');
        return;
    }

    let tareas = JSON.parse(localStorage.getItem(lista));
    
    // Verificar si la nueva tarea ya existe (exceptuando la que se está editando)
    const tareaExistente = tareas.some((tarea, i) => tarea.texto === nuevaTareaTexto && i !== index);
    if (tareaExistente) {
        alert('Esta tarea ya existe en la lista.');
        return;
    }

    // Actualizar el texto de la tarea
    tareas[index].texto = nuevaTareaTexto;
    localStorage.setItem(lista, JSON.stringify(tareas));
    cargarTareas(lista);
}

function cancelarEdicion(lista, index, tareaTexto) {
    cargarTareas(lista); // Cargar las tareas de nuevo, sin cambios
}
