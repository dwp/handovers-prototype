if(document.getElementById("ben-6").selected) {
    document.getElementById("benSubTypeDiv").style.display = "block";
}

function benCheck() {
    if ((document.getElementById("ben-6").selected) || (document.getElementById("benSelect").selected)) {
        document.getElementById("benSubTypeDiv").style.display = "block";
    } else {
        document.getElementById("benSubTypeDiv").style.display = "none";
    }
}

