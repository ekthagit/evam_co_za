/* ==========================================================
   BUSINESS DOCUMENT GENERATOR
   document.js
   ========================================================== */

const docTitle = document.getElementById("docTitle");
const leftSignName = document.getElementById("leftSignName");
const leftDesignation = document.getElementById("leftDesignation");

const docDate = document.getElementById("docDate");
const editor = document.getElementById("editor");
const showRightSignature = document.getElementById("showRightSignature");
const signName = document.getElementById("signName");
const designation = document.getElementById("designation");

const printBtn = document.getElementById("printBtn");
const documentContainer = document.getElementById("documentContainer");


/* ===========================================
   Initialize
=========================================== */

window.addEventListener("DOMContentLoaded", () => {

    setToday();

    updatePreview();

});

/* ===========================================
   Events
=========================================== */

docDate.addEventListener("input", updatePreview);
docTitle.addEventListener("input", updatePreview);
leftSignName.addEventListener("input", updatePreview);
leftDesignation.addEventListener("input", updatePreview);
editor.addEventListener("input", updatePreview);
showRightSignature.addEventListener("change", updatePreview);
signName.addEventListener("input", updatePreview);
designation.addEventListener("input", updatePreview);

editor.addEventListener("keyup", updateToolbar);
editor.addEventListener("mouseup", updateToolbar);
editor.addEventListener("input", updateToolbar);

document
.querySelectorAll(".toolbar button")
.forEach(button=>{

    button.addEventListener("click",function(){

        editor.focus();

        document.execCommand(
            this.dataset.command,
            false,
            null
        );
        updateToolbar();
        updatePreview();

    });

});

printBtn.addEventListener("click", () => {

    window.print();

});

const fontFamily =
document.getElementById("fontFamily");

fontFamily.addEventListener("change",function(){

    editor.focus();

    document.execCommand(
        "fontName",
        false,
        this.value
    );

    updatePreview();

});

fontSize.addEventListener("change",function(){

    editor.focus();

    document.execCommand(
        "fontSize",
        false,
        this.value
    );

    updatePreview();

});

textColor.addEventListener("input",function(){

    editor.focus();

    document.execCommand(
        "foreColor",
        false,
        this.value
    );

    updatePreview();

});

highlightColor.addEventListener("input",function(){

    editor.focus();

    document.execCommand(
        "hiliteColor",
        false,
        this.value
    );

    updatePreview();

});

/* ===========================================
   Today's Date
=========================================== */

function setToday() {

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(today.getMonth() + 1).padStart(2, "0");

    const dd = String(today.getDate()).padStart(2, "0");

    docDate.value = `${yyyy}-${mm}-${dd}`;

}

/* ===========================================
   Format Date
=========================================== */

function formatDate(value) {

    if (!value) return "";

    const d = new Date(value);

    return d.toLocaleDateString("en-GB", {

        day: "2-digit",
        month: "long",
        year: "numeric"

    });

}

/* ===========================================
   Update Preview
=========================================== */

function updatePreview() {

    documentContainer.innerHTML = "";

    const page = createPage();

    page.querySelector(".previewDate").textContent = formatDate(docDate.value);
    page.querySelector(".previewText").innerHTML = editor.innerHTML;
    page.querySelector(".previewName").textContent = signName.value;
    page.querySelector(".previewDesignation").textContent = designation.value;
    page.querySelector(".leftName").textContent = leftSignName.value;
    page.querySelector(".leftDesignation").textContent = leftDesignation.value;

    const title = docTitle.value.trim();
    const titleDiv = page.querySelector(".previewTitle");
    const left = page.querySelector(".left-signature");
    const right = page.querySelector(".right-signature");

    if (title === "") {

        titleDiv.style.display = "none";
        left.style.visibility = "hidden";

    } else {

        titleDiv.style.display = "block";
        titleDiv.textContent = title;

        left.style.visibility = "visible";

    }

    if (showRightSignature.checked) {
        right.style.display = "block";
    } else {
        right.style.display = "none";
    }

    documentContainer.appendChild(page);
}

/* ===========================================
   Create Page
=========================================== */

function createPage() {

    const page = document.createElement("div");

    page.className = "page";

    page.innerHTML = `

        <img src="../images/header.png" class="header-img"  alt="Header">

        <div class="watermark">
            <img src="../logo.svg" alt="Watermark">
        </div>

        <div class="content">
            <div class="document-title previewTitle"></div>
            <div class="date-row">
                <span class="previewDate"></span>
            </div>

            <div class="document-text previewText"></div>

            <div class="signature-section">
                <div class="left-signature">
                    <div class="leftName"></div>
                    <div class="leftDesignation"></div>
                </div>

                <div class="right-signature">
                    <img src="../images/signature.png" class="signature-img">
                    <div class="previewName"></div>
                    <div class="previewDesignation"></div>
                </div>
            </div>
        </div>

        <img src="../images/footer.png" class="footer-img" alt="Footer">
    `;

    return page;
}

function updateToolbar() {

    document.querySelectorAll(".toolbar button").forEach(button => {

        const cmd = button.dataset.command;

        try {

            if (document.queryCommandState(cmd)) {

                button.classList.add("active");

            } else {

                button.classList.remove("active");

            }

        } catch (e) {
            // Some commands don't support queryCommandState
        }

    });

}