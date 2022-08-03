function GET(url, callback = null) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener("load", function () {
        if (this.status != 200)
            return callback(null);

        var response = JSON.parse(this.responseText);
        if (response.error)
            return callback(null);

        return callback(response);
    });
    xhr.send();
}

/**
 * Create an HTML widget with the DigiByte Network information
 * @param {*} id 
 * @param {"count"|"countries"} value 
 */
function DigiByteCrawler(id, value = "count") {
    GET(value == "count" ? "/api/subversions" : "/api/countries", (data) => {
        if (value == "countries")
            var amount = Object.keys(data).length;
        else {
            var amount = 0;
            for (var key of Object.keys(data))
                amount += data[key];
        }

        var obj = document.getElementById(id);
        obj.innerHTML = `
        <div style="width: 100%; height: 100px;">
            <h4 style="text-align: center;">
                Node Count
            </h4>
            <h1 style="text-align: center; max-height: 100%;">
                ${amount}
            </h1>
        </div>`;
    });
}

DigiByteNode()