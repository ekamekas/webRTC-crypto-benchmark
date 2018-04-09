var loadFile = (callback) => {

    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "config.json", true);
    xobj.onreadystatechange = (res) => {
        if(res.readyState == "4" && res.status == "200")
            callback(res.responseText);
    };
    xobj.send(null);

};

var log = () => {
    console.log();
};