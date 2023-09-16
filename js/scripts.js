///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*FUNCIONES DE PAGINA INDEX. SOBRE LA CARGA DEL CLIENTE Y VERIFICACIÓN DE LOS DATOS CARGADOS EN EL LOCAL STORAGE */

let listaServicios = [];

class Servicio {
  constructor(tarea, precio, cantidad) {
    this.tarea = tarea;
    this.precio = parseInt(precio);
    this.cantidad = parseInt(cantidad);
    this.precioTotal = 0;
  }
  calcularPrecioTotal() {
    this.precioTotal = this.precio * this.cantidad;
  }
}

class Cliente {
  constructor(nombre, telefono, mensaje) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.mensaje = "";
  }
  crearMensaje() {
    const mensaje = `Hola ${this.nombre}, recordá que estamos para ayudarte, cualquier consulta no dudes en preguntarnos. Saludos, que tengas buen día`;
    this.mensaje = `https://wa.me/${this.telefono}?text=${encodeURIComponent(
      mensaje
    )}`;
  }
}

/* Crear una función que me cargue el cliente y su teléfono en el local storage. De esta forma
poder ir creando el prespuesto manteniendo los datos del cliente en la sesión. Hay que tener en cuenta que cuando se cargue la pagina, permita
volcar los datos del local storage en el nombre del cliente comprendido en las etiquetas del DOM
*/
function cargarClienteEnLocalStorage(nombre, telefono) {
  localStorage.setItem("cliente", nombre);
  localStorage.setItem("telefono", telefono);
}

/*Esta función me permite verificar si hay un cliente guardado en el local storage, para seguir realizando el presupuesto al mismo, en el caso en que no haya datos en el local storage,
solicita la carga de los datos del cliente*/

function revisarLocalStorage() {
  let modal = document.getElementById("modalForm");
  if (localStorage.key(0)) {
    const cliente = localStorage.key(0);
    const telefono = localStorage.key(1);

    let confirmar = confirm(
      `El último cliente ingresado es ${localStorage.getItem(
        cliente
      )}, ¿desea seguir utilizando el mismo?`
    );
    if (confirmar) {
      enviarDatosCliente(
        localStorage.getItem(cliente),
        localStorage.getItem(telefono)
      );

      let clientePresupuestoViejo = new Cliente(
        localStorage.getItem(cliente),
        localStorage.getItem(telefono)
      );
      clientePresupuestoViejo.crearMensaje();
      clientePresupuesto = clientePresupuestoViejo;
    } else {
      //modal.show();
    }
  } else {
   // modal.show();
  }
}

//Paso por parámetro el nombre y teléfono del cliente para que lo muestre en la página principal
function enviarDatosCliente(cliente, telefono) {
  (window.location.href = `./pages/principal.html?cliente=${cliente}&telefono=${telefono}`),
    "_blank";
}

//Obtengo por parámetro el nombre y teléfono del cliente para que lo muestre en la página principal
function obtenerInfoCliente() {
  const url = new URL(window.location.href);
  const fecha= new Date()
  let cliente = url.searchParams.get("cliente");
  let telefono = url.searchParams.get("telefono");

  document.getElementById("hCliente").textContent = `Presupuesto dirigido a ${cliente} - Teléfono ${telefono}`;
  
  document.getElementById("pFecha").textContent = `Fecha: ${fecha.getDate()}/${
    fecha.getMonth() + 1}/${fecha.getFullYear()}`;
}

//Se realizo la modificación de la función cargar cliente, utilizando funcion flecha y operador ternario AND

const cargarCliente = () => {
  let modal = document.getElementById("modalForm");
  let nombre = document.getElementById("nombreInput").value;
  let telefono = document.getElementById("telefonoInput").value;
  console.log(nombre+","+telefono)
  nombre !== "" && telefono !== ""
    ? ((clientePresupuesto = new Cliente(nombre, telefono)),
      clientePresupuesto.crearMensaje(),
      console.log(clientePresupuesto),
      enviarDatosCliente(nombre, telefono),
      cargarClienteEnLocalStorage(nombre, telefono),
      nombre.value="",
      telefono.value=""
      )
      
    : alert(`No se cargaron los datos correctamente, reintente`);
};

function crearCliente() {
  let cliente = new Cliente(nombre, apellido, telefono);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*FUNCIONES DE PAGINA PRINCIPAL. SOBRE EL ARMADO DEL PRESUPUESTO */

/*Calculo el precio total de la tarea multiplicando el precio por la acantidad */
function calcularPrecioTotal() {
  let precio = document.getElementById("precio").value;

  let cant = document.getElementById("cantidad").value;
  let precioTotal = document.getElementById("precioResultante");
  precioTotal.value = precio * cant;
}

function cargarFila() {
  let price = parseInt(document.getElementById("precio").value);
  let cantidad = parseInt(document.getElementById("cantidad").value);
  let servNull = document.getElementById("tarea").value;
  /*verificar si tiene contenido cargado */
  if (
    !isNaN(price) &&
    !isNaN(cantidad) &&
    servNull != "" &&
    price > 0 &&
    cantidad > 0
  ) {
    let servicio = document.getElementById("tarea").value;
    let precio = document.getElementById("precio").value;
    let cant = document.getElementById("cantidad").value;
    crearServicio(servicio, precio, cant);
    let indice = listaServicios.length;
    document.getElementById("cuerpoTabla").innerHTML =
      document.getElementById("cuerpoTabla").innerHTML +
      "<tr><td>" +
      servicio +
      "</td><td>" +
      precio +
      "</td><td>" +
      cant +
      "</td><td>" +
      precio * cant +
      "</td><td><button type='button' class='btn btn-danger' onclick='borrarFila(this," +
      indice.toString() +
      ")'>" +
      "<i class='fa fa-trash'></i></button></td>";

    document.getElementById("tarea").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
  } else if (isNaN(price) || price < 0)
  /*Informamos al usuario el dato faltante */
    alert("Debe cargar un precio válido, ingrese nuevamente");
  else if (isNaN(cantidad) || cantidad < 0)
    alert("Debe cargar una cantidad válida, ingrese nuevamente");
  else alert("Debe cargar un servicio, ingrese nuevamente");
}

/*Permite borrar una fila de la tabla de tareas cargada */
function borrarFila(boton, idx) {
  let fila = boton.parentNode.parentNode;

  let tabla = fila.parentNode;
  tabla.removeChild(fila);
  //llamo a la función para que re-calcule nuevamente el total del presupuesto
  //calcularMontoTotal();
  listaServicios[idx - 1].precioTotal = 0;
  calcularMontoTotalPresupuesto();
}

function eliminarColumna() {
  const tabla = document.getElementById("cuerpoTabla");
  const filas = tabla.rows.length;

  if (filas > 0) {
    for (let i = 0; i < filas; i++) {
      tabla.rows[i].deleteCell(-1);
    }
  }
}

//Calculo en monto total del presupuesto, recorriendo el array de objetos servicios y lo muestra en pantalla
function calcularMontoTotalPresupuesto() {
  let montoTotal = 0;

  for (let i = 0; i < listaServicios.length; i++) {
    montoTotal += listaServicios[i].precioTotal;
  }

  document.getElementById("total").textContent =
    "Total Presupuesto: $" + montoTotal;
  console.log(listaServicios);
}

// funcion que me permite pasar lo que hay en pantalla a PDF
function generarPDF() {
  console.log("Se activa la funcion para descargar el pdf");
  document.getElementById("botones").style.display = "none";
  document.getElementById("tareas").style.display = "none";
  document.getElementById("hTotalPresupuesto").textContent =
    document.getElementById("total").textContent;
    document.getElementById("pLeyendaPresupuesto").innerHTML="El siguiente prespuesto es a modo informativo, el mismo puede variar.<br>Válido por el termino de 48 hs.<br>El mismo no incluye costo de materiales, fletes, o gastos indirectos "
    document.getElementById("pDireccion").textContent= "Dirección: Av colón 9875 B° Colinas del Cerro Córdoba Capital"
    document.getElementById("pTelefono").textContent= "Teléfono: (+54) 351-5196190"
    document.getElementById("pWeb").textContent= "Web: reparacionesmanteco.netlify.app"




  eliminarColumna();
  const element = document.getElementById("main-print");

  //Utilizo la fecha para personalizar el formato del nombre del archivo de presupuesto
  const fecha = new Date();

  const options = {
    margin: 10,
    filename: `Presupuesto ${localStorage.getItem("cliente")} ${fecha.getDate()}-${
      fecha.getMonth() + 1
    }-${fecha.getFullYear()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(element).set(options).save();

  setTimeout(function () {
    window.open("../index.html", "_blank");
  }, 3000);
}

//Esta función me crea el array de objetos Servicios,para poder generar el presupuesto de los mismos
function crearServicio(servicio, precio, cantidad) {
  listaServicios.push(new Servicio(servicio, precio, cantidad));
  listaServicios[listaServicios.length - 1].calcularPrecioTotal();
  calcularMontoTotalPresupuesto();
}

/*En esta funcion se debe utilizar el mensaje del objeto cliente*/

function enviarPresupuesto() {
  if (localStorage.key(0)) {
    const cliente = localStorage.key(0);
    const telefono = localStorage.key(1);

    let confirmar = confirm(
      `El último cliente ingresado es ${localStorage.getItem(
        cliente
      )}, ¿desea enviar mensaje a este cliente?`
    );
    if (confirmar) {
      let clientePresupuestoViejo = new Cliente(
        localStorage.getItem(cliente),
        localStorage.getItem(telefono)
      );
      clientePresupuestoViejo.crearMensaje();
      window.open(clientePresupuestoViejo.mensaje);
    }
  } else {
    alert("No hay cliente cargado");
  }
}

const cargarTareas = async (categoria) => {
  document.getElementById("tarea").innerHTML = "";
  const rep = await fetch("../json/tareas.json");
  const tareas = await rep.json();

  tareas.forEach((tarea) => {
    if (categoria === tarea.categoria) {
      document.getElementById("tarea").innerHTML =
        document.getElementById("tarea").innerHTML +
        `<option value="${tarea.tarea}">
      ${tarea.tarea}
    </option>`;
    }
  });
};

function cargarOtraTarea() {
  const fecha = new Date();

  const tarea = prompt("Cargar la tarea a realizar");

  document.getElementById("tarea").innerHTML = `<option value="${tarea}">
    ${tarea}
  </option>`;
}



