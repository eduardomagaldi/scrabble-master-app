let apiUrl = 'http://localhost:3001';

const dataService = {
    getWords,
}

export default dataService;

async function getWords(letters) {
    const result = await get('/api/v1/' + letters.join(','));

    return result;
    // return new Promise(async (resolve, reject) => {

    // });
}

async function get(url) {
    const response = await fetch(
        apiUrl + url,
        { ...getOptions() },
    );

    if (handleErrors(response)) {
        return;
    }

    return await parseBody(response);
}

async function post(url, data) {
    const response = await fetch(
        apiUrl + url,
        {
            ...getOptions(),
            method: 'POST',
            body: JSON.stringify(data || {}),
        },
    );

    if (handleErrors(response)) {
        return;
    }

    return await parseBody(response);
}

async function deleteFetch(url, data) {
    const response = await fetch(
        apiUrl + url,
        {
            ...getOptions(),
            method: 'DELETE',
            body: JSON.stringify(data || {}),
        },
    );

    if (handleErrors(response)) {
        return;
    }

    return await parseBody(response);
}

function handleErrors(response) {
    let error = false;

    for (const entry of response.headers.entries()) {
        if (entry[0] === 'location') {
            window.location.href = entry[1];
            error = true;
            break;
        }
    }

    if (response.status !== 200) {
        console.error('Looks like there was a problem. Status Code: ' + response.status);
    } else {
        return error;
    }
}

function getOptions() {
    return {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    };
}

async function parseBody(response) {
    const data = await response.json().catch((e) => {
        console.error('e', e);
    });

    return data;
}