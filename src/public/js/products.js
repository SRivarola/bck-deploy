function nextPage(hasNextPage, nextPage) {
    if(hasNextPage){
        const location = window.location.href;
        let query = location.split('?')[1] ? location.split('?')[1] : '';
        let title;
        if(query.includes('&')){
            query = query.split('&')[0];
            title = query ? query.includes('title') : false;
        } else {
            title = query ? query.includes('title') : false;
        }
        window.location.href = `/products${title ? ('?'+query+`&page=${nextPage}`) : `?page=${nextPage}`}?`;
    }
}

function prevPage(hasPrevPage, prevPage) {
    if(hasPrevPage){
        const location = window.location.href;
        let query = location.split('?')[1] ? location.split('?')[1] : '';
        let title;
        if(query.includes('&')){
            query = query.split('&')[0];
            title = query ? query.includes('title') : false;
        } else {
            title = query ? query.includes('title') : false;
        }
        window.location.href = `/products${title ? ('?'+query+`&page=${prevPage}`) : `?page=${prevPage}`}?`;
    }
}

const filterForm = document.getElementById('filter_form')
filterForm.addEventListener('submit', handleFilterSubmit)

function handleFilterSubmit(e) {
    e.preventDefault();
    const titleInput = document.getElementById('title_input');
    const titleValue = titleInput.value;
    window.location.href = `/products?title=${titleValue}`;
}

