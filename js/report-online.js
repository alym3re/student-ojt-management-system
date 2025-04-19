import { firebaseCRUD } from "./firebase-crud.js";

// DOM elements
const reportsContainer = document.getElementById("reports-container");
const reportSearchInput = document.getElementById("report-search-input");
const viewReportModal = document.getElementById("viewReportModal");
const reportTitleInput = document.getElementById("report-title");
const reportContentTextarea = document.getElementById("report-content");
const reportImagesContainer = document.querySelector(
  ".report-images .image-container"
);

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  try {
    showLoading(true);
    await displayReports();
    setupEventListeners();
    setupDateSearch(); // Add this line
  } catch (error) {
    console.error("Initialization error:", error);
    showError("Failed to load reports. Please try again later.");
  } finally {
    showLoading(false);
  }

  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    await window.dbReady;

    const img = document.getElementById("user-img");

    const dataArray = await crudOperations.getByIndex(
      "studentInfoTbl",
      "userId",
      userId
    );

    console.log("User data from IndexedDB:", dataArray);

    const data = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    if (data != null) {
      img.src = data.userImg;
    } else {
      console.warn("No user data found for this user.");
    }
  } catch (err) {
    console.error("Failed to get user data from IndexedDB", err);
  }
});

// Display all reports from Firebase
async function displayReports(filterDate = null) {
  try {
    showLoading(true);

    // Get the current user ID
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Query reports for this user
    let reports = await firebaseCRUD.queryData(
      "reports",
      "userId",
      "==",
      userId
    );

    if (filterDate) {
      // Convert filterDate to Date object for comparison
      const searchDate = new Date(filterDate);

      reports = reports.filter((report) => {
        // Handle both Timestamp and string formats
        let reportDate;
        if (
          report.createdAt &&
          typeof report.createdAt === "object" &&
          report.createdAt.toDate
        ) {
          // Firebase Timestamp object
          reportDate = report.createdAt.toDate();
        } else if (typeof report.createdAt === "string") {
          // ISO string
          reportDate = new Date(report.createdAt);
        } else {
          // Unknown format, skip this report
          return false;
        }

        // Compare dates using locale string (ignores time)
        return (
          reportDate.toLocaleDateString() === searchDate.toLocaleDateString()
        );
      });
    }

    // Sort by date (newest first)
    reports.sort((a, b) => {
      const dateA =
        a.createdAt && typeof a.createdAt === "object" && a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
      const dateB =
        b.createdAt && typeof b.createdAt === "object" && b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
      return dateB - dateA;
    });

    if (reports.length === 0) {
      reportsContainer.innerHTML = `
            <div class="position-absolute top-50 start-50 translate-middle align-items-center col-12 text-center py-4">
                <i class="bi bi-exclamation-circle fs-1 text-muted"></i>
                <h6 class="mt-2">No Reports Found</h6>
                <p class="mt-1">You currently don't have any report.</p>
            </div>
        `;
      return;
    }

    // Create report cards
    for (const report of reports) {
      const reportCard = await createReportCard(report);
      reportsContainer.appendChild(reportCard);
    }
  } catch (error) {
    console.error("Error displaying reports:", error);
    showError("Failed to load reports. Please try again later.");
    throw error;
  } finally {
    showLoading(false);
  }
}
// Create a report card element
async function createReportCard(report) {
  const reportDate = new Date(report.createdAt);
  const formattedDate = reportDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const card = document.createElement("a");
  card.href = "#";
  card.className = "report-card mb-2";
  card.dataset.id = report.id;
  card.dataset.bsToggle = "modal";
  card.dataset.bsTarget = "#viewReportModal";

  // Check if report has images
  let hasImages = false;
  try {
    const images = await firebaseCRUD.getAllData(`reports/${report.id}/images`);
    hasImages = images.length > 0;
  } catch (error) {
    console.error("Error checking for images:", error);
  }

  card.innerHTML = `
    <span id="title" class="text-truncate" style="width: calc(100% - 10px);">${
      report.title || "Untitled Report"
    }</span>
    <span id="separator"></span>
    <div class="report-content-container">
        <p class="text-truncate m-0" style="width: calc(100% - 40px);">${
          report.content || "No content"
        }</p>
        <p id="date" class="mt-2 text-end">${formattedDate}</p>
    </div>
  `;

  // Add click event to show report details
  card.addEventListener("click", async () => {
    await showReportDetails(report);
  });

  return card;
}

// Show report details in modal
async function showReportDetails(report) {
  const reportDate = new Date(report.createdAt);
  const formattedDate = reportDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  reportTitleInput.value = report.title || "Untitled Report";
  reportContentTextarea.value = `${
    report.content || ""
  }\n\nSubmitted on: ${formattedDate}`;

  // Clear previous images
  reportImagesContainer.innerHTML = "";

  try {
    // Fetch all image documents from the subcollection
    const imageDocs = await firebaseCRUD.getAllData(
      `reports/${report.id}/images`
    );

    if (imageDocs.length > 0) {
      imageDocs.forEach((imageDoc) => {
        // Access the imageData field from each document
        if (imageDoc.imageData) {
          const imgWrapper = document.createElement("div");
          imgWrapper.className = "image-wrapper";
          imgWrapper.style.position = "relative";
          imgWrapper.style.display = "inline-block";
          imgWrapper.style.marginRight = "10px";

          const img = document.createElement("img");
          img.src = imageDoc.imageData;
          img.alt = "Report image";
          img.style.maxWidth = "100px";
          img.style.maxHeight = "100px";
          img.style.cursor = "pointer";
          img.style.objectFit = "cover";
          img.style.borderRadius = "5px";

          // Add click to view in modal functionality
          img.addEventListener("click", () => {
            showImageInModal(imageDoc.imageData);
          });

          // Optional: Add zoom icon overlay
          const zoomIcon = document.createElement("i");
          zoomIcon.className = "bi bi-zoom-in";
          zoomIcon.style.position = "absolute";
          zoomIcon.style.bottom = "5px";
          zoomIcon.style.right = "5px";
          zoomIcon.style.color = "white";
          zoomIcon.style.textShadow = "0 0 3px rgba(0,0,0,0.5)";
          zoomIcon.style.pointerEvents = "none";

          imgWrapper.appendChild(img);
          imgWrapper.appendChild(zoomIcon);
          reportImagesContainer.appendChild(imgWrapper);
        }
      });
    } else {
      const noImage = document.createElement("p");
      noImage.textContent = "No images attached";
      noImage.className = "text-white";
      reportImagesContainer.appendChild(noImage);
    }
  } catch (error) {
    console.error("Error loading images:", error);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Error loading images";
    errorMsg.className = "text-white";
    reportImagesContainer.appendChild(errorMsg);
  }
}

// Function to show image in modal
function showImageInModal(imageSrc) {
  const modalImageView = document.getElementById("modal-image-view");
  const viewImageModal = new bootstrap.Modal(
    document.getElementById("viewImageModal")
  );

  modalImageView.src = imageSrc;
  viewImageModal.show();
}

// Setup event listeners
function setupEventListeners() {
  // Refresh button
  const refreshBtn = document.getElementById("refresh-reports-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      reportSearchInput.value = "";
      displayReports();
    });
  }
}
function showLoading(show) {
  const loader = document.getElementById("loading-indicator") || createLoader();
  loader.style.display = show ? "block" : "none";
}

function createLoader() {
  const loader = document.createElement("div");
  loader.id = "loading-indicator";
  loader.className = "text-center py-4";
  loader.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  document.querySelector(".card-container").prepend(loader);
  return loader;
}

function showError(message) {
  const container = document.querySelector(".card-container");
  container.innerHTML = `
    <div class="col-12 text-center py-4">
        <i class="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
        <p class="mt-2">${message}</p>
        <button class="btn btn-primary mt-2" onclick="location.reload()">Retry</button>
    </div>
  `;
}

// ========================
// FIREBASE DATE SEARCH FUNCTIONALITY
// ========================
function setupDateSearch() {
  const dateInput = document.getElementById("report-search-input");
  if (dateInput) {
    dateInput.addEventListener("change", function (e) {
      filterReportsByDate(e.target.value);
    });
  }
}

async function filterReportsByDate(selectedDate) {
  try {
    showLoading(true);

    // Get the current user ID
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Clear the current reports display
    reportsContainer.innerHTML = "";

    if (!selectedDate) {
      // If no date selected, display all reports
      await displayReports();
      return;
    }

    // Query reports for this user
    let reports = await firebaseCRUD.queryData(
      "reports",
      "userId",
      "==",
      userId
    );

    // Convert selectedDate to Date object for comparison
    const searchDate = new Date(selectedDate);

    // Filter reports by date
    const filteredReports = reports.filter((report) => {
      // Handle both Timestamp and string formats
      let reportDate;
      if (
        report.createdAt &&
        typeof report.createdAt === "object" &&
        report.createdAt.toDate
      ) {
        // Firebase Timestamp object
        reportDate = report.createdAt.toDate();
      } else if (typeof report.createdAt === "string") {
        // ISO string
        reportDate = new Date(report.createdAt);
      } else {
        // Unknown format, skip this report
        return false;
      }

      // Compare dates (year, month, day only)
      return (
        reportDate.getFullYear() === searchDate.getFullYear() &&
        reportDate.getMonth() === searchDate.getMonth() &&
        reportDate.getDate() === searchDate.getDate()
      );
    });

    if (filteredReports.length === 0) {
      reportsContainer.innerHTML = `
        <div class="position-absolute top-50 start-50 translate-middle align-items-center col-12 text-center py-4">
          <i class="bi bi-exclamation-circle fs-1 text-muted"></i>
          <h6 class="mt-2">No Reports Found For This Date</h6>
          <p class="mt-1">Please choose a different date or create a new report.</p>
        </div>
      `;
      return;
    }

    // Sort by date (newest first)
    filteredReports.sort((a, b) => {
      const dateA =
        a.createdAt && typeof a.createdAt === "object" && a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
      const dateB =
        b.createdAt && typeof b.createdAt === "object" && b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
      return dateB - dateA;
    });

    // Display the filtered reports
    for (const report of filteredReports) {
      const reportCard = await createReportCard(report);
      reportsContainer.appendChild(reportCard);
    }
  } catch (error) {
    console.error("Error filtering reports by date:", error);
    showError("Failed to filter reports. Please try again later.");
  } finally {
    showLoading(false);
  }
}

// Export functions if needed
export { displayReports, showReportDetails };
