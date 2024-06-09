// Variables y selectores 
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos 
eventListeneres();
function eventListeneres() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarPresupuesto);

}

// Classes 

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto (gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
        // console.log(this.gastos);
    }

    calcularRestante () {
        // Reduce suma la cantidad total
        const gastado = this.gastos.reduce ( (total, gasto) => total + gasto.cantidad, 0 );

        this.restante = this.presupuesto - gastado;
        // console.log(this.restante);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto (cantidad) {

        // Extrayendo los datos
        const { presupuesto, restante} = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
        // console.log(presupuesto);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div 
        const divElement = document.createElement('div');
        divElement.classList.add('alert', 'text-center');

        if (tipo === 'error') {
            divElement.classList.add('alert-danger');
        } else {
            divElement.classList.add('alert-success');
        }

        // Mensaje error 
        divElement.textContent = mensaje;

        // Insertar HTML 
        document.querySelector('.primario').insertBefore(divElement, formulario);

        setTimeout(() => {
            divElement.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        
        this.limpiarHMTL(); // Limpia el HTML, se usa el This para hacer referncia
        // Al mismo objeto o clase
        // Iterando sobre cada gasto 
        gastos.forEach(gasto => {

            const {cantidad, nombre, id} = gasto;
           
            // Crear el LI
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
                // Asignando atributos
            nuevoGasto.dataset.id = id;

            // console.log(nuevoGasto);

            // Crear el HTML del gasto 
            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-pill badge-primary"> $${cantidad} </span>
            `;

            // Boton para borrar el gasto 
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar el HTML al DOM
            gastoListado.appendChild(nuevoGasto);

        });
    }

    // Limpiando HTML
    limpiarHMTL() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante}  = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        // Comprobar el 25%
        if ( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

        // Comprueba el 50%
        } else if ( (presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning'); 
        
        // En caso de desembolso
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');

        }

        // Cuando el restanre es menor o igual a 0
        if (restante <=0) {
            ui.imprimirAlerta('El presupuesto se agoto', 'error');

            // Desabilita el boton
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
            
        }
    }
}

// Instanciar 
const ui = new UI();

let presupuesto

// Funciones


function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');

    //console.log(Number(presupuestoUsuario));

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    // console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarPresupuesto(e){
    e.preventDefault();

    // Leer los valores de los input 
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if ( nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta ('Cantidad no valida', 'error');
        return;
    }

    const gasto = {nombre, cantidad, id: Date.now()};

    // Agregga un nuevo gasto
    presupuesto.nuevoGasto(gasto);
    
    // Mensaje de todo bien 
    ui.imprimirAlerta('Gasto registrado correctamente');

    // Imprimir listado de gastos en el HTML
    const {gastos, restante} = presupuesto;


    // Actualiza el restante
    ui.actualizarRestante(restante);

    ui.mostrarGastos(gastos);

    // Comprobar presupuesto 
    ui.comprobarPresupuesto(presupuesto);

    // Reiniciar el formulario 
    formulario.reset();
}

function eliminarGasto (id) {

    // Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    // Actualiza el restante
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}