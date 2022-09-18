document.addEventListener("DOMContentLoaded", function () {
    var codeMode = false;

    function palette(palletteType) {
        var html = '<div class="' + palletteType + '-palette">';
        var colorPalette = [
            '000000',  '008e00','011892', '521b92',
            '555555', '9437ff', 'ff40ff',  '00fcff', 
            'aaaaaa', '941100', 'fefb00', '00f900',
            'FFFFFF',  'ff2600','ff9300', '009192'
            
        ]; 
        
        colorPalette.map((color) => {
            html += '<a href="#" class="palette-item" data-command="'
                + palletteType + 'color" data-value="#' + color + '" '
                + 'style="background-color: #' + color + '"></a>';
        });        
        html += '</div>';

        console.log(html);
            
        return html;
	}	

    function addTextarea(startingHtml) {
        var html =
            '<div class="toolbar">' +
            '<a href="#" data-command="undo" class="groupStart"><i class="fa-solid fa-undo"></i></a>' +
            '<a href="#" data-command="redo" class="groupEnd"><i class="fa-solid fa-repeat"></i></a>' +

            '<div class="fore-wrapper">' +
            	'<i class="fa-solid fa-font" style="color: #ff6666;"></i>' +
            		palette("fore") +
            '</div>' +
            '<div class="back-wrapper">' +
            	'<i class="fa-solid fa-font" style="background: #ff6666"></i>' +
            	    palette("back") +
            '</div>' +
            '<a href="#" data-command="bold" class="groupStart"><i class="fa-solid fa-bold"></i></a>' +
            '<a href="#" data-command="italic"><i class="fa-solid fa-italic"></i></a>' +
            '<a href="#" data-command="underline"><i class="fa-solid fa-underline"></i></a>' +
            '<a href="#" data-command="strikeThrough" class="groupEnd"><i class="fa-solid fa-strikethrough"></i></a>' +

            '<a href="#" data-command="justifyLeft" class="groupStart"><i class="fa-solid fa-align-left"></i></a>' +
            '<a href="#" data-command="justifyCenter"><i class="fa-solid fa-align-center"></i></a>' +
            '<a href="#" data-command="justifyRight"><i class="fa-solid fa-align-right"></i></a>' +
            '<a href="#" data-command="justifyFull" class="groupEnd"><i class="fa-solid fa-align-justify"></i></a>' +

            '<a href="#" data-command="indent" class="groupStart"><i class="fa-solid fa-indent"></i></a>' +
            '<a href="#" data-command="outdent class="groupEnd"><i class="fa-solid fa-outdent"></i></a>' +

            '<a href="#" data-command="insertUnorderedList" class="groupStart"><i class="fa-solid fa-list-ul"></i></a>' +
            '<a href="#" data-command="insertOrderedList" class="groupEnd"><i class="fa-solid fa-list-ol"></i></a>' +

            '<a href="#" data-command="h1" class="groupStart"><i class="fa-solid fa-h"></i><i style="padding-left: 5px" class="fa-solid fa-1"></i></a>' +
            '<a href="#" data-command="h2" class="groupEnd"><i class="fa-solid fa-h"></i><i style="padding-left: 5px" class="fa-solid fa-2"></i></a>' +

            '<a href="#" data-command="createlink" class="groupStart"><i class="fa-solid fa-link"></i></a>' +
            '<a href="#" data-command="unlink"><i class="fa-solid fa-unlink"></i></a>' +
            '<a href="#" data-command="p" class="groupEnd"><i class="fa-solid fa-p"></i></a>' +

            '<a href="#" data-command="subscript" class="groupStart"><i class="fa-solid fa-subscript"></i></a>' +
            '<a href="#" data-command="superscript" class="groupEnd"><i class="fa-solid fa-superscript"></i></a>' +

            '<a href="#" data-command="code" class="groupSingle" id="code"><i class="fa-solid fa-code"></i></a>' +
            '</div>' +
            '<div id="editor" contenteditable="true"></div>' +
            '<textarea class="code hide" id="editor-code">' + startingHtml + '</textarea>';
        return html;
    }

    function codeClicked(codeMode) {
        if (codeMode) {
            console.log("start code mode");
            // go from WYSIWYG Editing to code mode
            var code = document.getElementById("editor").innerHTML;
            document.getElementById("editor-code").value = code;
        } else {
            console.log("start wysiwyg mode");
            // go from code mode to WYSIWYG Editing
            var htmlCode = document.getElementById("editor-code").value;
            document.getElementById("editor").innerHTML = htmlCode;
        }

        // style buttons
        var toolbarA = document.querySelectorAll(".toolbar a");
        toolbarA.forEach(function (item) {
            if (item.id != "code") {
                if (codeMode) {
                    item.classList.add("disabled");
                } else {
                    item.classList.remove("disabled");
                }
            }
        })
        if (codeMode) {
            document.getElementById("editor").classList.add("hide");
            document.getElementById("editor-code").classList.remove("hide");

            document.querySelector(".fore-wrapper").classList.add("disabled");
            document.querySelector(".back-wrapper").classList.add("disabled");

        } else {
            document.getElementById("editor").classList.remove("hide");
            document.getElementById("editor-code").classList.add("hide");

            document.querySelector(".fore-wrapper").classList.remove("disabled");
            document.querySelector(".back-wrapper").classList.remove("disabled");
        }
    }

    var textarea = document.querySelectorAll("div.textarea-html-editor");
    textarea.forEach(function (item) {
        var startingHtml = item.innerHTML;
        item.innerHTML = addTextarea(startingHtml);
    });

    var toolbarA = document.querySelectorAll(".toolbar a");
    toolbarA.forEach(function (item) {
        item.addEventListener("click", function (event) {
            var command = item.getAttribute("data-command");

            console.log("command is " + command);
            event.preventDefault();

            if (command == 'h1' || command == 'h2' || command == 'p') {
                document.execCommand('formatBlock', false, command);
            }

            if (command == 'forecolor' || command == 'backcolor') {
                var value = item.getAttribute("data-value");
                document.designMode = 'on';
                document.execCommand('stylewithCSS', false, true);
                document.execCommand(command, false, value);
                document.designMode = 'off';
            }

            if (command == 'createlink' || command == 'insertimage') {
                var url = prompt('Enter the link here: ', 'https:\/\/');
                document.execCommand(command, false, url);
            } else if (command == "code") {
                codeMode = !codeMode;
                console.log("code mode is " + codeMode);
                codeClicked(codeMode);
            } else {
                console.log("document execCommand " + command);
                document.execCommand(command, false, null);
            }
        });
    });

    codeClicked(codeMode);
});

