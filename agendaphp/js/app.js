const formularioContactos = document.querySelector('#contacto');
      listadoContactos = document.querySelector('#listado-contactos tbody');
      inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners(){
     //Cuendo el formulario se ejecuta
     formularioContactos.addEventListener('submit', leerFormulario);

     //Listener para el boton eliminar
     if(listadoContactos){
          listadoContactos.addEventListener('click', eliminarContacto);
     }

     //Input para el buscador
     inputBuscador.addEventListener('input', buscarContacto);

     //Actualizar numero contactos
     numeroContactos();
     

}

function leerFormulario(e){
     e.preventDefault();

     //Leer datos de los inputs
     const nombre = document.querySelector('#nombre').value,
           empresa = document.querySelector('#empresa').value,
           telefono = document.querySelector('#telefono').value,
           accion = document.querySelector('#accion').value;

     if(nombre === '' || empresa === '' || telefono === ''){
          //2 parametros: texto y clase
          mostrarNotificacion('Todos los campos son obligatorios', 'error');
          
     } else {
          //Pasa la validacion, crear llamando a Ajax
          const infoConctacto = new FormData();
          infoConctacto.append('nombre', nombre);
          infoConctacto.append('empresa', empresa);
          infoConctacto.append('telefono', telefono);
          infoConctacto.append('accion', accion);

          if(accion === 'crear'){
               //crearemos un nuevo elemento
               insertarBD(infoConctacto);
          } else {
               //editar el contacto
               //leer id
               const idRegistro = document.querySelector('#id').value;
               infoConctacto.append('id', idRegistro);
               actualizarRegistro(infoConctacto);
          }
     }
}

//Inserta en la base de datos via Ajax
function insertarBD(datos) {
     //llamado a Ajax

     //crear el objeto
     const xhr = new XMLHttpRequest();

     //abir la conexion
     xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

     //pasar los datos
     xhr.onload = function(){
          if(this.status === 200){
               console.log(JSON.parse(xhr.responseText));
               //leemos la respuesta de php
               const respuesta = JSON.parse(xhr.responseText);

               //Inserta un nuevo elemento a la tabla
               const nuevoContacto = document.createElement('tr');

               nuevoContacto.innerHTML = `
                    <td>${respuesta.datos.nombre}</td>
                    <td>${respuesta.datos.empresa}</td>
                    <td>${respuesta.datos.telefono}</td>
               `;

               //crear contenendor para los botones
               const contenendorAcciones = document.createElement('td');

               //crear icono de editar
               const iconoEditar = document.createElement('i');
               iconoEditar.classList.add('fas', 'fa-edit');

               //crear link de editar
               const btnEditar = document.createElement('a');
               btnEditar.appendChild(iconoEditar);
               btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
               btnEditar.classList.add('btn','btn-editar');

               //agregarlo al padre
               contenendorAcciones.appendChild(btnEditar);

               //creae le icono eliminar
               const iconoEliminar = document.createElement('i');
               iconoEliminar.classList.add('fas', 'fa-trash');

               //crear boton eliminar
               const btnEliminar = document.createElement('button');
               btnEliminar.appendChild(iconoEliminar);
               btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
               btnEliminar.classList.add('btn','btn-borrar');

               //agregar al padre
               contenendorAcciones.appendChild(btnEliminar);

               //agrgarlo al tr
               nuevoContacto.appendChild(contenendorAcciones);

               //agregarlo con los contactos
               listadoContactos.appendChild(nuevoContacto);

               //Resetear el formulario
               document.querySelector('form').reset();

               //Mostrar la notificacion
               mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

               //Mostrar el numero
               numeroContactos();

          }
     }

     //enviar los datos
     xhr.send(datos);

}

function actualizarRegistro(datos){
     //crear objeto
     const xhr = new XMLHttpRequest();

     //crear conexion
     xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

     //leer la respuesta
     xhr.onload = function(){
          if(this.status === 200){
               const respuesta = JSON.parse(xhr.responseText);

               if(respuesta.respuesta === 'correcto'){
                    //mostrar notificacon de correcto
                    mostrarNotificacion('Contacto Editado Correctamente', 'correcto');

               } else {
                    //mostrar error
                    mostrarNotificacion('Hubo un error', 'error');
               }
               //Redirecionar despues de 3 segundos
               setTimeout(() => {
                    window.location.href = 'index.php';
               }, 4000);
          }
     }

     //enviar la peticion
     xhr.send(datos);
}

//Eliminar el contacto
function eliminarContacto(e){
     if(e.target.parentElement.classList.contains('btn-borrar')){
          //tomar id
          const id = e.target.parentElement.getAttribute('data-id');

          //console.log(id);

          //Preguntar al ususario
          const respuesta = confirm('¿Estas seguro(a) que quieres borrar este contacto?');

          if(respuesta){
               //llamar a ajax
               //crear el objeto
               const xhr = new XMLHttpRequest();

               //abrir la conexion
               xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

               //leer la respuesta
               xhr.onload = function() {
                    if(this.status === 200){
                         const resultado = JSON.parse(xhr.responseText);
                         console.log(resultado);

                         if(resultado.respuesta === 'correcto'){
                              //Eliminar registro del DOM
                              console.log(e.target.parentElement.parentElement.parentElement);
                              e.target.parentElement.parentElement.parentElement.remove();

                              //mostrar notificacion
                              mostrarNotificacion('Contacto eliminado', 'correcto');

                              //Actualizar numero
                              numeroContactos();

                         } else {
                              //Mostrar notificacion
                              mostrarNotificacion('Hubo un error', 'error');
                         }
                    }
               }

               //enviar la peticion
               xhr.send();

          } 
     }
}

//Notificacion en pantalla

function mostrarNotificacion(mensaje, clase){
     const notificacion = document.createElement('div');
     notificacion.classList.add(clase, 'notificacion', 'sombra');
     notificacion.textContent = mensaje;

     //formulario
     formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

     //Ocultar y mostrar la notificacion

     setTimeout(() => {
          notificacion.classList.add('visible');

          setTimeout(()=> {
               notificacion.classList.remove('visible');
               
               setTimeout(() => {
                    notificacion.remove();
               }, 600);
          }, 3000);
     }, 100);
}

//Buscar registro
function buscarContacto(e){
     const expresion = new RegExp(e.target.value,"i");
           registros = document.querySelectorAll('tbody tr');

           registros.forEach(registro => {
                registro.style.display = 'none';

                if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1){
                    registro.style.display = 'table-row';
                }
                numeroContactos();
           });
}

//Muestra el total de los contactos

function numeroContactos(){
     const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contactos span');

     let total = 0;

     totalContactos.forEach(contacto => {
          if(contacto.style.display === '' || contacto.style.display === 'table-row'){
               total++;
          }
     });

     //console.log(total);

     contenedorNumero.textContent = total;
}

