const url = "http://localhost:8080/"

const sortAsc = "asc"
const sortDesc = "desc"
let flag = true

currentPath = document.getElementById('current-path').innerHTML 
upload(currentPath, flag)

async function upload(currentPath, sortFlag) {
    document.getElementById('loading-spinner').style.display = 'block';

    let sort = sortAsc

    if (!sortFlag) {
        sort = sortDesc
    }

    await fetch(url + 'path?root=' + currentPath.slice(1, -1) + '&sort=' + sort, {
        method: "GET",
    })
    .then(resp => {
        if (resp.ok) {
            resp.json()
            .then(data => {
                let file_list = document.getElementById('file-list')
                file_list.innerHTML = ""
                data.forEach(element => {
                    if (element["FileType"] === "dir") {
                        file_list.innerHTML += `<div class="file-item" id="directory-item">
                                                    <div class="directory-icon"></div>
                                                    <a href="#" class="name" onclick="getCurrPath(event)">${element["Name"]}</a>
                                                    <span class="type">директория</span>
                                                    <span class="size">${element["Size"]}</span>
                                                </div>`
                    }
                    if (element["FileType"] === "file") {
                        file_list.innerHTML += `<div class="file-item">
                                                    <div class="file-icon"></div>
                                                    <div class="name">${element["Name"]}</div>
                                                    <span class="type">файл</span>
                                                    <span class="size">${element["Size"]}</span>
                                                </div>`
                    }
                });
            })
        }
        else {
            resp.text().then(text => {
                alert(text)
            })
        }
        
    })
    .catch(error => {
        console.log(error);
    })

    document.getElementById('loading-spinner').style.display = 'none';
}

function getCurrPath(event) {
    var clickedElement = event.target;

    let currentPath = document.getElementById('current-path').textContent + clickedElement.textContent + "/"

    document.getElementById('current-path').innerHTML = currentPath

    upload(currentPath, flag)
}

function backPath() {
    let currentPath = document.getElementById('current-path').textContent

    if (currentPath === "/") {
        alert("Это предел")
        return
    }

    let pathArray = currentPath.split('/');

    console.log(pathArray)

    pathArray.pop();
    pathArray.pop();

    let newPath = pathArray.join('/') + "/";

    document.getElementById('current-path').innerHTML = newPath

    upload(newPath, flag)
}

function sort() {
    let currentPath = document.getElementById('current-path').textContent

    flag = !flag

    if (flag) {
        document.querySelector(".sort-button").style.backgroundImage = "url('static/source/icon/sortAsc.svg')";
    } else {
        document.querySelector(".sort-button").style.backgroundImage = "url('static/source/icon/sortDesc.svg')";
    }

    upload(currentPath, flag)
}