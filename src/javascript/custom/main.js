var sidebarAbierto = null;
const img_burger = '../../images/burger_menu.png';
const img_close = '../../images/close.png';
// const btn_miPerfil = document.getElementsByClassName('container__button--perfil');
var media = window.matchMedia("(min-width: 768px)");
var dropdown_menu_perfil = document.getElementsByClassName("dropdown_container--perfil")[0] || false;
var dropdown_menu_idioma = document.getElementsByClassName("dropdown_container--idiomas")[0] || false;
var dropdown_menu_idioma_mobile = document.getElementsByClassName("dropdown_container--idiomas--links")[0] || false;

function apareceDropdown(clase) {
    var dropdown_menu = document.getElementsByClassName(clase);
    dropdown_menu[0].classList.toggle("show");
}

window.onclick = function (event) {
    //chequear si existe el dropwdown
    if (!event.target.closest('.container__button')) {
        if (dropdown_menu_perfil && dropdown_menu_perfil.classList.contains('show')) {
            dropdown_menu_perfil.classList.remove('show');
        }

        if (dropdown_menu_idioma && dropdown_menu_idioma.classList && dropdown_menu_idioma.classList.contains('show')) {
            dropdown_menu_idioma.classList.remove('show');
        }

        if (dropdown_menu_idioma_mobile && dropdown_menu_idioma_mobile.classList && dropdown_menu_idioma_mobile.classList.contains('show')) {
            dropdown_menu_idioma_mobile.classList.remove('show');
        }
    }

    // if ((dropdown_menu_perfil.classList.contains('show') || dropdown_menu_idioma.classList.contains('show') || dropdown_menu_idioma_mobile.classList.contains('show')) && !event.target.closest('.container__button')) {
    //     dropdown_menu_perfil.classList.remove('show');
    //      dropdown_menu_idioma.classList.remove('show');
    //      dropdown_menu_idioma_mobile.classList.remove('show');
    // }
};

function apareceSidebar(clase) {
    var sidebar = document.getElementsByClassName(clase)[0];
    if(!media.matches) {
        if (sidebarAbierto != null && sidebarAbierto != sidebar) {
            sidebarAbierto.classList.remove('show');
            sidebarAbierto = null;
            cambiarIcono();
        }
    
        if (sidebar.classList.contains('show')) {
            sidebar.style.animation = 'slideOut 0.5s forwards';
            setTimeout(() => {
                sidebar.classList.remove('show');
                sidebar.style.animation = '';
            }, 500);
        } else {
            sidebar.classList.add('show');
            sidebar.style.animation = 'slideIn 0.5s forwards';
            sidebarAbierto = sidebar;
        }
    }
    else {
        apareceDropdown(clase);
    }
}

function cambiarIcono() {
    var elem_icono_burger = document.querySelector('.icono_burger');
    var sidebar = document.getElementsByClassName('container__links')[0];

    if (elem_icono_burger.src.includes('burger_menu') && sidebar.classList.contains('show')) {
        elem_icono_burger.src = img_close;
    } else {
        elem_icono_burger.src = img_burger;
    }
}

function delete_CustomerCard(customerId){
    var customerCard = document.getElementById(customerId);
    
    if (customerCard) {
        customerCard.remove(); 
    } else {
        console.error("Elemento no encontrado con ID:", customerId);
    }
}

function apareceFiltros(sliderClass){
    var slider = document.getElementsByClassName(sliderClass)[0];
    if(slider){
        if (slider.classList.contains('show')) {
            slider.style.animation = 'slideOutFiltros 0.5s forwards';
            setTimeout(() => {
                slider.classList.remove('show');
                slider.style.animation = '';
            }, 500);
        } else {
            slider.classList.add('show');
            slider.style.animation = 'slideInFiltros 0.5s forwards';
        }
    }
}

