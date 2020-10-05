window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();

// var token = (localStorage.getItem("token") != "undefined" || localStorage.getItem("token") != "" ) ? localStorage.getItem("token") : ""

var listBlock = new Array()
getBlockList_RenderTable()

function getBlockList_RenderTable() {
    browser.storage.local.get(['token'], function (result) {
        fetch("http://localhost:8089/api/v1/blocked_list/", {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + result.token
            }
        }
        ).then(Response => {
            if (Response.status == 200)
                return (Response.json())
            else
                return ({ data: null })
        })
            .then(res => {
                if (res.data != null) {
                    for (let i = 0; i < res.data.length; i++) {
                        listBlock[i] = res.data[i].ip_address
                    }
                    renderTable(listBlock)
                }
                else {
                    alert("Login to get block list!!!")
                    window.location.href = "../html/login.html";
                    // var a = document.createElement("a");
                    //     a.href="../html/login.html"
                    //     a.click();
                }
    
            })
    })

}

function renderTable(listBlock) {
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.
    var th1 = document.createElement("th");      // TABLE HEADER.
    th1.innerHTML = "STT";
    tr.appendChild(th1);

    var th2 = document.createElement("th");      // TABLE HEADER.
    th2.innerHTML = "Domain";
    tr.appendChild(th2);

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < listBlock.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < 2; j++) {
            var tabCell = tr.insertCell(-1);
            if (j == 0)
                tabCell.innerHTML = i;
            else
                tabCell.innerHTML = listBlock[i]
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("tableDomainBlock");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}