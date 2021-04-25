let apiUrl = 'http://localhost:3001';

const dataService = {
    getWords,
    getDefinition,
}

export default dataService;

async function getWords(letters) {
    const result = await get(apiUrl + '/api/v1/words/by-letter/' + letters.join(','));

    return result;
}

async function getDefinition(word) {
    const result = await get(apiUrl + '/api/v1/words/definition/' + word);

    return result;
}

async function get(url) {
    const response = await fetch(
        url,
        { ...getOptions() },
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
