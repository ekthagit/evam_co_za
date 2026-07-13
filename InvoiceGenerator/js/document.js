/* ==========================================================
   BUSINESS DOCUMENT GENERATOR
   document.js
   ========================================================== */

const docDate = document.getElementById("docDate");
const docText = document.getElementById("docText");
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
docText.addEventListener("input", updatePreview);
signName.addEventListener("input", updatePreview);
designation.addEventListener("input", updatePreview);

printBtn.addEventListener("click", () => {

    window.print();

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

    page.querySelector(".previewDate").textContent =
        formatDate(docDate.value);

    page.querySelector(".previewText").textContent =
        docText.value;

    page.querySelector(".previewName").textContent =
        signName.value;

    page.querySelector(".previewDesignation").textContent =
        designation.value;

    documentContainer.appendChild(page);

}

/* ===========================================
   Create Page
=========================================== */

function createPage() {

    const page = document.createElement("div");

    page.className = "page";

    page.innerHTML = `

        <img
            src="../images/header.png"
            class="header-img"
            alt="Header">

        <div class="content">

            <div class="date-row">

                <span class="previewDate"></span>

            </div>

            <div class="document-text previewText"></div>

            <div class="signature">

                <div class="sign-name previewName"></div>

                <div class="sign-designation previewDesignation"></div>

            </div>

        </div>

        <img
            src="../images/footer.png"
            class="footer-img"
            alt="Footer">

    `;

    return page;

}