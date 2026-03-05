const formReg=document.getElementById("registerform");
const table= document.getElementById("datatable");

 let totalGuias=0;//Total de Guias

 let guiasTransito=0;
 let guiasEntregadas=0;
 let estado="";
 let guias=[];//arreglo general
 function validarForm(){
   
    let valido=true;
    //verificar numero de guía
    let numeroguia=Number(document.getElementById("n-guia").value);

    let existe=guias.some(ex=>ex.nguia===numeroguia);
    if(existe){
    alert("el número de guía ya esta registrado");
    const imgGuia=document.querySelector("#imgguia");

   imgGuia.hidden=false;
   return false; //detiene la función aca;
    }
    //validarinputs
    const campos=document.querySelectorAll(".campo");
    campos.forEach(campo=>{
        const input=campo.querySelector("input,select");
        const imagen=campo.querySelector("img");
        if(!input.value.trim()){
            imagen.hidden=false;
            valido=false;
        }else{
            imagen.hidden=true;
        }
    });
//validar radios
const contRadios=document.querySelector(".campo--radio");
const imageRadio=contRadios.querySelector("img")
  const selectR=contRadios.querySelector('input[name="status"]:checked');
 
    if (!selectR) {
       imageRadio.hidden=false;
        valido=false;
        console.log("mostrando hidden");
    } else {
       imageRadio.hidden=true;
    }
  
    return valido;
  

  }
  


    
formReg.addEventListener("submit",function (elem){
    elem.preventDefault();//evita que la página se recargue
    //obtener valores
    if(!validarForm()) return;
 //crear objeto guía
 
 //arreglo individual  
 let guiaF ={
        nguia:Number(document.getElementById("n-guia").value),
        estadoG:document.querySelector('input[name="status"]:checked').value,
        nameD:document.getElementById("destname").value.trim(),
        origen:document.getElementById("origen").value,
        destino:document.getElementById("destino").value,
        fecha:document.getElementById("date").value,
        historial:[]
    };
    totalGuias ++;
  
    //actualizar total de guias activas
    document.getElementById("guiaActiva").innerText=totalGuias;//anota el numero de guías creadas
    if(document.querySelector('input[name="status"]:checked').value==="En tránsito"){
        guiasTransito ++;
        document.getElementById("guiaTransito").innerText=guiasTransito;
    }
        else if(document.querySelector('input[name="status"]:checked').value==="Entregado"){
           guiasEntregadas ++;
            document.getElementById("guiaEntregada").innerText=guiasEntregadas;
        }
     
    
    //guardar en el arreglo
    guias.push(guiaF);
    console.log(guias);
    //tabla
    doGuia();
    formReg.reset();//limpiar formulario

})
function doGuia(){
  
    table.innerHTML="";//limpia la tabla antes de repintar
    guias.forEach((guiaF) => {
        const fila= `
        <tr>
            <td>${guiaF.nguia}</td>
            <td>${guiaF.estadoG}</td>
            <td>${guiaF.nameD}</td>
            <td>${guiaF.origen}</td>
            <td>${guiaF.destino}</td>
            <td>${guiaF.fecha}</td>
            <td><img src="img/modificar.png" alt="modificar" class="btnMod" data-id="${guiaF.nguia}"></td>
            <td><button type="button" id="btnHistorial" data-id="${guiaF.nguia}">Mostrar historial</button></td>
        </tr>
        `;
        table.innerHTML+=fila;
    })
}
table.addEventListener("click", function(e){
  const btnM= e.target.closest(".btnMod");
  const btnHist=e.target.closest("#btnHistorial");
  //console.log(btnM);
  
    if(btnM){
        
        const id=Number(btnM.dataset.id);
      
       cambiarEstado(id);
       
    }
    else if(btnHist){
        const clave=Number(btnHist.dataset.id);
        console.log("selecciona hist"+ clave);
        showH(clave);
    }
});
 function showH(c){
        const sguia=guias.find(d=>d.nguia===c);
        if(!sguia){
            alert("Guía no encontrada");
            return;
        }
        if(sguia.historial.length===0){
            alert("esta guía no tiene actualizaciones");
            return;
        }
        let mensaje=`historial de la guía: ${c} \n\n`;
        sguia.historial.forEach(h=>{
            mensaje +=`Fecha: ${h.fechaCambio}\n`;
            mensaje +=`de: ${h.estadoAnterior}\n`;
            mensaje += `A: ${h.estadoNuevo}\n\n`;
        });
        alert(mensaje);
    }
function cambiarEstado(id){
    console.log("id recibido ", id);
    console.log(" contenido ", guias)
    const guiaF=guias.find(g =>g.nguia===id);

    console.log("resultado", guiaF);
  
    if(!guiaF) return;
    let newState="";
    let fechaCambio="";
    if(guiaF.estadoG==="Pendiente"){
        newState="En tránsito";
        guiasTransito++;
        document.getElementById("guiaTransito").innerText=guiasTransito;
    }
    else if(guiaF.estadoG==="En tránsito"){
        newState="Entregado"
        guiasEntregadas ++;
        guiasTransito --;
        document.getElementById("guiaTransito").innerText=guiasTransito;
        document.getElementById("guiaEntregada").innerText=guiasEntregadas;
    }
    else{
        alert ("esta guía ya fue entregada");
        return;
    }
    fechaCambio=new Date().toLocaleString()
    //guardar en el historial
    guiaF.historial.push({
        fechaCambio: fechaCambio,
        estadoAnterior: guiaF.estadoG,
        estadoNuevo:newState
       
    });
    
      
    //actualizar Estado
    guiaF.estadoG=newState;
    guiaF.fecha=fechaCambio;
    //volver a pintar la guía
    doGuia();
   
}
