import axios from "axios";

const personsPath = '/api/persons'
const baseUrl = `http://localhost:3001${personsPath}`  //`https://bitter-snow-9585.fly.dev${personsPath}`

const getAll = () => {
    return axios
            .get(baseUrl)
            .then(response => response.data)
}

const create = newPerson => {
    return axios
            .post(baseUrl, newPerson)
            .then(response => response.data)
}

const update = (id, changedPerson) => {
    return axios
            .put(`${baseUrl}/${id}`, changedPerson)
            .then(response => response.data)
}

const deletePerson = id => {
    return axios
            .delete(`${baseUrl}/${id}`)
            .then(response => response.data)
}

export default {
    getAll: getAll,
    create: create,
    update: update,
    deletePerson: deletePerson
}
