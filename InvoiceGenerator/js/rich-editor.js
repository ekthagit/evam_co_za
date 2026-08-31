/* ==========================================================
   REUSABLE RICH TEXT EDITOR
   rich-editor.js
   ========================================================== */

function initializeRichEditors() {

    document.querySelectorAll(".rich-editor").forEach(container => {

        const editor = container.querySelector(".editor");

        if (!editor) return;

        setupRichEditor(container, editor);

    });

}


/* ==========================================================
   Setup Editor
   ========================================================== */

function setupRichEditor(container, editor) {

    /* ===========================================
       Toolbar Buttons
    =========================================== */

    container.querySelectorAll(".toolbar button").forEach(button => {

        button.addEventListener("click", function () {

            editor.focus();

            document.execCommand(
                this.dataset.command,
                false,
                null
            );

            updateRichEditorToolbar(container);

            editor.dispatchEvent(new Event("input", {
                bubbles: true
            }));

        });

    });


    /* ===========================================
       Font Family
    =========================================== */

    const fontFamily =
        container.querySelector(".font-family");

    if (fontFamily) {

        fontFamily.addEventListener("change", function () {

            editor.focus();

            document.execCommand(
                "fontName",
                false,
                this.value
            );

            editor.dispatchEvent(new Event("input", {
                bubbles: true
            }));

        });

    }


    /* ===========================================
       Font Size
    =========================================== */

    const fontSize =
        container.querySelector(".font-size");

    if (fontSize) {

        fontSize.addEventListener("change", function () {

            editor.focus();

            document.execCommand(
                "fontSize",
                false,
                this.value
            );

            editor.dispatchEvent(new Event("input", {
                bubbles: true
            }));

        });

    }


    /* ===========================================
       Text Color
    =========================================== */

    const textColor =
        container.querySelector(".text-color");

    if (textColor) {

        textColor.addEventListener("input", function () {

            editor.focus();

            document.execCommand(
                "foreColor",
                false,
                this.value
            );

            editor.dispatchEvent(new Event("input", {
                bubbles: true
            }));

        });

    }


    /* ===========================================
       Highlight Color
    =========================================== */

    const highlightColor =
        container.querySelector(".highlight-color");

    if (highlightColor) {

        highlightColor.addEventListener("input", function () {

            editor.focus();

            document.execCommand(
                "hiliteColor",
                false,
                this.value
            );

            editor.dispatchEvent(new Event("input", {
                bubbles: true
            }));

        });

    }


    /* ===========================================
       Editor Events
    =========================================== */

    editor.addEventListener("keyup", function () {
        updateRichEditorToolbar(container);
    });

    editor.addEventListener("mouseup", function () {
        updateRichEditorToolbar(container);
    });

    editor.addEventListener("input", function () {
        updateRichEditorToolbar(container);
    });

}


/* ==========================================================
   Toolbar Active State
   ========================================================== */

function updateRichEditorToolbar(container) {

    container
        .querySelectorAll(".toolbar button")
        .forEach(button => {

            const command = button.dataset.command;

            try {

                if (document.queryCommandState(command)) {

                    button.classList.add("active");

                } else {

                    button.classList.remove("active");

                }

            } catch (e) {

                // Some commands don't support queryCommandState

            }

        });

}