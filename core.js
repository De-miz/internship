


let errorMsgElem = document.getElementById("error-msg");

const errorMsg = (msg) => {
    errorMsgElem.innerText = msg;
    errorMsgElem.classList.remove("hide"); // show error message
}

const hideErrorMsg = () => errorMsgElem.classList.add("hide");

const emailValidation = (email) => {
    if (email.search(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) < 0) {
        return false;
    }
    return true;
}