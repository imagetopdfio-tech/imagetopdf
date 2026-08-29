/* =========================================
   ImageToPDF.io
   Image → PDF Converter
========================================= */

let selectedFiles = [];


const fileInput =
    document.getElementById("fileInput");

const fileList =
    document.getElementById("fileList");

const convertBtn =
    document.getElementById("convertBtn");

const dropZone =
    document.getElementById("dropZone");


/* =========================================
   FILE SELECTION
========================================= */

fileInput.addEventListener("change", function () {

    addFiles(Array.from(this.files));

});


function addFiles(files) {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const validFiles = files.filter(file =>
        allowedTypes.includes(file.type)
    );

    selectedFiles = [
        ...selectedFiles,
        ...validFiles
    ];

    renderFiles();

}


/* =========================================
   DISPLAY FILES
========================================= */

function renderFiles() {

    fileList.innerHTML = "";

    selectedFiles.forEach((file, index) => {

        const item =
            document.createElement("div");

        item.className = "file-item";


        const image =
            document.createElement("img");

        image.src =
            URL.createObjectURL(file);


        const name =
            document.createElement("div");

        name.className = "file-name";

        name.textContent = file.name;


        const remove =
            document.createElement("button");

        remove.className = "remove-btn";

        remove.innerHTML = "×";

        remove.setAttribute(
            "aria-label",
            "Remove image"
        );


        remove.onclick = function () {

            selectedFiles.splice(index, 1);

            renderFiles();

        };


        item.appendChild(image);

        item.appendChild(name);

        item.appendChild(remove);

        fileList.appendChild(item);

    });


    convertBtn.disabled =
        selectedFiles.length === 0;

}


/* =========================================
   DRAG & DROP
========================================= */

dropZone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        dropZone.classList.add("drag");

    }
);


dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove("drag");

    }
);


dropZone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        dropZone.classList.remove("drag");

        addFiles(
            Array.from(
                event.dataTransfer.files
            )
        );

    }
);


/* =========================================
   IMAGE → PDF
========================================= */

async function createPDF() {

    if (!selectedFiles.length) {
        return;
    }


    convertBtn.disabled = true;

    convertBtn.textContent =
        "Creating PDF...";


    try {

        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );


        const pageWidth = 210;

        const pageHeight = 297;

        const margin = 10;


        for (
            let i = 0;
            i < selectedFiles.length;
            i++
        ) {

            const file =
                selectedFiles[i];


            const dataURL =
                await readFile(file);


            const image =
                new Image();


            image.src = dataURL;


            await new Promise(
                resolve => {

                    image.onload =
                        resolve;

                }
            );


            let width =
                image.width;

            let height =
                image.height;


            const maxWidth =
                pageWidth -
                margin * 2;

            const maxHeight =
                pageHeight -
                margin * 2;


            const ratio =
                Math.min(
                    maxWidth / width,
                    maxHeight / height
                );


            width *= ratio;

            height *= ratio;


            const x =
                (pageWidth - width) / 2;

            const y =
                (pageHeight - height) / 2;


            if (i > 0) {

                pdf.addPage();

            }


            let format = "JPEG";


            if (
                file.type ===
                "image/png"
            ) {

                format = "PNG";

            }


            pdf.addImage(
                dataURL,
                format,
                x,
                y,
                width,
                height
            );

        }


        pdf.save(
            "ImageToPDF.pdf"
        );


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while creating the PDF. Please try again."
        );

    }


    convertBtn.disabled = false;

    convertBtn.textContent =
        "Convert to PDF";

}


/* =========================================
   READ IMAGE
========================================= */

function readFile(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => resolve(
                    reader.result
                );


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(page);


    if (target) {

        target.classList.add(
            "active"
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    const nav =
        document.getElementById(
            "navMenu"
        );


    nav.classList.remove(
        "show"
    );

}


/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

    document
        .getElementById("navMenu")
        .classList.toggle("show");

}


/* =========================================
   DARK MODE
========================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const mode =
        document.body.classList.contains(
            "dark"
        )
        ? "dark"
        : "light";


    localStorage.setItem(
        "theme",
        mode
    );

}


if (
    localStorage.getItem(
        "theme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );

}