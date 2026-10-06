// ============================================================
// APPLICATION STATE
// ============================================================

let appState = {

    tender: null,

    requirements: [],

    files: []

};


// ============================================================
// CONSTANTS
// ============================================================

const MAX_FILES = 30;

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB


// ============================================================
// DOM ELEMENTS
// ============================================================

const requirementsFile =
    document.getElementById("requirementsFile");

const pdfFilesInput =
    document.getElementById("pdfFiles");


// ============================================================
// REQUIREMENTS JSON
// ============================================================

requirementsFile.addEventListener(
    "change",
    handleRequirementsFile
);


async function handleRequirementsFile(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const message =
        document.getElementById(
            "requirementsMessage"
        );


    try {

        // ----------------------------------------------------
        // Read JSON file
        // ----------------------------------------------------

        const text = await file.text();


        // ----------------------------------------------------
        // Parse JSON
        // ----------------------------------------------------

        const data = JSON.parse(text);


        // ----------------------------------------------------
        // Validate structure
        // ----------------------------------------------------

        validateRequirementsData(data);


        // ----------------------------------------------------
        // Sort requirements by order
        // ----------------------------------------------------

        const sortedRequirements =
            [...data.requirements].sort(
                (a, b) => a.order - b.order
            );


        // ----------------------------------------------------
        // Store in application state
        // ----------------------------------------------------

        appState.tender = data.tender;

        appState.requirements =
            sortedRequirements;


        // ----------------------------------------------------
        // Render information
        // ----------------------------------------------------

        renderTenderInformation();

        renderRequirements();


        // ----------------------------------------------------
        // Success message
        // ----------------------------------------------------

        message.textContent =
            "Requirements loaded successfully.";

        message.style.color = "green";


    } catch (error) {

        console.error(error);


        message.textContent =
            "Invalid requirements.json file.";

        message.style.color = "red";


        // Reset state

        appState.tender = null;

        appState.requirements = [];


        document.getElementById(
            "tenderSection"
        ).hidden = true;


        document.getElementById(
            "requirementsSection"
        ).hidden = true;

    }


    // Allow selecting the same file again

    event.target.value = "";

}


// ============================================================
// REQUIREMENTS VALIDATION
// ============================================================

function validateRequirementsData(data) {


    // --------------------------------------------------------
    // Check main object
    // --------------------------------------------------------

    if (
        !data ||
        typeof data !== "object"
    ) {

        throw new Error(
            "Invalid JSON structure."
        );

    }


    // --------------------------------------------------------
    // Check tender
    // --------------------------------------------------------

    if (
        !data.tender ||
        typeof data.tender !== "object"
    ) {

        throw new Error(
            "Tender information is missing."
        );

    }


    // --------------------------------------------------------
    // Required tender fields
    // --------------------------------------------------------

    const requiredTenderFields = [

        "tender_id",

        "title",

        "procuring_entity",

        "bidder",

        "submission_deadline"

    ];


    for (
        const field
        of requiredTenderFields
    ) {

        if (
            !data.tender[field]
        ) {

            throw new Error(
                `Missing tender field: ${field}`
            );

        }

    }


    // --------------------------------------------------------
    // Check requirements array
    // --------------------------------------------------------

    if (
        !Array.isArray(
            data.requirements
        )
    ) {

        throw new Error(
            "Requirements must be an array."
        );

    }


    // --------------------------------------------------------
    // Validate each requirement
    // --------------------------------------------------------

    for (
        const requirement
        of data.requirements
    ) {


        if (!requirement.id) {

            throw new Error(
                "Requirement ID is missing."
            );

        }


        if (
            typeof requirement.order
            !== "number"
        ) {

            throw new Error(
                "Requirement order must be a number."
            );

        }


        if (!requirement.title_en) {

            throw new Error(
                "English document title is missing."
            );

        }


        if (!requirement.title_bn) {

            throw new Error(
                "Bangla document title is missing."
            );

        }


        if (
            typeof requirement.mandatory
            !== "boolean"
        ) {

            throw new Error(
                "Mandatory field must be boolean."
            );

        }


        if (
            typeof requirement.has_expiry
            !== "boolean"
        ) {

            throw new Error(
                "has_expiry field must be boolean."
            );

        }

    }

}


// ============================================================
// RENDER TENDER INFORMATION
// ============================================================

function renderTenderInformation() {

    const tender =
        appState.tender;


    document.getElementById(
        "tenderId"
    ).textContent =
        tender.tender_id;


    document.getElementById(
        "tenderTitle"
    ).textContent =
        tender.title;


    document.getElementById(
        "procuringEntity"
    ).textContent =
        tender.procuring_entity;


    document.getElementById(
        "bidder"
    ).textContent =
        tender.bidder;


    document.getElementById(
        "deadline"
    ).textContent =
        tender.submission_deadline;


    document.getElementById(
        "tenderSection"
    ).hidden = false;

}


// ============================================================
// RENDER REQUIREMENTS
// ============================================================

function renderRequirements() {

    const tbody =
        document.getElementById(
            "requirementsTableBody"
        );


    tbody.innerHTML = "";


    for (
        const requirement
        of appState.requirements
    ) {


        const row =
            document.createElement("tr");


        // ----------------------------------------------------
        // Order
        // ----------------------------------------------------

        const orderCell =
            document.createElement("td");

        orderCell.textContent =
            requirement.order;


        // ----------------------------------------------------
        // Document title
        // ----------------------------------------------------

        const titleCell =
            document.createElement("td");

        titleCell.textContent =
            requirement.title_en;


        // ----------------------------------------------------
        // Mandatory
        // ----------------------------------------------------

        const mandatoryCell =
            document.createElement("td");

        mandatoryCell.textContent =
            requirement.mandatory
                ? "Yes"
                : "No";


        // ----------------------------------------------------
        // Expiry
        // ----------------------------------------------------

        const expiryCell =
            document.createElement("td");

        expiryCell.textContent =
            requirement.has_expiry
                ? "Yes"
                : "No";


        // ----------------------------------------------------
        // Build row
        // ----------------------------------------------------

        row.appendChild(
            orderCell
        );

        row.appendChild(
            titleCell
        );

        row.appendChild(
            mandatoryCell
        );

        row.appendChild(
            expiryCell
        );


        tbody.appendChild(row);

    }


    document.getElementById(
        "requirementsSection"
    ).hidden = false;

}


// ============================================================
// PDF UPLOAD
// ============================================================

pdfFilesInput.addEventListener(
    "change",
    handlePdfFiles
);


async function handlePdfFiles(event) {

    const selectedFiles =
        Array.from(
            event.target.files
        );


    if (
        selectedFiles.length === 0
    ) {

        return;

    }


    const message =
        document.getElementById(
            "uploadMessage"
        );


    // ========================================================
    // FILE COUNT VALIDATION
    // ========================================================

    if (
        appState.files.length +
        selectedFiles.length >
        MAX_FILES
    ) {

        message.textContent =
            "Maximum 30 PDF files are allowed.";

        message.style.color = "red";

        event.target.value = "";

        return;

    }


    // ========================================================
    // TOTAL SIZE VALIDATION
    // ========================================================

    const currentSize =
        appState.files.reduce(
            (total, item) =>
                total + item.file.size,
            0
        );


    const newSize =
        selectedFiles.reduce(
            (total, file) =>
                total + file.size,
            0
        );


    if (
        currentSize + newSize >
        MAX_TOTAL_SIZE
    ) {

        message.textContent =
            "Total file size cannot exceed 50 MB.";

        message.style.color = "red";

        event.target.value = "";

        return;

    }


    // ========================================================
    // PROCESS EACH FILE
    // ========================================================

    for (
        const file
        of selectedFiles
    ) {


        // ----------------------------------------------------
        // PDF validation
        // ----------------------------------------------------

        const isPdf =
            file.type === "application/pdf" ||
            file.name
                .toLowerCase()
                .endsWith(".pdf");


        if (!isPdf) {

            showUploadError(
                `${file.name}: Only PDF files are allowed.`
            );

            continue;

        }


        try {

            // ------------------------------------------------
            // Read PDF
            // ------------------------------------------------

            const arrayBuffer =
                await file.arrayBuffer();


            // ------------------------------------------------
            // Load PDF with PDF.js
            // ------------------------------------------------

            const pdf =
                await pdfjsLib.getDocument({
                    data: arrayBuffer
                }).promise;


            // ------------------------------------------------
            // Page count
            // ------------------------------------------------

            const pageCount =
                pdf.numPages;


            // ------------------------------------------------
            // Store file
            // ------------------------------------------------

            appState.files.push({

                id: crypto.randomUUID(),

                file: file,

                name: file.name,

                size: file.size,

                pages: pageCount,

                matchedRequirementId: null,

                expiryDate: null

            });


        } catch (error) {

            console.error(error);


            showUploadError(
                `${file.name}: Unable to read this PDF.`
            );

        }

    }


    // ========================================================
    // UPDATE TABLE
    // ========================================================

    renderUploadedFiles();


    // ========================================================
    // SUCCESS MESSAGE
    // ========================================================

    if (
        appState.files.length > 0
    ) {

        message.textContent =
            "Files processed successfully.";

        message.style.color = "green";

    }


    // ========================================================
    // RESET INPUT
    // ========================================================

    event.target.value = "";

}


// ============================================================
// UPLOAD ERROR
// ============================================================

function showUploadError(message) {

    const uploadMessage =
        document.getElementById(
            "uploadMessage"
        );


    uploadMessage.textContent =
        message;


    uploadMessage.style.color =
        "red";

}


// ============================================================
// RENDER UPLOADED FILES
// ============================================================

function renderUploadedFiles() {

    const tbody =
        document.getElementById(
            "filesTableBody"
        );


    tbody.innerHTML = "";


    for (
        const item
        of appState.files
    ) {


        const row =
            document.createElement("tr");


        // ----------------------------------------------------
        // File name
        // ----------------------------------------------------

        const nameCell =
            document.createElement("td");

        nameCell.textContent =
            item.name;


        // ----------------------------------------------------
        // Page count
        // ----------------------------------------------------

        const pagesCell =
            document.createElement("td");

        pagesCell.textContent =
            item.pages;


        // ----------------------------------------------------
        // File size
        // ----------------------------------------------------

        const sizeCell =
            document.createElement("td");

        sizeCell.textContent =
            formatFileSize(
                item.size
            );


        // ----------------------------------------------------
        // Action
        // ----------------------------------------------------

        const actionCell =
            document.createElement("td");


        const removeButton =
            document.createElement("button");


        removeButton.textContent =
            "Remove";


        removeButton.addEventListener(
            "click",
            () =>
                removeUploadedFile(
                    item.id
                )
        );


        actionCell.appendChild(
            removeButton
        );


        // ----------------------------------------------------
        // Build row
        // ----------------------------------------------------

        row.appendChild(
            nameCell
        );

        row.appendChild(
            pagesCell
        );

        row.appendChild(
            sizeCell
        );

        row.appendChild(
            actionCell
        );


        tbody.appendChild(row);

    }

}


// ============================================================
// REMOVE UPLOADED FILE
// ============================================================

function removeUploadedFile(fileId) {

    appState.files =
        appState.files.filter(
            item =>
                item.id !== fileId
        );


    renderUploadedFiles();


    const message =
        document.getElementById(
            "uploadMessage"
        );


    message.textContent =
        "File removed.";

    message.style.color =
        "green";

}


// ============================================================
// FORMAT FILE SIZE
// ============================================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }


    if (
        bytes <
        1024 * 1024
    ) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }


    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(2)} MB`;

}