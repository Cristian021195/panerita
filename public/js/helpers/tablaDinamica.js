import { loader } from './loader.js';
export function tablaDinamica(data, titulo){
    //dom globales
    let $div = document.createElement('div'); $div.classList.add('corte');
    let $span = loader(32, 1, '#0d6efd');
    let $h4 = document.createElement('h4'); $h4.classList.add('d-flex'); $h4.innerHTML = titulo; $h4.appendChild($span)
    $div.appendChild($h4)
    
    let $table = document.createElement('table'); $table.classList.add('table'); $table.classList.add('hovered');
    let $thead = document.createElement('thead'); let $tbody = document.createElement('tbody');
    let $trh = document.createElement('tr');

    let datos = data;

    //asignaciones
    $thead.appendChild($trh);

    let thead = Object.keys(datos[0]).map(th=>{return th.toUpperCase()});

    for(let i = 0; i < thead.length ; i++){//cabecera
        let $th = document.createElement('th');
        let $span = document.createElement('span');
        $span.innerText = thead[i];
        $th.appendChild($span);
        $trh.appendChild($th);
    }
    datos.forEach(td => {//cuerpo
        let $tr = document.createElement('tr');
        let contador = 1;
        for (const property in td) {
            if(td[property] == null){
                $tr.innerHTML += `<td></td>`;
            }else{
                if(contador == thead.length){
                    $tr.innerHTML += `<td>${td[property]}</td>`;    
                }else{
                    $tr.innerHTML += `<td>${td[property]}</td>`;
                }                
            }
            contador++;
        }
        $tbody.appendChild($tr);
    });

    //asignaciones finales
    $thead.appendChild($trh);
    $table.appendChild($thead);
    $table.appendChild($tbody);

    $div.appendChild($table);
    return $div;
}