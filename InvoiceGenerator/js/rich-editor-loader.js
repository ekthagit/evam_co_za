/* ==========================================================
   RICH EDITOR LOADER
   ========================================================== */

async function loadRichEditor(containerId, editorId, initialContent = "") {

    const container = document.getElementById(containerId);

    if (!container) return;

    try {

        const response = await fetch("../components/rich-editor.html");

        if (!response.ok) {
            throw new Error("Unable to load rich editor.");
        }

        const html = await response.text();

        container.innerHTML = html;

        const editor = container.querySelector(".editor");

        if (editor && editorId) {
            editor.id = editorId;
        }

        if (editor && initialContent) {
            editor.innerHTML = initialContent;
        }

        initializeRichEditors();

        if (editor && typeof updateInvoicePreview === "function") {
            editor.addEventListener("input", updateInvoicePreview);
        }

        if (typeof updateInvoicePreview === "function") {
            updateInvoicePreview();
        }

    } catch (error) {

        console.error("Rich Editor Load Error:", error);

    }

}