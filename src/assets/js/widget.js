/**
 * Create an HTML widget with the DigiByte Network information
 * @param {*} id 
 * @param {"count"|"countries"} value 
 */
function DigiByteNode(id, value = "count") {
    var obj = document.getElementById(id);
    obj.innerHTML = `
    <div style="width: 100%; height: 100px;">
        <h4 style="text-align: center;">
            Node Count
        </h4>
        <h1 style="text-align: center; max-height: 100%;">
            150
        </h1>
    </div>`;
}

DigiByteNode()