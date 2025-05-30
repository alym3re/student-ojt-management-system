const cardContainer = document.querySelector(".card-container");
const searchInput = document.getElementById("companySearch");

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    await window.dbReady;

    const img = document.getElementById("user-profile");
    const dataArray = await crudOperations.getByIndex(
      "studentInfoTbl",
      "userId",
      userId
    );
    const data = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    if (data != null) {
      img.src = data.userImg
        ? data.userImg
        : "../assets/img/icons8_male_user_480px_1";
    }

    await loadOJTKits();

    setupEventListeners();
  } catch (err) {
    console.error("Failed to initialize page:", err);
  }
});

async function loadOJTKits(kits = null) {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    cardContainer.innerHTML =
      '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';

    if (!kits) {
      const { firebaseCRUD } = await import("./firebase-crud.js");
      kits = await firebaseCRUD.getAllData("ojtKits");
    }

    const completedKits = await getCompletedKits(userId);

    cardContainer.innerHTML = "";

    if (!kits || kits.length === 0) {
      cardContainer.innerHTML = `
                <div class="position-absolute top-50 start-50 translate-middle col-12 text-center py-4">
                    <i class="bi bi-exclamation-circle fs-1 text-muted"></i>
                    <h6 class="mt-2">No OJT Kits Available</h6>
                    <p class="mt-1">No OJT Kits have been added yet.</p>
                </div>
            `;
      return;
    }

    const container = document.createElement("div");
    container.className = "ojt-kits-container";

    kits.forEach((kit) => {
      const isCompleted = completedKits.includes(kit.id);

      const card = document.createElement("div");
      card.className = `ojt-kit-card ${isCompleted ? "completed" : ""}`;

      card.innerHTML = `
                <div class="ojt-kit-icon">
                    <i class="${getIconForKit(kit.title)}"></i>
                </div>
                <div class="ojt-kit-title">${kit.title || "No title"}</div>
                ${
                  isCompleted
                    ? '<div class="completed-badge"><i class="bi bi-check-circle-fill"></i></div>'
                    : ""
                }
            `;

      card.addEventListener("click", () => showKitDetails(kit, isCompleted));
      container.appendChild(card);
    });

    cardContainer.appendChild(container);
  } catch (error) {
    console.error("Error loading OJT Kits:", error);
    cardContainer.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 50vh;">
                <div class="text-center">
                    <i class="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
                    <p class="mt-3 fs-5">Error loading OJT Kits: ${error.message}</p>
                    <button class="btn btn-primary mt-3" onclick="loadOJTKits()">Retry</button>
                </div>
            </div>
        `;
  }
}

function getIconForKit(title) {
  if (!title) return "bi bi-file-earmark-text";

  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("medical")) return "bi bi-file-medical";
  if (lowerTitle.includes("waiver")) return "bi bi-file-earmark-text";
  if (lowerTitle.includes("payment")) return "bi bi-cash-coin";
  return "bi bi-file-earmark-text";
}

async function getCompletedKits(userId) {
  try {
    const { firebaseCRUD } = await import("./firebase-crud.js");
    const reports = await firebaseCRUD.getAllData("ojtkits_2");

    const completedKits = reports
      .filter((report) => report.userId === userId && report.ojtKitId)
      .map((report) => report.ojtKitId);

    return [...new Set(completedKits)];
  } catch (error) {
    console.error("Error fetching completed kits:", error);
    return [];
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function showKitDetails(kit, isCompleted = false) {
  showLoading(true);
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");

    const { firebaseCRUD } = await import("./firebase-crud.js");
    const reports = await firebaseCRUD.getAllData("ojtkits_2");
    const existingReport = reports.find(
      (report) => report.userId === userId && report.ojtKitId === kit.id
    );

    let modal;

    if (existingReport) {
      modal = document.getElementById("updateReportModal");
      const existingImages = await firebaseCRUD.getAllData(
        `ojtkits_2/${existingReport.id}/images`
      );

      modal.dataset.existingImages = JSON.stringify(existingImages);
      modal.dataset.reportId = existingReport.id;
      modal.dataset.viewingKit = JSON.stringify(kit);

      document.getElementById("update-ojt-kit-content").value =
        existingReport.content || "";

      const imageContainer = document.getElementById("update-image-container");
      imageContainer.innerHTML = "";

      existingImages.forEach((image, index) => {
        const wrapper = document.createElement("div");
        wrapper.className =
          "image-thumbnail-wrapper d-inline-block position-relative";
        wrapper.style.width = "100px";
        wrapper.style.height = "100px";
        wrapper.style.marginRight = "10px";
        wrapper.dataset.imageIndex = index;

        const img = document.createElement("img");
        img.src = image.image;
        img.className = "h-100 w-100 object-fit-cover";
        img.style.borderRadius = "5px";

        const deleteBtn = document.createElement("button");
        deleteBtn.className =
          "btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-1";
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        deleteBtn.onclick = (e) => {
          e.preventDefault();
          wrapper.style.opacity = "0.5";
          wrapper.dataset.toDelete = "true";
          deleteBtn.style.display = "none";
        };

        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);
        imageContainer.appendChild(wrapper);
      });
    } else {
      modal = document.getElementById("addReportModal");

      const contentField = modal.querySelector("#ojt-kit-content");
      if (contentField) {
        contentField.value = kit.content || "";
        contentField.readOnly = true;
      }
    }

    if (!modal) {
      throw new Error("Modal element not found");
    }

    modal.dataset.viewingKit = JSON.stringify(kit);

    let titleDisplay = modal.querySelector("#ojt-kit-title-display");
    if (!titleDisplay) {
      titleDisplay = document.createElement("h5");
      titleDisplay.id = "ojt-kit-title-display";
      titleDisplay.className = "text-white mb-3";
      modal
        .querySelector("form")
        .insertBefore(titleDisplay, modal.querySelector("form").firstChild);
    }
    titleDisplay.textContent = kit.title || "OJT Kit Details";

    const titleInput = modal.querySelector("#ojt-kit-title");
    if (titleInput) {
      titleInput.style.display = "none";
      titleInput.value = kit.title || "";
    }

    const imageContainer = modal.querySelector("#add-image-container");
    if (imageContainer) {
      imageContainer.innerHTML = "";

      if (kit.image) {
        const img = document.createElement("img");
        img.src = kit.image;
        img.className = "img-thumbnail";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "200px";
        imageContainer.appendChild(img);
      } else {
        const noImage = document.createElement("div");
        noImage.className =
          "no-image-placeholder d-flex align-items-center justify-content-center";
        noImage.style.width = "100%";
        noImage.style.height = "100%";
        noImage.innerHTML =
          '<i class="bi bi-file-earmark-text fs-1 text-muted"></i>';
        imageContainer.appendChild(noImage);
      }
    }

    const imageUploadControls = modal.querySelector(".report-images");
    if (imageUploadControls) {
      if (existingReport) {
        imageUploadControls.style.display = "flex";
      } else {
        imageUploadControls.style.display = "none";
      }
    }

    const submitButton = modal.querySelector('button[type="submit"]');
    if (submitButton) {
      if (existingReport) {
        submitButton.style.display = "block";
        submitButton.textContent = "Update OJT Kit";
      } else {
        submitButton.style.display = "none";
      }
    }

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  } catch (error) {
    console.error("Error showing kit details:", error);
    Swal.fire({
      icon: "error",
      title: "Something Went Wrong",
      text: "Failed to load OJT Kit details",
      confirmButtonColor: "#590f1c",
    });
  } finally {
    showLoading(false);
  }
}

document
  .getElementById("addReportModal")
  ?.addEventListener("hidden.bs.modal", function () {
    const modal = this;

    const titleDisplay = modal.querySelector("#ojt-kit-title-display");
    if (titleDisplay) titleDisplay.remove();

    const titleInput = modal.querySelector("#ojt-kit-title");
    if (titleInput) {
      titleInput.style.display = "block";
      titleInput.value = "";
    }

    delete modal.dataset.viewingKit;

    const imageContainer = modal.querySelector("#add-image-container");
    if (imageContainer) imageContainer.innerHTML = "";
  });

async function loadOJTKitDataForView(kitId) {
  showLoading(true);
  try {
    const { firebaseCRUD } = await import("./firebase-crud.js");
    const kit = await firebaseCRUD.getDataById("ojtKits", kitId);

    const viewModal = document.getElementById("updateOJTKitModal");
    const titleInput = viewModal.querySelector('[name="ojtKitTitleU"]');
    const contentInput = viewModal.querySelector('[name="ojtKitContentU"]');
    const previewImage = viewModal.querySelector("#update-preview-image");
    const cameraIcon = viewModal.querySelector("#update-camera-icon");

    if (!titleInput || !contentInput || !previewImage || !cameraIcon) {
      throw new Error("Required form elements not found");
    }

    titleInput.value = kit.title || "";
    contentInput.value = kit.content || "";

    if (kit.image) {
      previewImage.src = kit.image;
      previewImage.style.display = "block";
      cameraIcon.style.display = "none";
    } else {
      previewImage.style.display = "none";
      cameraIcon.style.display = "block";
    }

    viewModal.setAttribute("data-kit-id", kitId);
  } catch (error) {
    console.error("Error loading OJT Kit data:", error);
    Swal.fire({
      icon: "error",
      title: "Something Went Wrong",
      text: "Failed to load OJT Kit data.",
      confirmButtonColor: "#590f1c",
    });
  } finally {
    showLoading(false);
  }
}

function setupEventListeners() {
  if (searchInput) {
    const debouncedSearch = debounce(function () {
      const searchTerm = searchInput.value.trim();
      if (searchTerm.length > 0) {
        searchOJTKits(searchTerm);
      } else {
        loadOJTKits();
      }
    }, 500);

    searchInput.addEventListener("input", debouncedSearch);
  }
}

async function searchOJTKits(searchTerm) {
  showLoading(true);
  try {
    const { firebaseCRUD } = await import("./firebase-crud.js");
    const allKits = await firebaseCRUD.getAllData("ojtKits");

    const searchTerms = searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    if (searchTerms.length === 0) {
      await loadOJTKits();
      return;
    }

    const filtered = allKits.filter((kit) => {
      const kitTitle = kit.title?.toLowerCase() || "";

      return searchTerms.every((term) => kitTitle.includes(term));
    });

    if (filtered.length === 0) {
      cardContainer.innerHTML = `
                <div class="position-absolute top-50 start-50 translate-middle col-12 text-center py-4">
                    <i class="bi bi-search fs-1 text-muted"></i>
                    <h6 class="mt-2">No results found</h6>
                    <p class="mt-1">No OJT Kits match your search for "${searchTerm}"</p>
                </div>
            `;
    } else {
      await loadOJTKits(filtered);
    }
  } catch (error) {
    console.error("Error searching OJT Kits:", error);
    showError("Failed to search OJT Kits");
  } finally {
    showLoading(false);
  }
}

async function handleAddOJTKit() {
  const submitButton = document.getElementById("addOJTKitButton");
  const title = document.getElementById("ojt-kit-title-display").value.trim();
  const content = document.getElementById("ojtKitContent").value.trim();

  if (!title || !content) {
    Swal.fire({
      icon: "warning",
      title: "All Fields Are Required",
      text: "Please fill in all required fields",
      confirmButtonColor: "#590f1c",
    });
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Adding...
    `;

  try {
    const { firebaseCRUD } = await import("./firebase-crud.js");

    const kitData = {
      title: title,
      content: content,
      image: uploadedImageBase64 || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await firebaseCRUD.createData("ojtKits", kitData);
    Swal.fire({
      icon: "success",
      title: "Add Success",
      text: "OJT Kit added successfully!",
      timer: 2000,
      showConfirmButton: false,
    });
    document.getElementById("addOJTKitForm").reset();
    document.getElementById("preview-image").style.display = "none";
    document.getElementById("camera-icon").style.display = "block";
    uploadedImageBase64 = "";

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addOJTKITSModal")
    );
    modal.hide();

    await loadOJTKits();
  } catch (error) {
    console.error("Error adding OJT Kit:", error);
    Swal.fire({
      icon: "error",
      title: "Add Failed",
      text: "Failed to add OJT Kit.",
      confirmButtonColor: "#590f1c",
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Add OJT Kit";
  }
}

function showLoading(show) {
  const loader = document.getElementById("loading-indicator") || createLoader();
  if (loader) {
    loader.style.display = show ? "block" : "none";
  }
}

function createLoader() {
  try {
    const loader = document.createElement("div");
    loader.id = "loading-indicator";
    loader.className = "text-center py-4";
    loader.innerHTML =
      '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

    const container =
      document.querySelector(".card-container") || document.body;
    if (container) {
      container.prepend(loader);
      return loader;
    }
    return null;
  } catch (error) {
    console.error("Error creating loader:", error);
    return null;
  }
}

function showError(message) {
  const container = document.querySelector(".card-container") || document.body;
  container.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="min-height: 50vh;">
            <div class="text-center">
                <i class="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
                <p class="mt-3 fs-5">${message}</p>
                <button class="btn btn-primary mt-3" onclick="location.reload()">Retry</button>
            </div>
        </div>
    `;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

let uploadedImageBase64 = "";

document.addEventListener("DOMContentLoaded", function () {
  const addImageInput = document.getElementById("add-image-input");
  if (addImageInput) {
    addImageInput.addEventListener("change", handleImageUpload);
  }

  const ojtKitForm = document.getElementById("ojtKitForm");
  if (ojtKitForm) {
    ojtKitForm.addEventListener("submit", handleOJTKitSubmit);
  }

  const ojtKitFormUpdate = document.getElementById("ojtKitFormUpdate");
  if (ojtKitFormUpdate) {
    ojtKitFormUpdate.addEventListener("submit", handleOJTKitSubmit);
  }
});

let uploadedImages = [];

function handleImageUpload(event) {
  const files = event.target.files;
  const previewImageContainer = document.getElementById("add-image-container");

  if (!files || !previewImageContainer) return;

  uploadedImages = [];
  previewImageContainer.innerHTML = "";

  Array.from(files).forEach((file) => {
    const reader = new FileReader();

    reader.onload = async function (e) {
      try {
        let imageData = e.target.result;

        if (file.size > 1048576) {
          imageData = await compressImage(imageData);
        }

        uploadedImages.push(imageData);

        const imgContainer = document.createElement("div");
        imgContainer.className = "image-preview-container";

        const img = document.createElement("img");
        img.src = imageData;
        img.className = "img-thumbnail";
        img.style.maxWidth = "100px";
        img.style.maxHeight = "100px";
        img.style.marginRight = "5px";
        img.style.marginBottom = "5px";

        imgContainer.appendChild(img);
        previewImageContainer.appendChild(imgContainer);
      } catch (error) {
        console.error("Error processing image:", error);
        Swal.fire({
          icon: "error",
          title: "An Error Occur",
          text: "Error processing one or more images.",
          confirmButtonColor: "#590f1c",
        });
      }
    };

    reader.readAsDataURL(file);
  });
}

function compressImage(imageData, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageData;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const maxWidth = 1024;
      const maxHeight = 1024;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressedData = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedData);
    };

    img.onerror = function () {
      resolve(imageData);
    };
  });
}

async function handleOJTKitSubmit(e) {
  e.preventDefault();

  const formId = e.target.id;
  const isUpdate = formId === "ojtKitFormUpdate";
  const modal = document.getElementById(
    isUpdate ? "updateReportModal" : "addReportModal"
  );
  const submitButton = e.target.querySelector('button[type="submit"]');
  const contentInput = modal.querySelector("#ojt-kit-content");
  const userId = localStorage.getItem("userId");

  if (!modal || !submitButton || !contentInput || !userId) {
    return;
  }

  const kit = modal.dataset.viewingKit
    ? JSON.parse(modal.dataset.viewingKit)
    : null;
  if (!kit) {
    Swal.fire({
      icon: "Warning",
      title: "No OJT Kit Selected",
      text: "Please select OJT Kit first.",
      confirmButtonColor: "#590f1c",
    });
    return;
  }

  const content = contentInput.value.trim();
  if (!content) {
    Swal.fire({
      icon: "warning",
      title: "All Fields Are Required",
      text: "Please fill in all required fields.",
      confirmButtonColor: "#590f1c",
    });
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ${isUpdate ? "Updating..." : "Submitting..."}
    `;

  try {
    const { firebaseCRUD } = await import("./firebase-crud.js");
    const reports = await firebaseCRUD.getAllData("ojtkits_2");

    const existingReport = reports.find(
      (report) => report.userId === userId && report.ojtKitId === kit.id
    );

    let reportData = {
      title: kit.title,
      content: content,
      updatedAt: new Date().toISOString(),
      userId: userId,
      ojtKitId: kit.id,
      imageCount: uploadedImages.length,
    };

    let reportId;

    if (existingReport) {
      reportId = existingReport.id;
      reportData.createdAt = existingReport.createdAt;
      await firebaseCRUD.updateData("ojtkits_2", reportId, reportData);
    } else {
      reportId = `${userId}_${Date.now()}`;
      reportData.createdAt = new Date().toISOString();
      await firebaseCRUD.setDataWithId("ojtkits_2", reportId, reportData);
    }

    if (uploadedImages.length > 0) {
      if (existingReport) {
        const existingImages = await firebaseCRUD.getAllData(
          `ojtkits_2/${reportId}/images`
        );
        for (const img of existingImages) {
          await firebaseCRUD.deleteData(`ojtkits_2/${reportId}/images`, img.id);
        }
      }

      for (const imageData of uploadedImages) {
        const imageDocData = {
          image: imageData,
          ojtKitId: kit.id,
          userId: userId,
          createdAt: new Date().toISOString(),
        };

        await firebaseCRUD.createData(
          `ojtkits_2/${reportId}/images`,
          imageDocData
        );
      }
    }

    Swal.fire({
      icon: "success",
      title: `${isUpdate ? "Update" : "Add"} Success`,
      text: `Document ${isUpdate ? "updated" : "added"} successfully!`,
      timer: 2000,
      showConfirmButton: false,
    });

    e.target.reset();
    document.getElementById("add-image-container").innerHTML = "";
    uploadedImages = [];

    delete modal.dataset.viewingKit;

    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    await loadOJTKits();
  } catch (error) {
    console.error("Error processing report:", error);
    Swal.fire({
      icon: "error",
      title: `${isUpdate ? "Update" : "Add"} Failed`,
      text: `Failed to ${isUpdate ? "update" : "add"} report`,
      confirmButtonColor: "#590f1c",
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = isUpdate ? "Update OJT Kit" : "Submit OJT Kit";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("update-image-input")
    ?.addEventListener("change", async function (e) {
      const files = e.target.files;
      const imageContainer = document.getElementById("update-image-container");

      if (!files || !imageContainer) return;

      for (const file of files) {
        try {
          const imageData = await processImageFile(file);
          addImageToContainer(imageData, true);
        } catch (error) {
          console.error("Error processing image:", error);
          Swal.fire({
            icon: "error",
            title: "An Error Occur",
            text: "Error processing image.",
            confirmButtonColor: "#590f1c",
          });
        }
      }

      e.target.value = "";
    });

  document
    .getElementById("ojtKitFormUpdate")
    ?.addEventListener("submit", async function (e) {
      e.preventDefault();
      showLoading(true);

      try {
        const modal = document.getElementById("updateReportModal");
        const reportId = modal.dataset.reportId;
        const existingImages = JSON.parse(modal.dataset.existingImages || "[]");
        const content = document
          .getElementById("update-ojt-kit-content")
          .value.trim();
        const userId = localStorage.getItem("userId");
        const kitId = JSON.parse(modal.dataset.viewingKit).id;

        if (!reportId || !userId) {
        }

        const { firebaseCRUD } = await import("./firebase-crud.js");

        const imageWrappers = modal.querySelectorAll(
          "#update-image-container .image-thumbnail-wrapper"
        );
        const imagesToDelete = [];
        const newImages = [];

        imageWrappers.forEach((wrapper, index) => {
          if (wrapper.dataset.toDelete === "true") {
            const imgIndex = wrapper.dataset.imageIndex;
            if (imgIndex !== undefined) {
              imagesToDelete.push(existingImages[imgIndex].id);
            }
          } else if (wrapper.dataset.isNew === "true") {
            newImages.push(wrapper.dataset.imageData);
          }
        });

        const reportData = {
          content: content,
          updatedAt: new Date().toISOString(),
          imageCount:
            existingImages.length - imagesToDelete.length + newImages.length,
        };

        await firebaseCRUD.updateData("ojtkits_2", reportId, reportData);

        for (const imageId of imagesToDelete) {
          await firebaseCRUD.deleteData(
            `ojtkits_2/${reportId}/images`,
            imageId
          );
        }

        for (const imageData of newImages) {
          const imageDocData = {
            image: imageData,
            ojtKitId: kitId,
            userId: userId,
            createdAt: new Date().toISOString(),
          };
          await firebaseCRUD.createData(
            `ojtkits_2/${reportId}/images`,
            imageDocData
          );
        }
        Swal.fire({
          icon: "success",
          title: "Update Success",
          text: "Document updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        bootstrap.Modal.getInstance(modal).hide();
        await loadOJTKits();
      } catch (error) {
        console.error("Error updating report:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update report.",
          confirmButtonColor: "#590f1c",
        });
      } finally {
        showLoading(false);
      }
    });
});

function addImageToContainer(imageData, isNew = false) {
  const imageContainer = document.getElementById("update-image-container");

  const wrapper = document.createElement("div");
  wrapper.className =
    "image-thumbnail-wrapper d-inline-block position-relative";
  wrapper.style.width = "100px";
  wrapper.style.height = "100px";
  wrapper.style.marginRight = "10px";

  const img = document.createElement("img");
  img.src = imageData;
  img.className = "h-100 w-100 object-fit-cover";
  img.style.borderRadius = "5px";

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-1";
  deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
  deleteBtn.onclick = (e) => {
    e.preventDefault();
    wrapper.style.opacity = "0.5";
    wrapper.dataset.toDelete = "true";
    deleteBtn.style.display = "none";
  };

  if (isNew) {
    wrapper.dataset.isNew = "true";
    wrapper.dataset.imageData = imageData;
  }

  wrapper.appendChild(img);
  wrapper.appendChild(deleteBtn);
  imageContainer.appendChild(wrapper);
}

async function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (e) {
      try {
        let imageData = e.target.result;

        if (file.size > 1048576) {
          imageData = await compressImage(imageData);
        }

        resolve(imageData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = function () {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}
