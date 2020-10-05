function getBlockList_RenderTable() {
    fetch("http://localhost:8080/api/blockList").then(Response => {
        return Response.text()

    }).then(res => {
        var t = res.split(';')
        return t.slice(1, t.length)// slice to remove first domain "*://*.//*"
    }).then(t => renderTable(t))
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
getBlockList_RenderTable()