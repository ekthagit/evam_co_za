const documentType = document.getElementById("documentType");

// async function loadTemplate() {
//     const file =
//         documentType.value === "purchaseOrder"
//         ? "templates/purchase-order.html"
//         : "templates/invoice.html";
//     // const response = await fetch(file);
//     const response = await fetch(file, {
//         cache: "no-store"
//     });
//     const html = await response.text();
//     document.getElementById("invoiceContainer").innerHTML = html;
// }

async function loadTemplate() {

    if (documentType.value === "businessDocument") {
        return;
    }

    const file =
        documentType.value === "purchaseOrder"
        ? "templates/purchase-order.html"
        : "templates/invoice.html";

    const response = await fetch(file, {
        cache: "no-store"
    });

    document.getElementById("invoiceContainer").innerHTML =
        await response.text();
}

async function loadForm() {

    if (documentType.value === "businessDocument") {
        return;
    }

    const file =
        documentType.value === "purchaseOrder"
        ? "forms/purchase-order.html"
        : "forms/invoice.html";

    const response = await fetch(file, {
        cache: "no-store"
    });

    document.getElementById("formContainer").innerHTML =
        await response.text();
}

// async function loadForm() {

//     const file =
//         documentType.value === "purchaseOrder"
//             ? "forms/purchase-order.html"
//             : "forms/invoice.html";

//     // const response = await fetch(file);
//     const response = await fetch(file, {
//         cache: "no-store"
//     });
//     document.getElementById("formContainer").innerHTML =
//         await response.text();

// }

window.addEventListener("DOMContentLoaded", async () => {

    await loadForm();
    await loadTemplate();
    initializeForm();
    attachDocumentEvents(); // only once 
    if (isPurchaseOrder()) {
        attachPurchaseOrderEvents();
    } else {
        attachInvoiceEvents();
    }
    updatePreview();

    const termsEditor = document.getElementById("termsEditor");

    if (termsEditor) {
        termsEditor.addEventListener("input", updatePreview);
    }

});

function initializeForm() {

    initializeProducts();

    if (isPurchaseOrder()) {
        initializePurchaseOrder();
    } else {
        initializeInvoiceForm();
    }
}

function addRow() {
    const tr=document.createElement("tr");
    tr.innerHTML=`
        <td><input class="prod"></td>
        <td><input class="qty" type="number" value="1"></td>
        <td><input class="rate" type="number" value="0"></td>
        <td><input class="discount" type="number" value="0"></td>
        <td><input class="vat" type="number" value="0"></td>
        <td><button class="danger" onclick="this.closest('tr').remove();updatePreview()">X</button></td>`;
        document.getElementById("rows").appendChild(tr);
        tr.querySelectorAll("input").forEach(i=>i.addEventListener("input",updatePreview));
    }

    function initializeProducts() {
        const rows = document.getElementById("rows");
        rows.innerHTML = "";
        addRow();
    }


    function formatDate(dateString) {

        if (!dateString) return "";

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    function syncBillingToShipping() {

        const sameAsBilling = document.getElementById("sameAsBilling");

        if (!sameAsBilling || !sameAsBilling.checked) return;

        shipName.value = billName.value;
        shipAddress.value = billAddress.value;
        shipPhone.value = billPhone.value;

        updatePreview();
    }

function attachDocumentEvents() {

    documentType.addEventListener("change", async () => {

        if (documentType.value === "businessDocument") {

            window.open("forms/document.html", "_blank");

            documentType.value = "invoice";   // or purchaseOrder if you prefer

            return;
        }

        await loadForm();
        await loadTemplate();

        initializeForm();

        if (isPurchaseOrder()) {
            attachPurchaseOrderEvents();
        } else {
            attachInvoiceEvents();
        }

        updatePreview();

    });

}

    // function attachDocumentEvents() { 
    //     documentType.addEventListener("change", async () => { 
    //         await loadForm(); 
    //         await loadTemplate(); 
    //         initializeForm(); 
    //         if (isPurchaseOrder()) {
    //             attachPurchaseOrderEvents();
    //         } else {
    //             attachInvoiceEvents();
    //         }

    //         updatePreview(); 
    //     }); 
    // }

    function printDocument() {

        if (isPurchaseOrder()) {
            printPurchaseOrder();
        } else {
            printInvoice();
        }
    }

    function updatePreview() {

        if (typeof isPurchaseOrder === "function" && isPurchaseOrder()) {
            updatePurchaseOrderPreview();
            return;
        }

        updateInvoicePreview();
    }

        function renderHistory(){

            const history =
            JSON.parse(
                localStorage.getItem("invoiceHistory") || "[]"
                );

            historyBody.innerHTML = "";

            history.forEach(inv => {

                historyBody.innerHTML += `
        <tr>
            <td>${inv.invoiceNo}</td>
            <td>${inv.date}</td>
            <td>${inv.customer}</td>
            <td>${currency.value} ${inv.total}</td>
                </tr>`;
            });
        }

        // renderHistory();


        function numberToWords(num) {

            const ones = [
                "", "One", "Two", "Three", "Four", "Five",
                "Six", "Seven", "Eight", "Nine", "Ten",
                "Eleven", "Twelve", "Thirteen", "Fourteen",
                "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
            ];

            const tens = [
                "", "", "Twenty", "Thirty", "Forty",
                "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
            ];

            function convert(n) {

                if (n < 20) return ones[n];

                if (n < 100)
                    return tens[Math.floor(n / 10)] +
                (n % 10 ? " " + ones[n % 10] : "");

                if (n < 1000)
                    return ones[Math.floor(n / 100)] +
                " Hundred " +
                convert(n % 100);

                if (n < 1000000)
                    return convert(Math.floor(n / 1000)) +
                " Thousand " +
                convert(n % 1000);

                if (n < 1000000000)
                    return convert(Math.floor(n / 1000000)) +
                " Million " +
                convert(n % 1000000);

                return convert(Math.floor(n / 1000000000)) +
                " Billion " +
                convert(n % 1000000000);
            }

            return convert(Math.floor(num)).replace(/\s+/g, " ").trim();
        }

function amountToWords(amount, currency) {
    const whole = Math.floor(amount);
    const decimal = Math.round((amount - whole) * 100);

    const info = currencyInfo[currency];

    let words = numberToWords(whole) + " " + info.major;

    if (decimal > 0) {
        words += " and " +
            numberToWords(decimal) +
            " " + info.minor;
    }

    words += " Only";

    return words;
}

function showCurrencyWidget() {

    const modal = document.getElementById("currencyModal");
    const frame = document.getElementById("xeFrame");

    // Reload every time for fresh data
    frame.src =
        "https://www.xe.com/currencyconverter/fx-widget?amount=1&from=USD&to=INR&t=" +
        Date.now();

    modal.style.display = "flex";
}

function closeCurrencyWidget() {

    document.getElementById("currencyModal").style.display = "none";
    document.getElementById("xeFrame").src = "";
}