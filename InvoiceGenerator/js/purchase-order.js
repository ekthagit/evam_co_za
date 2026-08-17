function isPurchaseOrder() {
    return document.getElementById("documentType").value === "purchaseOrder";
}

function initializePurchaseOrder() {

    const today = new Date();
    poDate.value = today.toISOString().split("T")[0];

}

function validatePurchaseOrder() {

    // We'll add validation later.

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

    if (!poNo.value.trim()) {
        alert("Please enter Purchase Order Number.");
        poNo.focus();
        return false;
    }

    return true;
}

function updatePurchaseOrderPreview() {

    if (!document.getElementById("purchaseOrder")) return;

    const billName = document.getElementById("billName");
    const billVAT = document.getElementById("billVAT");
    const billAddress = document.getElementById("billAddress");
    const billPhone = document.getElementById("billPhone");

    const shipName = document.getElementById("shipName");
    const shipAddress = document.getElementById("shipAddress");
    const shipPhone = document.getElementById("shipPhone");

    const vendorName = document.getElementById("vendorName");
    const vendorAddress = document.getElementById("vendorAddress");
    const vendorPhone = document.getElementById("vendorPhone");

    document.getElementById("pBillName").textContent = billName.value;

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

    document.getElementById("pPONo").textContent = poNo.value;
    document.getElementById("pPODate").textContent = formatDate(poDate.value);
    document.getElementById("pDeliveryTerm").textContent = poDeliveryTerm.value;
    document.getElementById("pPaymentTerms").textContent = poPaymentTerms.value;

    document.getElementById("pVendorName").textContent = vendorName.value;
    document.getElementById("pVendorAddress").textContent = vendorAddress.value;
    document.getElementById("pVendorPhone").textContent = vendorPhone.value;

    let subtotal = 0;
    let VATTotal = 0;

    const previewRows = document.getElementById("previewRows");
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

    const grandTotal = subtotal + VATTotal;
    document.getElementById("grand").textContent = (grandTotal).toFixed(2);

    const words = amountToWords(grandTotal, currency.value);
    document.getElementById("amountWords").textContent = words;

    document.getElementById("currencyLabel1").textContent = currency.value;
    document.getElementById("currencyLabel2").textContent = currency.value;
    document.getElementById("currencyLabel3").textContent = currency.value;

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

    document.getElementById("footerText").textContent = COMPANY.footerPOText;
    document.getElementById("companyName").innerHTML = COMPANY.name;
    document.getElementById("companyFooter").innerHTML = COMPANY.name + "<br>" + COMPANY.address + "  " + COMPANY.phone;
}

function printPurchaseOrder() {

    if (!validatePurchaseOrder()) return;

    updatePurchaseOrderPreview();

    const invoiceHTML = document.getElementById("purchaseOrder").outerHTML;
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
            <title>Purchase Order</title>
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

function attachPurchaseOrderEvents() {

        ["billName","billVAT","billAddress","billPhone", "shipName","shipAddress","shipPhone", "poNo","poDate","poDeliveryTerm", "poPaymentTerms", "vendorName", "vendorAddress", "vendorPhone"].forEach(id => {

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
    }