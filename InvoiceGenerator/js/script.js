
async function loadInvoiceTemplate(){
 const response=await fetch("invoice-template-v3.html");
 const html=await response.text();
 document.getElementById("invoiceContainer").innerHTML=html;
 updatePreview();
}
window.addEventListener("DOMContentLoaded",loadInvoiceTemplate);

window.addEventListener("DOMContentLoaded", async () => {

    await loadInvoiceTemplate();

    const termsEditor = document.getElementById("termsEditor");

    if (termsEditor) {
        termsEditor.addEventListener("input", updatePreview);
    }

});


function getNextInvoiceNumber() {

    let counter = parseInt(localStorage.getItem("invoiceCounter") || "1");

    let today = new Date();

//     let invoiceNo =
// `INV-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}-${String(counter).padStart(4,'0')}`;

    const year = String(today.getFullYear()).slice(-2);
    const month = today.getMonth() + 1;

    let invoiceNo = `INV-${year}/${month}/${String(counter).padStart(3, '0')}`;

    document.getElementById("invoiceNo").value = invoiceNo;
}

getNextInvoiceNumber();

const today = new Date();

document.getElementById("invoiceDate").value = today.toISOString().split("T")[0];

const due = new Date();

due.setDate(today.getDate() + 30);

document.getElementById("dueDate").value =
due.toISOString().split("T")[0];

function addRow() {
    const tr=document.createElement("tr");
    tr.innerHTML=`
        <td><input class="prod"></td>
        <td><input class="qty" type="number" value="1"></td>
        <td><input class="rate" type="number" value="0"></td>
        <td><input class="vat" type="number" value="0"></td>
        <td><button class="danger" onclick="this.closest('tr').remove();updatePreview()">X</button></td>`;
        document.getElementById("rows").appendChild(tr);
        tr.querySelectorAll("input").forEach(i=>i.addEventListener("input",updatePreview));
        updatePreview();
    }
    addRow();

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

    ["billName","billVAT","billAddress","billPhone","shipName","shipAddress","shipPhone","invoiceNo","invoiceDate","dueDate","currency","bankAccount"]
    .forEach(id=>document.getElementById(id).addEventListener("input",updatePreview));

    const sameAsBilling = document.getElementById("sameAsBilling");

    function copyBillingDetails() {

        shipName.value = billName.value;
        shipAddress.value = billAddress.value;
        shipPhone.value = billPhone.value;

        updatePreview();
    }

    sameAsBilling.addEventListener("change", function () {

        if (this.checked) {
            copyBillingDetails();

            shipName.readOnly = true;
            shipAddress.readOnly = true;
            shipPhone.readOnly = true;
        } else {
            shipName.readOnly = false;
            shipAddress.readOnly = false;
            shipPhone.readOnly = false;
        }

    });

    ["billName","billAddress","billPhone"].forEach(id => {

        document.getElementById(id).addEventListener("input", () => {

            if (sameAsBilling.checked) {
                copyBillingDetails();
            }

        });

    });

    
    function validateInvoice() {

        if (!billName.value.trim()) {
            alert("Please enter Customer / Company Name.");
            billName.focus();
            return false;
        }

        if (!billAddress.value.trim()) {
            alert("Please enter Billing Address.");
            billAddress.focus();
            return false;
        }

        if (!billPhone.value.trim()) {
            alert("Please enter Billing Phone Number.");
            billPhone.focus();
            return false;
        }

        if (!shipName.value.trim()) {
            alert("Please enter Shipping Company Name.");
            shipName.focus();
            return false;
        }

        if (!shipAddress.value.trim()) {
            alert("Please enter Shipping Address.");
            shipAddress.focus();
            return false;
        }

        if (!shipPhone.value.trim()) {
            alert("Please enter Shipping Phone Number.");
            shipPhone.focus();
            return false;
        }

        return true;
    }

    function updatePreview() { 
        if(!document.getElementById('invoice')) return;

        document.getElementById("pBillName").textContent = billName.value;

        // document.getElementById("pBillVAT").textContent = billVAT.value ? "VAT No: " + billVAT.value : "";

        const billVatRow = document.getElementById("billVatRow");

        if (billVAT.value.trim()) {
            document.getElementById("pBillVAT").textContent = "VAT No: " + billVAT.value;
            billVatRow.style.display = "";
        } else {
            billVatRow.style.display = "none";
        }

        document.getElementById("pBillAddress").textContent = billAddress.value;
        document.getElementById("pBillPhone").textContent = billPhone.value;

        document.getElementById("pShipName").textContent = shipName.value;
        document.getElementById("pShipAddress").textContent = shipAddress.value;
        document.getElementById("pShipPhone").textContent = shipPhone.value;

        document.getElementById("pInv").textContent = invoiceNo.value;
        document.getElementById("pDate").textContent = formatDate(invoiceDate.value);
        document.getElementById("pDueDate").textContent = formatDate(dueDate.value);

        let subtotal = 0;
        let VATTotal = 0;

        previewRows.innerHTML = "";

        document.querySelectorAll("#rows tr").forEach(r => {

            const prod = r.querySelector(".prod").value || "";
            const qty = parseFloat(r.querySelector(".qty").value) || 0;
            const rate = parseFloat(r.querySelector(".rate").value) || 0;
            const vat = parseFloat(r.querySelector(".vat").value) || 0;

            const amount = qty * rate;
            const vatAmount = amount * vat / 100;

            subtotal += amount;
            VATTotal += vatAmount;

            previewRows.innerHTML += `
        <tr>
            <td>${prod}</td>
            <td>${qty}</td>
            <td>${rate.toFixed(2)}</td>
            <td>${vat.toFixed(2)}%</td>
            <td>${(amount + vatAmount).toFixed(2)}</td>
            </tr>`;
        });

        document.getElementById("sub").textContent = subtotal.toFixed(2);

        const vatEl = document.getElementById("vatAmt");
        if(vatEl){
            vatEl.textContent = VATTotal.toFixed(2);
        }


        document.getElementById("grand").textContent =
        (subtotal + VATTotal).toFixed(2);

        const grandTotal = subtotal + VATTotal;

        const whole = Math.floor(grandTotal);
        const decimal = Math.round((grandTotal - whole) * 100);

        const curr = currency.value;
        const info = currencyInfo[curr];

        let words =
        numberToWords(whole) + " " + info.major;

        if(decimal > 0){
            words += " and " +
            numberToWords(decimal) +
            " " + info.minor;
        }

        words += " Only";

        document.getElementById("amountWords").textContent = words;

                    // const curr = currency.value;
        document.getElementById("currencyLabel1").textContent = curr;
        document.getElementById("currencyLabel2").textContent = curr;
        document.getElementById("currencyLabel3").textContent = curr;

        const b = banks[bankAccount.value];

        let html = "";

        for (const [key, value] of Object.entries(b)) {

            if (key === "") {
                html += `<b>${value}</b><br>`;
            } else {
                html += `<b>${key}:</b> ${value}<br>`;
            }
        }

        document.getElementById("bankPreview").innerHTML = html;

            const termsEditor = document.getElementById("termsEditor");
            const previewTerms = document.getElementById("previewTerms");
            const notesSection = document.getElementById("notesSection");

            if (termsEditor && previewTerms && notesSection) {

                previewTerms.innerHTML = termsEditor.innerHTML;

                // Remove HTML tags and whitespace to check if there is any real content
                const text = previewTerms.textContent.trim();

                if (text === "") {
                    notesSection.style.display = "none";
                } else {
                    notesSection.style.display = "block";
                }
            }

            document.getElementById("footerText").textContent = COMPANY.footerText;
            document.getElementById("companyName").innerHTML = COMPANY.name;
            document.getElementById("companyFooter").innerHTML = COMPANY.name + "<br>" + COMPANY.address + "  " + COMPANY.phone;

        }

        // function printInvoice() {
        //     updatePreview();
        //     window.print();
        // }

        function printInvoice() {

            if (!validateInvoice()) return;

            updatePreview();

            const invoiceHTML = document.getElementById("invoice").outerHTML;
            const printWindow = window.open("", "_blank");

            // const printWindow = window.open(
            //     "",
            //     "Invoice",
            //     "width=900,height=1200,left=100,top=50"
            // );

            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice</title>
            <link rel="stylesheet" href="css/style1.css">
        </head>
        <body>

        ${invoiceHTML}

        </body>
        </html>
        `);

            printWindow.document.close();

            printWindow.onload = function () {
                printWindow.focus();
                printWindow.print();

                printWindow.onafterprint = function () {
                    printWindow.close();
                };
            };
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
