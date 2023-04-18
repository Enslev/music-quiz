interface RequestOptions {
    headers?: Record<string, string>;
    body?: object;
    query?: QueryObject;
}

const get = <T = unknown>(url: string, options: RequestOptions = {}) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(options.body),
    };
    let query = '';
    if (options.query) query = '?' + queryBuilder(options.query);

    return fetch(url + query, requestOptions).then(handleResponse<T>);
};

const post = <T = unknown>(url: string, options: RequestOptions = {}) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(options.body),
    };
    let query = '';
    if (options.query) query = '?' + queryBuilder(options.query);

    return fetch(url + query, requestOptions).then(handleResponse<T>);
};

const put = <T = unknown>(url: string, options: RequestOptions = {}) => {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(options.body),
    };
    let query = '';
    if (options.query) query = '?' + queryBuilder(options.query);

    return fetch(url + query, requestOptions).then(handleResponse<T>);
};

// prefixed with underscored because delete is a reserved word in javascript
const _delete = <T = unknown>(url: string, options: RequestOptions = {}) => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(options.body),
    };
    let query = '';
    if (options.query) query = '?' + queryBuilder(options.query);

    return fetch(url + query, requestOptions).then(handleResponse<T>);
};

const handleResponse = <T>(response: Response) => {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data as T;
    });
};

type QueryObject = {[key: string]: string | number | boolean | (string | number | boolean)[]}
const queryBuilder = (queryObject: QueryObject) => {
    const keyValuePairs = Object.entries(queryObject).map(([key, value]) => {
        if (Array.isArray(value)) {
            const paresArrayValue = value.map((value) => {
                return `${encodeURIComponent(key)}[]=${encodeURIComponent(value)}`;
            });
            return paresArrayValue.join('&');
        }

        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });

    return keyValuePairs.join('&');
};

export default {
    get,
    post,
    put,
    delete: _delete,
};
