export const request = <T>(url: string, reqInit: RequestInit) => {
    return fetch(url, reqInit)
        .then((response) => response.json())
        .then((json) => json as T);
}