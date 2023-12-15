const socket = io();

const form = document.getElementById('set_form')
form.addEventListener('submit', handleSubmit)

function handleSubmit (e) { 
    e.preventDefault();

    const title = e.target[0].value;
    const description = e.target[1].value;
    const price = Number(e.target[2].value);
    const img = e.target[3].value;
    const stock = Number(e.target[4].value);
    const code = e.target[5].value;
    const status = e.target[6].value === 'true' ? true : false;

    
    if(title === '' 
    || description === '' 
    || price === ''
    || price === 0 
    || stock === '' 
    || code === '') {
        
        const errorSpan = document.getElementById('errorMessage');

        if(errorSpan) errorSpan.remove();
        
        const errorMessage = `<span id='errorMessage' class='errorMessage'>*Complete All Fields</span>`;
        form.innerHTML += errorMessage;
        return
    }

    const product = {
        title,
        description,
        price,
        img: [img],
        stock,
        code,
        status
    }

    socket.emit('dataProduct', product)

    socket.on('message', data => {

        const errorSpan = document.getElementById('errorMessage');

        if(errorSpan) errorSpan.remove();
           
        form.innerHTML += data

        setTimeout(() => {

            const errorSpan = document.getElementById('errorMessage');
            errorSpan.remove();

        }, 2500);

    })

    socket.on('product', data => {
        const card = `
            <div class="card" id=${data._id}>
                <div class="image_container">
                    <img src="/images/${data.thumbnail[0]}" alt=${data.title}>
                </div>
                <div class="details_container">
                    <div>
                        <p class="card_title">${data.title}</p>
                        <p class="card_description">${data.description}</p>
                        <p class="card_price">$${data.price}</p>
                    </div>
                    <div class="btn_container">
                        <button id=${data._id} class="btn-agregar">AGREGAR AL CARRITO</button>
                    </div>
                </div>
            </div>
        `
        const container = document.getElementById('cards_container')

        container.innerHTML += card

        const option = `<option value=${data._id}>${data.title}</option>`

        const select = document.getElementById('select')

        select.innerHTML += option

    })

}

socket.on('data', data => {
    const select = document.getElementById('select');
    if(select.childElementCount < 2) {
        data.forEach(element => {
            const option = `
                <option value=${element._id} >${element.title}</option>
            `
            select.innerHTML += option
        });
    }
})

const deleteForm = document.getElementById('delete_form');
deleteForm.addEventListener('submit', handleDeleteSubmit)

function handleDeleteSubmit(e) {
    e.preventDefault();
    const option = e.target[0].value

    const formGroup = document.getElementById('formGroup');
    const error = document.getElementById('errorDeleteMessage')

    if(option === 0) {
        if(error) error.remove()
        const span = `<span id='errorDeleteMessage' class='errorMessage'>Select an option!</span>`
        formGroup.innerHTML += span
        return  
    }

    if(error) error.remove()

    const btnContainer = document.getElementById('btn_container')
    
    const confirm = `
        <div id='confirmGroup' class='confirm_container'>
            <div class='confirm_title'>Are you sure you want to delete this product?</div>
            <div class='confirm_btn_container'>
                <button id='btn_cancel' class='btn_cancel'>CANCEL</button>
                <button id='btn_delete' class='btn_delete'>DELETE</button>
            </div>
        </div>
    `;
    btnContainer.innerHTML = confirm;

    const btnCancel = document.getElementById('btn_cancel');
    const btnDelete = document.getElementById('btn_delete');

    btnCancel.addEventListener('click', handleCancel)
    btnDelete.addEventListener('click', () => handleDelete(option))
}

const btnContainer = `
    <div id="btn_container" class="btn_container">
        <button type="submit" class="btn_set">DELETE PRODUCT</button>
    </div>
`;

function handleCancel() {
    const confirm = document.getElementById('confirmGroup');
    confirm.parentNode.remove()
    deleteForm.innerHTML += btnContainer;
}

async function handleDelete(id) {
    try {
        await socket.emit('deleteData', id)
        socket.on('deleteMessage', data => {
            const formGroup = document.getElementById('formGroup');
            const confirm = document.getElementById('confirmGroup');
            confirm.parentNode.remove()
            formGroup.innerHTML += data
            document.querySelector(`option[value="${id}"]`).remove();        
            
            setTimeout(() => {
                const span = document.getElementById('errorDeleteMessage');
                span.remove();
                formGroup.innerHTML += btnContainer
            }, 2500);
        })
        socket.on('deletedProduct', data => {
            const card = document.getElementById(`${data._id}`)
            card.remove()
        })
    } catch (error) {
        console.log(error)
    }
}
