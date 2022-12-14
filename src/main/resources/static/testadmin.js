const url = 'api/admin'
const info = document.querySelector('#UserInfo');

const renderUsers = async (users) => {
    const response = await fetch(url);

    if (response.ok) {
        let json = await response.json()
            .then(data => fuckedFunction(data));
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

    function fuckedFunction (users) {
        output = ''
        users.forEach(user => {
            output += ` 
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
              </tr>`
        })
        info.innerHTML = output;
    }
}
let users = [];
const updateUser = (user) => {
    const foundIndex = users.findIndex(x => x.id === user.id);
    users[foundIndex] = user;
    renderUsers(users);
    console.log('users');
}
const removeUser = (id) => {
    users = users.filter(user => user.id !== id);
    console.log(users)
    renderUsers(users);
}

// GET ALL users

fetch(url, {mode: 'cors'})
    .then(res => res.json())
    .then(data => {
        users = data;
        renderUsers(data)
    })

// ADD user

const addUserForm = document.getElementById('addUserForm')
const addRoles = document.getElementById('roleCreate')
console.log(addRoles)

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addUserForm);
    const object = {
        roles: []
    };

    formData.forEach((value, key) => {
        if (key === "roleCreate"){

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


    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            'Referer': null
        },
        body: JSON.stringify(object)
    })
        // .then(res => res.json())
        .then(data => updateUser(data))
        .then(() => addUserForm.reset())
        .catch((e) => console.error(e))

    return show('usersTable','newUser');

})

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
    document.getElementById('passwordEdit').value = ''
    document.getElementById('ageEdit').value = userInfo.children[3].innerHTML
    document.getElementById('emailEdit').value = userInfo.children[4].innerHTML
    document.getElementById('roleEdit').value = userInfo.children[5].innerHTML



    $("#editModal").modal("show")
})


const editUserForm = document.getElementById('editForm')
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


    fetch('api/admin/'+ object.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            'Referer': null
        },
        body: JSON.stringify(object)
    })
        .then(data => updateUser(data))
        .catch((e) => console.error(e))

    $("#editModal").modal("hide")
})



// DELETE user
let currentUserId = null;

on(document, 'click', '#delete-user', e => {
    const userInfo = e.target.parentNode.parentNode

    currentUserId = userInfo.children[0].innerHTML

    document.getElementById('idDelete').value = userInfo.children[0].innerHTML
    document.getElementById('firstNameDelete').value = userInfo.children[1].innerHTML
    document.getElementById('lastNameDelete').value = userInfo.children[2].innerHTML
    document.getElementById('ageDelete').value = userInfo.children[3].innerHTML
    document.getElementById('emailDelete').value = userInfo.children[4].innerHTML
    document.getElementById('roleDelete').value = userInfo.children[5].innerHTML

    $("#deleteModel").modal("show")
})


const deleteUserForm = document.querySelector('#deleteModel')
deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetch('api/admin/' + currentUserId, {
        method: 'DELETE'
    })
        .then()
        .then(data => {
            removeUser(currentUserId);
            deleteUserForm.removeEventListener('submit', () => {
            });
            $("#deleteModel").modal("hide")
        })
})
