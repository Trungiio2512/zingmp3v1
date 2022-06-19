import html from '../handleHtml/htmls.js'

function toast (
        element, 
        title = '', 
        message='' , 
        duration = 3000
        ){
    
    const toast = document.createElement('div');
    toast.classList.add('toast');
    element.appendChild(toast);

    toast.style.animation = `toleft ease-in-out 0.5s, hide ease-in-out 1s ${duration / 1000}s forwards`

   const timeOutRemove =  setTimeout (() => {
        element.removeChild(toast)
    }, duration + 1000)

    toast.onclick = (e) => {
        if(e.target.closest('.toast__close')){
            element.removeChild(toast)
        }
        clearTimeout(timeOutRemove)
    }
    toast.innerHTML = html`
            <div class="toast__body">
                <span class="toast__title">
                    ${title}
                </span>
                <p class="toast__message">
                    ${message}
                </p>                                
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>    
            </div>
        `
    
}

export default toast