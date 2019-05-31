const electron = require('electron');
const { ipcRenderer } = electron;

//var $ = require('node_modules/jQuery');
var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

let loaddiv = '<div class="percentual">0%</div>'
let load = 0
let animabarra;

// Emite objeto para o controle Backend
$('.bt').click((e) => {
    stopAnimacao()
    $('.outputarea').html('<div class="aviso">' + e.target.textContent + '...' + '</div>');
   
    const msg = {
        'comando': e.target.id,
        'painel': $('.select-selected').text()
    }
    
    ipcRenderer.send('msg', msg);
    $('.outputarea').prepend('<div class="c100 p0 big orange load"><span>' + loaddiv + '</span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div>')
    animabarra = setInterval(animaLoad, 1000);
})

// Recebe resposta
ipcRenderer.on('asynchronous-reply', (event, arg) => {   
    stopAnimacao()
    let load = '100%'
    $('.load').removeClass('orange')
    $('.load').removeClass('p25')
    $('.load').addClass('green')
    $('.load').addClass('p100')
    $('.percentual').text(load)    
    $('.aviso').html('<div class="concluido">Concluido!</div>')
})


function animaLoad() {
    load +=2
    $('.load').removeClass(`p${load - 2}`)
    $('.load').addClass(`p${load}`)
    $('.percentual').text(`${load}%`)
}

function stopAnimacao() {
    clearInterval(animabarra)
    $('.load').removeClass(`p${load}`)
    load = 0;
    $('.load').addClass(`p${load}`)
    $('.percentual').text(`${load}%`)
}

