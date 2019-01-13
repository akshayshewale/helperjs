window.addEventListener("includeend", function (e) {
    filterElements("docsDiv", "searcherAllDocs");
    filterTable("tableFilterTable", "searcherFilterTable");
    $(".button-collapse").sideNav();
});

function sendValidator() {
    let type = document.getElementById("typeValidator").value;
    let name = document.getElementById("nameValidator").value;
    let isTrue = validator(type, name);
    if (isTrue) {
        document.getElementById("outputValidator").innerHTML = name + " is a " + type;
    } else {
        document.getElementById("outputValidator").innerHTML = name + " is NOT a " + type;
    }
}

function sendGetValuesByIds() {
    let arrayOfIds = ["nameGetValuesByIds", "phoneGetValuesByIds", "emailGetValuesByIds", "divExampleGetValuesByIds"];
    document.getElementById("outputGetValuesByIds").innerHTML = getValuesByIds(arrayOfIds);
}

function sendGetValuesByNames() {
    let arrayOfNames = ["nameGetValuesByNames", "phoneGetValuesByNames", "emailGetValuesByNames", "divExampleGetValuesByNames"];
    document.getElementById("outputGetValuesByNames").innerHTML = getValuesByNames(arrayOfNames);
}

function sendCheckRequiredIds() {
    let arrayOfIds = ["nameCheckRequiredIds", "phoneCheckRequiredIds", "emailCheckRequiredIds", "divExampleCheckRequiredIds"];
    document.getElementById("outputCheckRequiredIds").innerHTML = checkRequiredIds(arrayOfIds);
}

function sendCheckRequiredNames() {
    let arrayOfNames = ["nameCheckRequiredNames", "phoneCheckRequiredNames", "emailCheckRequiredNames", "divExampleCheckRequiredNames"];
    document.getElementById("outputCheckRequiredNames").innerHTML = checkRequiredNames(arrayOfNames);
}

function sendGetQueryString() {
    var arrayOfIds = ["nameGetQueryString", "phoneGetQueryString", "emailGetQueryString", "divExampleGetQueryString"];
    let qs = getQueryString("file.php", arrayOfIds, arrayOfIds);
    document.getElementById("outputGetQueryString").innerHTML = qs;
}

function sendCreateDynamicElement() {

}

function sendCreateDynamicElement() {
    createDynamicElement("makeDynam");
}

function sendgetDataToIds() {
    getDataToIds("query.php?getDataToIds=true", ["namegetDataToIds1", "phonegetDataToIds1", "helperDate", "helperVersion"]);
}

function sendLocal() {
    let vals = getValuesByIds(["nameLocal", "valueLocal"]);
    if (validator("isNotNull", vals[1])) {
        local(vals[0], vals[1]);
        document.getElementById("outputLocal").innerHTML = "Added Successfully";
    } else {
        document.getElementById("outputLocal").innerHTML = local(vals[0]);
    }
}

function sendSession() {
    let vals = getValuesByIds(["nameSession", "valueSession"]);
    if (validator("isNotNull", vals[1])) {
        local(vals[0], vals[1]);
        document.getElementById("outputSession").innerHTML = "Added Successfully";
    } else {
        document.getElementById("outputSession").innerHTML = local(vals[0]);
    }
}

//if ("serviceWorker" in navigator) {
//    window.addEventListener("load", () => {
//        navigator
//            .serviceWorker
//            .register("sw.js")
//    })
//}
