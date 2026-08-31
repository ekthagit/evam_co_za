function initializeInvoiceForm() {

    getNextInvoiceNumber();

    const today = new Date();
    invoiceDate.value = today.toISOString().split("T")[0];
    const due = new Date();
    due.setDate(today.getDate() + 30);
    dueDate.value = due.toISOString().split("T")[0];

    // loadRichEditor("invoiceTerms", "termsEditor", `
    //     <ol>
    //         <li>Consultancy services included in this invoice are charged and payable in full.</li>
    //         <li>Product values reflected in this invoice represent only advance payment.</li>
    //         <li>The remittance amount covers full consultancy fees and applicable advance payment.</li>
    //         <li>All prices and amounts stated are inclusive of 5% VAT.</li>
    //         <li>No additional charges, taxes, or VAT are payable beyond the invoiced amount.</li>
    //     </ol>
    // `);

}

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

        // if (!shipAddress.value.trim()) {
        //     alert("Please enter Shipping Address.");
        //     shipAddress.focus();
        //     return false;
        // }

        // if (!shipPhone.value.trim()) {
        //     alert("Please enter Shipping Phone Number.");
        //     shipPhone.focus();
        //     return false;
        // }

    return true;
}

function updateInvoicePreview() { 

    if(!document.getElementById('invoice')) return;

    const billName = document.getElementById("billName");
    const billVAT = document.getElementById("billVAT");
    const billAddress = document.getElementById("billAddress");
    const billPhone = document.getElementById("billPhone");

    const shipName = document.getElementById("shipName");
    const shipAddress = document.getElementById("shipAddress");
    const shipPhone = document.getElementById("shipPhone");

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

    const hsnNumber = document.getElementById("hsnNumber").value.trim();
    const divHSN = document.getElementById("divHSN");
    if (hsnNumber) {
        document.getElementById("spanHSN").textContent = hsnNumber;
        divHSN.style.display = "";
    } else {
        divHSN.style.display = "none";
    }

    let subtotal = 0;
    let totalDiscount = 0;
    let VATTotal = 0;

    const previewRows = document.getElementById("previewRows");
    previewRows.innerHTML = "";

    document.querySelectorAll("#rows tr").forEach(r => {

        const prod = r.querySelector(".prod").value || "";
        const qty = parseFloat(r.querySelector(".qty").value) || 0;
        const rate = parseFloat(r.querySelector(".rate").value) || 0;
        const discount = parseFloat(r.querySelector(".discount").value) || 0;
        const vat = parseFloat(r.querySelector(".vat").value) || 0;

        const amount = qty * rate;
        const appliedDiscount = Math.min(discount, amount);
        const netAmount = amount - appliedDiscount;
        const vatAmount = netAmount * vat / 100;

        subtotal += amount;
        totalDiscount += appliedDiscount;
        VATTotal += vatAmount;

        previewRows.innerHTML += `
        <tr>
            <td>${prod}</td>
            <td>${qty}</td>
            <td>${rate.toFixed(2)}</td>
            <td class="preview-discount">${appliedDiscount.toFixed(2)}</td>
            <td>${vat.toFixed(2)}%</td>
            <td>${(netAmount + vatAmount).toFixed(2)}</td>
        </tr>`;
    });

    document.getElementById("sub").textContent = subtotal.toFixed(2);
    document.getElementById("discountTotal").textContent = totalDiscount.toFixed(2);

    const previewDiscountHeader = document.getElementById("previewDiscountHeader");

    if (previewDiscountHeader) {
        previewDiscountHeader.style.display = totalDiscount > 0 ? "" : "none";

        document.querySelectorAll(".preview-discount").forEach(cell => {
            cell.style.display = totalDiscount > 0 ? "" : "none";
        });
    }

    const discountRow = document.getElementById("discountRow");

    if (discountRow) {
        discountRow.style.display = totalDiscount > 0 ? "" : "none";
    }

    const vatEl = document.getElementById("vatAmt");
    if(vatEl){
        vatEl.textContent = VATTotal.toFixed(2);
    }


    const grandTotal = (subtotal - totalDiscount) + VATTotal;
    document.getElementById("grand").textContent = (grandTotal).toFixed(2);

    const words = amountToWords(grandTotal, currency.value);
    document.getElementById("amountWords").textContent = words;

    document.getElementById("currencyLabel1").textContent = currency.value;
    document.getElementById("currencyLabelDiscount").textContent = currency.value;
    document.getElementById("currencyLabel2").textContent = currency.value;
    document.getElementById("currencyLabel3").textContent = currency.value;

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

    document.getElementById("footerText").textContent = COMPANY.footerInvoiceText;
    document.getElementById("companyName").innerHTML = COMPANY.name;
    document.getElementById("companyFooter").innerHTML = COMPANY.name + "<br>" + COMPANY.address + "  " + COMPANY.phone;

    const productHeader = document.getElementById("previewHeaderProduct");
    const productNameInput = document.getElementById("columnNameProduct");

    if (productHeader && productNameInput) {
        productHeader.textContent = productNameInput.value || "Product";
    }
}

function attachInvoiceEvents() {

    ["billName","billVAT","billAddress","billPhone", "shipName","shipAddress","shipPhone", "invoiceNo","invoiceDate","dueDate", "hsnNumber", "currency","bankAccount" ].forEach(id => {

        const el = document.getElementById(id);

        if (el) {
            el.addEventListener("input", () => {
                syncBillingToShipping();
                updatePreview();
            });
        }

    });

    const sameAsBilling = document.getElementById("sameAsBilling");

    if (sameAsBilling) {
        sameAsBilling.addEventListener("change", () => {
            if (sameAsBilling.checked) {
                syncBillingToShipping();
            }
        });
    }

    const editColumnsBtn = document.getElementById("editColumnsBtn");
    const columnSettings = document.getElementById("columnSettings");

    if (editColumnsBtn && columnSettings) {
        editColumnsBtn.addEventListener("click", () => {

            if (columnSettings.style.display === "none") {
                columnSettings.style.display = "block";
            } else {
                columnSettings.style.display = "none";
            }

        });
    }

   ["columnNameProduct", "columnNameQty", "columnNameRate", "columnNameDiscount", "columnNameVAT", "columnNameAmount"].forEach(id => {

        const el = document.getElementById(id);

        if (el) {
            el.addEventListener("input", updateColumnNames);
        }

    });
}

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

function updateColumnNames() {

    const columns = [
        {
            input: "columnNameProduct",
            form: "formHeaderProduct",
            preview: "previewHeaderProduct",
            defaultName: "Product"
        },
        {
            input: "columnNameQty",
            form: "formHeaderQty",
            preview: "previewHeaderQty",
            defaultName: "Qty"
        },
        {
            input: "columnNameRate",
            form: "formHeaderRate",
            preview: "previewHeaderRate",
            defaultName: "Rate"
        },
        {
            input: "columnNameDiscount",
            form: "formHeaderDiscount",
            preview: "previewDiscountHeader",
            defaultName: "Discount"
        },
        {
            input: "columnNameVAT",
            form: "formHeaderVAT",
            preview: "previewHeaderTax",
            defaultName: "Tax"
        },
        {
            input: "columnNameAmount",
            form: "formHeaderAmount",
            preview: "previewHeaderAmount",
            defaultName: "Amount"
        }
    ];

    columns.forEach(column => {

        const input = document.getElementById(column.input);

        if (!input) return;

        const value = input.value.trim() || column.defaultName;

        const formHeader = document.getElementById(column.form);
        const previewHeader = document.getElementById(column.preview);

        if (formHeader) {
            formHeader.textContent = value;
        }

        if (previewHeader) {
            previewHeader.textContent = value;
        }
    });
}