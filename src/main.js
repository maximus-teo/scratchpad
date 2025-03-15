/* ADD NOTES HERE:

*/

function getComputedStyleProperty(element, propertyName) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(element, null)[propertyName];
    } else if (element.currentStyle) {
        return element.currentStyle[propertyName];
    }
}

function getContainerAndSelection() {
    var containerElement, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            containerElement = sel.getRangeAt(0).commonAncestorContainer;
            // Make sure we have an element rather than a text node
            if (containerElement.nodeType === 3) {
                containerElement = containerElement.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type !== "Control") {
        containerElement = sel.createRange().parentElement();
    }

    return [containerElement, sel];
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const editor = document.getElementById('editor');
    const btnBold = document.getElementById('btn_bold');
    const btnItalic = document.getElementById('btn_italic');
    const btnUnderline = document.getElementById('btn_underline');
    const selectSize = document.getElementById('select_size');
    const selectFont = document.getElementById('select_font');

    let isBold = false;
    let isItalic = false;
    let isUnderline = false;

    // wrap selected text with all necessary tags (alphabetical order), then insert as HTML
    function modifySelectedText(sel, fontFamily, fontSize){
        var newSel = sel.toString().trim();
        if (newSel.includes('\&nbsp;')) newSel = newSel.replace('\&nbsp;', '');

        wrappedsel = "<span style='text-decoration-thickness: auto; " +
            ((fontSize !== null) ? ("font-size: " + fontSize + "; ") : "") + // headings
            ((fontFamily !== null) ? ("font-family: " + fontFamily + "; ") : "") + // font name
            (isBold ? "font-weight: bold; " : "") + // bold
            (isItalic ? "font-style: italic; " : "") + // italic
            (isUnderline ? "text-decoration: underline; " : "") + // underline
                "'>" + newSel + "</span>";

        document.execCommand('insertHTML', false, wrappedsel);
    }

    btnBold.addEventListener('click', () => {
        isBold = !isBold;
        updateButtonColor();
        document.execCommand('bold', false, null);
    });

    btnItalic.addEventListener('click', () => {
        isItalic = !isItalic;
        updateButtonColor();
        document.execCommand('italic', false, null);
    });

    btnUnderline.addEventListener('click', () => {
        isUnderline = !isUnderline;
        updateButtonColor();
        document.execCommand('underline', false, null);
        //alert(editor.innerHTML);
    });

    // SELECT TEXT SIZE
    selectSize.addEventListener('change', () => {
        var containerElement = getContainerAndSelection()[0];
        var sel = getContainerAndSelection()[1];
        if (containerElement) {
            fontFamily = getComputedStyleProperty(containerElement, 'font-family');
            fontSize = selectSize.value;
            modifySelectedText(sel, fontFamily, fontSize);

            //alert(editor.innerHTML);
        }
    });

    // SELECT TEXT FONT
    selectFont.addEventListener('change', () => {
        var containerElement = getContainerAndSelection()[0];
        var sel = getContainerAndSelection()[1];
        if (containerElement) {
            fontFamily = selectFont.value;
            fontSize = getComputedStyleProperty(containerElement, 'font-size');
            modifySelectedText(sel, fontFamily, fontSize);

            //alert(editor.innerHTML);
        }
    });
    
    //update button states based on editor selection
    editor.addEventListener('click', () => {
        let status = checkSelectedText();
        isBold = status.includes('bold');
        isItalic = status.includes('italic');
        isUnderline = status.includes('underline');

        if (status.isEmpty()) {isBold = false; isItalic = false; isUnderline = false; }

        updateButtonColor();
    });

    function checkSelectedText() {
        let status = [];

        if (document.queryCommandState('bold')) {
            isBold = true;
            status.push('bold');
        } else isBold = false;
        
        if (document.queryCommandState('italic')) {
            isItalic = true;
            status.push('italic');
        } else isItalic = false;

        if (document.queryCommandState('underline')) {
            isUnderline = true;
            status.push('underline');
        } else isUnderline = false;

        updateButtonColor();

        return status;
    }

    //toggle button states
    function updateButtonColor() {
        editor.focus();
        btnBold.style.backgroundColor = isBold ? '#373737' : '#141414';
        btnItalic.style.backgroundColor = isItalic ? '#373737' : '#141414';
        btnUnderline.style.backgroundColor = isUnderline ? '#373737' : '#141414';
    }


});

/*
function changeStyle(element) {
    document.getElementById('editor').focus();
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var selectedText = selection.toString();

        if (selectedText) {
            var span = document.createElement('span');
            span.className = element.value;
            span.textContent = selectedText;

            range.deleteContents();
            range.insertNode(span);
        }
    }
}
*/