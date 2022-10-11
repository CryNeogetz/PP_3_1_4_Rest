const url = '/api/admin'
const userInfo = document.querySelector('#UserInfo');


function sendRequest(url) {
    return fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(err => {
            const e = new Error('Ошибка');
            e.data = err;
            throw e;
        })
    })
}


function getTableUsers() {
    sendRequest(url).then(users => {
        let temp = "";
        users.forEach((user) => {
            temp += `
                  <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${user.roles.map(role => role.name === 'ROLE_USER' ? ' USER' : ' ADMIN')}</td>
                  <td>
                       <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info text-white"
                        data-toggle="modal" data-target="modal" id="edit-user" data-id="${user.id}">Edit</button>
                   </td>
                   <td>
                       <button type="button" class="btn btn-danger" id="delete-user" data-action="delete"
                       data-id="${user.id}" data-target="modal">Delete</button>
                        </td>
                  </tr>`;
        });
        userInfo.innerHTML = temp;
    })
}

getTableUsers();


const renderUsers = async (users) => {
    const response = await fetch("/api/admin");

    if (response.ok) {
        let json = await response.json()
            .then(data => fuckedFunction(data));
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

    function fuckedFunction (users) {
        let temp = "";
        users.forEach(user => {
            temp += `
                  <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${user.roles.map(role => role.name === 'ROLE_USER' ? ' USER' : ' ADMIN')}</td>
                  <td>
                       <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info text-white"
                        data-toggle="modal" data-target="modal" id="edit-user" data-id="${user.id}">Edit</button>
                   </td>
                   <td>
                       <button type="button" class="btn btn-danger" id="delete-user" data-action="delete"
                       data-id="${user.id}" data-target="modal">Delete</button>
                        </td>
                  </tr>`;
        })
        userInfo.innerHTML = temp;
    }
}


let users = [];
const updateUser = (user) => {
    const foundIndex = users.findIndex(x => x.id === user.id);
    users[foundIndex] = user;
    renderUsers(users);
    console.log('users');
}







const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// EDIT user
on(document, 'click', '#edit-user', e => {
    const userInfo = e.target.parentNode.parentNode
    document.getElementById('idEdit').value = userInfo.children[0].innerHTML
    document.getElementById('firstNameEdit').value = userInfo.children[1].innerHTML
    document.getElementById('lastNameEdit').value = userInfo.children[2].innerHTML
    document.getElementById('passwordEdit').value = userInfo.children[6].innerHTML
    document.getElementById('ageEdit').value = userInfo.children[3].innerHTML
    document.getElementById('emailEdit').value = userInfo.children[4].innerHTML
    document.getElementById('roleEdit').value = userInfo.children[5].innerHTML



    $("#editModal").modal("show")
})

const editUserForm = document.querySelector('#editModal')

editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById('editForm'));
    const object = {
        roles: []
    };

    formData.forEach((value, key) => {
        if (key === "roles"){

            const roleId = value.split("_")[0];
            const roleName = value.split("_")[1];
            const role = {
                id : roleId,
                name : "ROLE_" + roleName
            };
            object.roles.push(role);
        } else {
            object[key] = value;
        }
    });


    fetch("api/admin/"+document.getElementById('idEdit').value, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            'Referer': null
        },
        body: JSON.stringify(object)
    })
        .then(res => res.json())
        .then(data => updateUser(data))
        .catch((e) => console.error(e))

    $("#modalEdit").modal("hide")
})