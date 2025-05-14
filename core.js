


let errorMsgElem = document.getElementById("error-msg");

const errorMsg = (msg) => {
    errorMsgElem.innerText = msg;
    errorMsgElem.classList.remove("hide"); // show error message
}

const hideErrorMsg = () => errorMsgElem.classList.add("hide");