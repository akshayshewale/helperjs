window.addEventListener("load", function () {
    include();
});
//creates the query for you
//param1 is the file name
//param2 is the array of header of id values you want to have
//param3 is the array of id of which you want the value of
//param4[optional{default = []}] is the array of headers for names
//param5[optional{default = []}] is the array of names of which you want the values of
//return type string
//input eg::makeQueryString("file.php",["a1","a2"],["id1","id2"],["xy"],["name1"]);
//output eg::"file.php?submit=true&a1=1&a2=2&xy[]=45&xy[]=42&xy[]=40"
const getQueryString = (file, headerOfIds, arrayOfId, headerOfNames = [], arrayOfNames = []) => {
    //starting query string
    var qs = file + "?submit=true";
    //making id string
    getValuesByIds(arrayOfId)
        .forEach((val, i) => {
            qs += "&" + headerOfIds[i] + "=" + val
        })
    //making name string
    getValuesByNames(arrayOfNames)
        .forEach((nameVal, i) => {
            nameVal.forEach((val) => {
                qs += "&" + headerOfNames[i].replace("[]") + "[]=" + val
            })
        })
    //returning query string
    return qs;
}

//inserts the data to ids provided
//param1 defines the query string
//param2 defines the array of ids in which you want to insert the data
//param3[optional{default = "##"}] defines the string to be used to seperate the data
//return type void
//input eg::getDataToIds("file.php?submit=true&a1=1&a2=2&xy[]=45&xy[]=42&xy[]=40",["a1","a2"]);
const getDataToIds = (qs, arrayOfIds, splitBy = "##") => {
    fetch(qs)
        .then(res => res.text())
        .then(data => {
            data.split(splitBy).forEach((val, i) => {
                //console.log(val);
                var elem = document.getElementById(arrayOfIds[i]);
                //console.log(elem, hasValue(elem));
                hasValue(elem) ? elem.value = val : elem.innerHTML = val;
            })
        })
}

//used to include different files into the html
//just create a <include>tag in your html and have a
//"file" and "to" attributes which define the "file" to get data from and "to" which id to fill it in
//not needed to be called
//return type void
const include = () => {
    var tags = document.getElementsByTagName("include");
    for (var i = 0; i < tags.length; i++) {
        var elem = tags[i];
        fetch(elem.getAttribute("file") + "?&idForReq=" + elem.getAttribute("to"))
            .then(es => {
                es.text()
                    .then(ex => {
                        document.getElementById(es.url
                                .split("?&")
                                .pop()
                                .split("=")
                                .pop())
                            .innerHTML = ex
                    })

            })
    }
}

//used to handle and validator values as per types provided
//available types are {email,phone,name,radio,checkbox,isNotNull,number}
//param1 is the type of the validation
//param2 is the value to be validatord 
//with the exception of radio and checkbox where the param2 is the name of the checkbox or radio button to be checked
//return type boolean
//input eg::validator("phone", "7012896734");
//output eg::true;
//input eg::validator("phone", "70128967");
const validator = (type, value) => {
    try {

        switch (type) {
            case "phone":
                return value.length == 10 && /^[7-9][0-9]{9}$/.test(value);
                break;
            case "number":
                try {
                    let x = parseInt(value)
                    return true
                } catch (e) {
                    return false
                }
                break;
            case "email":
                return /^[\w\.=-]+@[\w\.-]+\.[\w]{2,5}$/.test(value)
                break;
            case "name":
                for (let i = 0; i < value.length; i++) {
                    let code = value[i].charCodeAt(0);
                    if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code == 32)) {
                        return false
                    }
                }
                return true;
                break;
            case "isNotNull":
                return !((value.length == 0) || (value == "") || value == null || value == undefined);
                break;
                //        case "url":
                //            return value.match("_^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,})))(?::\d{2,5})?(?:/[^\s]*)?$_iuS");
                //            break;
            case "radio" || "checkbox":
                getValuesByNames([value])[0].forEach(function (e) {
                    if (validator("isNotNull", e)) {
                        return true;
                    }
                });
                return false;
                break;
            default:
                throw `Not Handling ${type} validations for Value ${value} please contact the developers`;
                //            //console.log();
        }
        return false;
    } catch (e) {
        return false;
    }
}

//used to retrive data from multiple ids so that you dont have to
//param1 is the array of ids whose you want the data of
//return type array
//input eg::getValuesByIds(['a1',"a2"]);
//output eg::["a1ans","a2ans"];
//testing DONE
const getValuesByIds = (arrayOfIds) => {
    return arrayOfIds.map(id => hasValue(document.getElementById(id)) ? document.getElementById(id).value : document.getElementById(id).innerHTML)
}

//used to retrive data from multiple names so that you dont have to
//param1 is the array of names whose you want the data of
//return type 2d array [[],[],[]]
//input eg::getValuesByNames(['name1',"name2"]);
//output eg::[["name1ans1","name1ans2"],["name2ans1","name2ans2","name2ans3"]];
//testing DONE
const getValuesByNames = (arrayOfNames) => {
    return arrayOfNames.map(name => {
        var elems = document.getElementsByName(name)
        var miniArray = [];
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].multiple) {
                let options = elems[i].selectedOptions
                let insStr = [];
                for (let k = 0; k < options.length; k++) {
                    if (validator("isNotNull", options[k].value)) {
                        insStr.push(options[k].value);
                    }
                }
                miniArray.push(insStr.join(","));
            } else {
                var flag = true;
                try {
                    flag = elems[i].getAttribute("type").toString().toLowerCase() == "checkbox" || elems[i].getAttribute("type").toString().toLowerCase() == "radio";
                } catch (e) {
                    flag = false;
                }
                if (flag) {
                    //console.log(elems[i].checked ? elems[i].value : false);
                    miniArray.push(elems[i].checked ? elems[i].value : false);
                } else if (hasValue(elems[i])) {
                    if (validator("isNotNull", elems[i].value)) {
                        miniArray.push(elems[i].value)
                    }
                } else {
                    if (validator("isNotNull", elems[i].innerHTML)) {
                        miniArray.push(elems[i].innerHTML)
                    }
                }
            }
        };
        return miniArray;
    })
}

//this is a privated function
//testing DONE
const hasValue = (elem) => {
    return ["INPUT", "SELECT", "TEXTAREA"].includes(elem.tagName.toUpperCase());
}

//used to filter tables using visible data
//param1 is the table body id you want to filter from
//param2 is the input field you want to use the input from
//return type void
//input eg::filterTable("testTableFunc","searchForTable");
//testing DONE
const filterTable = (tableId, searchBy) => {
    document.getElementById(searchBy).addEventListener("keyup", e => {
        var text = e.srcElement.value;
        var tbody = document.getElementById(tableId).getElementsByTagName("tr");
        for (var rows = 0; rows < tbody.length; rows++) {
            (tbody[rows].innerHTML.toLowerCase().search(text.toLowerCase()) != -1) ?
            tbody[rows].style.display = "block": tbody[rows].style.display = "none";
        }
    })
}

//used to filter elements using visible data
//param1 is the parent id of the elements you want to filter
//param2 is the input field you want to use the input from
//return type void
//input eg::filterElements("filterElementsId","searchForElement");
//testing DONE
const filterElements = (parentId, searchBy) => {
    document.getElementById(searchBy).addEventListener("keyup", e => {
        var text = e.srcElement.value;
        var children = document.getElementById(parentId).children;;
        for (var index = 0; index < children.length; index++) {
            (children[index].innerHTML.toLowerCase().search(text.toLowerCase()) != -1) ?
            children[index].style.display = "block": children[index].style.display = "none"
        }
    })
}

//used to validator multiple elements whose ids are passed
//param1 is the array of ids to check
//return type boolean
//input eg::checkRequiredIds(['a1',"a2"]);
//output eg::true;
//testing DONE
const checkRequiredIds = (arrayOfIds) => {
    let flag = true
    arrayOfIds.forEach(id => {
        var elem = document.getElementById(id);
        if (hasValue(elem)) {
            if (!validator("isNotNull", elem.value)) {
                flag = false
            }
        } else {
            if (!validator("isNotNull", elem.innerHTML)) {
                flag = false
            }
        }
    });
    return flag;
}

//used to validator multiple elements whose names are passed
//param1 is the array of names to check
//return type boolean
//input eg::checkRequiredNames(['name1',"name2"]);
//output eg::true;
//testing DONE
const checkRequiredNames = (arrayOfNames) => {
    for (let j = 0; j < arrayOfNames.length; j++) {
        let name = arrayOfNames[j];
        let isFilled = false;
        let elem = document.getElementsByName(name);
        for (var i = 0; i < elem.length; i++) {
            if (hasValue(elem[i])) {
                if (validator("isNotNull", elem[i].value)) {
                    isFilled = true;
                }
            } else {
                if (validator("isNotNull", elem[i].innerHTML)) {
                    isFilled = true;
                }
            }
        }
        if (!isFilled) {
            return false;
        }
    }
    return true;
}

//used to set or get data from the localstorage
//param 1 is the name of the key that is used to store the values
//param 2[optional] is the value to store in the given key
//return type string||undefined
//input eg local("name") //outputs the value of the "name" key
//input eg local("name","values") //stores the "values" to the "name" key
const local = (name, value) => {
    return validator("isNotNull", value) ? window.localStorage.setItem(name, value) : (window.localStorage.getItem(name))
}

//used to set or get data from the sessionStorage
//param 1 is the name of the key that is used to store the values
//param 2[optional] is the value to store in the given key
//return type string||undefined
//input eg local("name") //outputs the value of the "name" key
//input eg local("name","values") //stores the "values" to the "name" key
const session = (name, value) => {
    return validator("isNotNull", value) ? window.sessionStorage.setItem(name, value) : (window.sessionStorage.getItem(name))
}

//used to replace string in the given string with given string
//param 1 is the main string in which replacement has to be
//param 2 is the string/regex that you want to replace in the main string
//param 3 is the value you want in place of the replaced string in the main string
//return type String
//input eg replaceInString("this is to be replaced","e","Z")
//output eg "this is to bZ rZplacZd"
const replaceInString = (mainString, replaceString, replaceWith) => {
    let strArray = mainString.split(replaceString);
    let ret = strArray[0];
    for (let i = 1; i < strArray.length; i++) {
        ret = ret.concat(replaceWith.toString().concat(strArray[i]));
    }
    return ret;
}

//used to create a dynamic element on call of this function
//param 1 the parent id of the div you want to generate dynamically
//param 2 [optional {default : "##"}] it is the string you have given as a variable to replace in the html code(see index.html for info)
//input eg createDynamicElement("rootOfElement")
//output eg:creates a copy with number of the template first child provided in html code(see index.html for info)
const createDynamicElement = (parentId, replaceString = "##") => {
    let parentElem = document.getElementById(parentId);
    parentElem.children[0].style.display = "none"
    let children = parentElem.children[0].innerHTML.replace("\n", "")
    let str = "<div>" + replaceInString(children, replaceString, parentElem.childElementCount) + "</div>";
    parentElem.insertAdjacentHTML("beforeend", str)
}
