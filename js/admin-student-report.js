// document.addEventListener("DOMContentLoaded", function () {
//   const monthYear = document.getElementById("month-year");
//   const daysContainer = document.getElementById("days");
//   const prevButton = document.getElementById("prev");
//   const nextButton = document.getElementById("next");
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   let currentDate = new Date();
//   let today = new Date();
//   function renderCalendar(date) {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1).getDay();
//     const lastDay = new Date(year, month + 1, 0).getDate();
//     monthYear.textContent = `${months[month]} ${year}`;
//     daysContainer.innerHTML = "";
//     // Previous month's dates
//     const prevMonthLastDay = new Date(year, month, 0).getDate();
//     for (let i = firstDay; i > 0; i--) {
//       const dayDiv = document.createElement("div");
//       dayDiv.textContent = prevMonthLastDay - i + 1;
//       dayDiv.classList.add("fade-date");
//       daysContainer.appendChild(dayDiv);
//     }
//     // Current month's dates
//     for (let i = 1; i <= lastDay; i++) {
//       const dayDiv = document.createElement("div");
//       dayDiv.textContent = i;
//       if (
//         i === today.getDate() &&
//         month === today.getMonth() &&
//         year === today.getFullYear()
//       ) {
//         dayDiv.classList.add("today");
//       }
//       daysContainer.appendChild(dayDiv);
//     }
//     // Next month's dates
//     const nextMonthStartDay = 7 - new Date(year, month + 1, 0).getDay() - 1;
//     for (let i = 1; i <= nextMonthStartDay; i++) {
//       const dayDiv = document.createElement("div");
//       dayDiv.textContent = i;
//       dayDiv.classList.add("fade-date");
//       daysContainer.appendChild(dayDiv);
//     }
//   }
//   prevButton.addEventListener("click", function () {
//     currentDate.setMonth(currentDate.getMonth() - 1);
//     renderCalendar(currentDate);
//   });
//   nextButton.addEventListener("click", function () {
//     currentDate.setMonth(currentDate.getMonth() + 1);
//     renderCalendar(currentDate);
//   });
//   renderCalendar(currentDate);
// });

import { firebaseCRUD } from "./firebase-crud.js";



// document.addEventListener('DOMContentLoaded', function () {
//   // Get userId from URL or localStorage
//   const userId = getUserIdFromUrl() || localStorage.getItem('userId');

//   if (userId) {
//     loadStudentReports(userId);
//   } else {
//     console.error("No user ID found");
//     // Redirect back to students list
//     // window.location.href = 'admin-student.html';
//   }
// });

// function getUserIdFromUrl() {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get('userId');
// }

// function loadStudentReports(userId) {
//   import("./firebase-crud.js")
//     .then(({ firebaseCRUD }) => {
//       // First get student info to display name
//       firebaseCRUD.getDocument("students", userId)
//         .then((student) => {
//           if (student) {
//             displayStudentInfo(student);

//             // Then get all reports for this student
//             return firebaseCRUD.getDocumentsByField(
//               "reports",
//               "userId", // Field to filter by
//               userId,   // The user's ID
//               "createdAt", // Field to order by
//               "desc"    // Sort direction
//             );
//           } else {
//             throw new Error("Student not found");
//           }
//         })
//         .then((reports) => {
//           if (reports && reports.length > 0) {
//             displayReports(reports);
//             setupDateNavigation(reports);
//           } else {
//             displayNoReportsMessage();
//           }
//         })
//         .catch((error) => {
//           console.error("Error loading reports:", error);
//           showErrorToast("Failed to load reports: " + error.message);
//         });
//     })
//     .catch((err) => {
//       console.error("Failed to load firebase-crud:", err);
//     });
// }

// function displayStudentInfo(student) {
//   // Update the student name in the navbar
//   const studentNameElement = document.querySelector('.student-name');
//   if (studentNameElement) {
//     studentNameElement.textContent = `${student.firstName} ${student.middleName || ''} ${student.lastName} ${student.suffix || ''}`.trim();
//   }
// }

// function formatDateTime(dateString) {
//   const date = new Date(dateString);

//   // Format time (12:30:40 AM)
//   const timeOptions = {
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true
//   };
//   const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

//   // Format date (April 17, 2025)
//   const dateOptions = {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   };
//   const formattedDate = date.toLocaleDateString('en-US', dateOptions);

//   return {
//     time: formattedTime,
//     date: formattedDate,
//     monthName: date.toLocaleString('default', { month: 'long' }),
//     monthDay: date.getDate(),
//     fullDate: dateString // Keep original for sorting
//   };
// }

// function displayReports(reports) {
//   const reportsContainer = document.querySelector('.student-report-container');
//   reportsContainer.innerHTML = ''; // Clear existing content

//   reports.forEach(report => {
//     const formattedDateTime = formatDateTime(report.createdAt);

//     const reportElement = document.createElement('div');
//     reportElement.className = 'report p-2';
//     reportElement.innerHTML = `
//             <p class="text-end text-light">
//                 <small class="font-darker-light-color">${formattedDateTime.time}</small>
//             </p>
//             <h2 class="border-bottom border-light text-truncate pb-2 fw-bold font-darker-light-color">
//                 ${report.title || 'Daily Report'}
//             </h2>
//             ${report.hasImages ?
//         `<div class="image-container d-flex align-items-center me-3">
//                     <!-- Images would be loaded here if you implement image storage -->
//                     <img src="../assets/img/icons8_full_image_480px_1.png" alt="Report image">
//                 </div>` :
//         ''
//       }
//             <div class="content-container">
//                 <p class="text-light fs-6 fw-normal mb-0">
//                     ${report.content || 'No content provided'}
//                 </p>
//             </div>
//         `;

//     reportsContainer.appendChild(reportElement);
//   });
// }

// function setupDateNavigation(reports) {
//   const dateContainer = document.querySelector('.date-container');
//   dateContainer.innerHTML = ''; // Clear existing dates

//   // Get unique dates from reports
//   const uniqueDates = [...new Set(
//     reports.map(report => {
//       const date = new Date(report.createdAt);
//       return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
//     })
//   )];

//   uniqueDates.forEach(dateString => {
//     const date = new Date(dateString);
//     const formattedDate = formatDateTime(dateString);
//     const reportsForDate = reports.filter(report => {
//       const reportDate = new Date(report.createdAt);
//       return reportDate.getFullYear() === date.getFullYear() &&
//         reportDate.getMonth() === date.getMonth() &&
//         reportDate.getDate() === date.getDate();
//     });

//     const dateButton = document.createElement('button');
//     dateButton.className = 'w-100 border-0 px-0 py-2 bg-transparent d-flex align-items-center justify-content-between border-bottom border-light rounded-0';
//     dateButton.innerHTML = `
//             <span class="report-date-sm mt-1 d-flex flex-column align-items-center justify-content-between d-md-none text-center w-100">
//                 <span id="month-name-sm" class="fw-normal text-truncate" style="font-size: 12px; width: calc(100% - 5px)">
//                     ${formattedDate.monthName}
//                 </span>
//                 <span id="month-date-sm" class="fs-3 fw-bold">${formattedDate.monthDay}</span>
//             </span>
//             <span class="d-none d-md-block d-flex text-center w-100 fw-normal">${formattedDate.date}</span>
//         `;

//     dateButton.addEventListener('click', () => {
//       filterReportsByDate(date, reports);
//     });

//     dateContainer.appendChild(dateButton);
//   });
// }

// function filterReportsByDate(selectedDate, allReports) {
//   const filteredReports = allReports.filter(report => {
//     const reportDate = new Date(report.createdAt);
//     return reportDate.getFullYear() === selectedDate.getFullYear() &&
//       reportDate.getMonth() === selectedDate.getMonth() &&
//       reportDate.getDate() === selectedDate.getDate();
//   });

//   displayReports(filteredReports);
// }

// function displayNoReportsMessage() {
//   const reportsContainer = document.querySelector('.student-report-container');
//   reportsContainer.innerHTML = `
//         <div class="text-center text-light py-5">
//             <i class="bi bi-file-earmark-text fs-1"></i>
//             <p class="mt-3">No reports found for this student</p>
//         </div>
//     `;
// }

// function showErrorToast(message) {
//   const toast = document.createElement('div');
//   toast.className = 'toast align-items-center text-white bg-danger position-fixed bottom-0 end-0 m-3';
//   toast.innerHTML = `
//         <div class="d-flex">
//             <div class="toast-body">${message}</div>
//             <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//         </div>
//     `;
//   document.body.appendChild(toast);
//   new bootstrap.Toast(toast).show();
//   setTimeout(() => toast.remove(), 5000);
// }



// admin-student-report.js
// import { firebaseCRUD } from './firebase-crud.js';

document.addEventListener('DOMContentLoaded', async function () {
  // try {
  //   // Get userId from URL or localStorage
  //   const userId = getUserIdFromUrl() || localStorage.getItem('userId');
  //   console.log(userId);

  //   if (userId) {
  //     await loadStudentReports(userId);
  //   } else {
  //     console.error("No user ID found");
  //     // window.location.href = 'admin-student.html';
  //   }
  // } catch (error) {
  //   console.error("Initialization error:", error);
  //   showErrorToast("Failed to initialize: " + error.message);
  // }

  try {
    // Get userId from URL or localStorage
    const userId = getUserIdFromUrl() || localStorage.getItem('userId');
    console.log(userId);

    if (userId) {
      await loadStudentReports(userId);

      // Added: Check if already assistant when page loads
      try {
        const { firebaseCRUD } = await import("./firebase-crud.js");
        const students = await firebaseCRUD.queryData("students", "userId", "==", userId);

        if (students?.[0]?.userType === "studentAssistant") {
          const btn = document.getElementById('appoint-assistant-btn');
          if (btn) {
            btn.textContent = "Assistant Appointed";
            btn.disabled = true;
          }
        }
      } catch (error) {
        console.error("Error checking assistant status:", error);
      }
      // End of added code

    } else {
      console.error("No user ID found");
      // window.location.href = 'admin-student.html';
    }
  } catch (error) {
    console.error("Initialization error:", error);
    showErrorToast("Failed to initialize: " + error.message);
  }
});

// Updated appoint assistant functionality
document.getElementById('appoint-assistant-btn')?.addEventListener('click', async function () {
  try {
    const userId = getUserIdFromUrl() || localStorage.getItem('userId');
    if (!userId) throw new Error("No user ID found");

    const { firebaseCRUD } = await import("./firebase-crud.js");

    // First query the student to get their document ID
    const students = await firebaseCRUD.queryData("students", "userId", "==", userId);
    if (!students || students.length === 0) throw new Error("Student not found");

    const studentDocId = students[0].id; // Assuming the document ID is stored in the 'id' field

    // Update userType to studentAssistant using the document ID
    await firebaseCRUD.updateData("students", studentDocId, { userType: "studentAssistant" });

    // Show success message and disable button
    showErrorToast("Student appointed as assistant successfully!");
    this.textContent = "Assistant Appointed";
    this.disabled = true;

  } catch (error) {
    console.error("Error appointing assistant:", error);
    showErrorToast("Failed to appoint assistant: " + error.message);
  }
});



function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userId');
}

async function loadStudentReports(userId) {
  try {
    const { firebaseCRUD } = await import("./firebase-crud.js");

    // Query student by userId field
    const students = await firebaseCRUD.queryData("students", "userId", "==", userId);
    if (!students || students.length === 0) throw new Error("Student not found");

    const student = students[0];
    displayStudentInfo(student);

    // Then get all reports for this student
    const reports = await firebaseCRUD.queryData("reports", "userId", "==", userId);

    // Sort reports by createdAt in descending order
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (reports && reports.length > 0) {
      displayReports(reports);
      setupDateNavigation(reports);
    } else {
      displayNoReportsMessage();
    }

  } catch (error) {
    console.error("Error loading reports:", error);
    showErrorToast("Failed to load reports: " + error.message);
  }
}

function displayStudentInfo(student) {
  const studentNameElement = document.querySelector('.student-name');
  if (studentNameElement) {
    studentNameElement.textContent = `${student.firstName} ${student.middleName || ''} ${student.lastName} ${student.suffix || ''}`.trim();
  }
}

function formatDateTime(dateString) {
  const date = new Date(dateString);

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);

  return {
    time: formattedTime,
    date: formattedDate,
    monthName: date.toLocaleString('default', { month: 'long' }),
    monthDay: date.getDate(),
    fullDate: dateString
  };
}



async function displayReports(reports) {
  const reportsContainer = document.querySelector('.student-report-container');
  reportsContainer.innerHTML = '';

  for (const report of reports) {
    const formattedDateTime = formatDateTime(report.createdAt);

    // Load base64 images
    const images = await loadReportImages(report.id);

    const reportElement = document.createElement('div');
    reportElement.className = 'report p-2';


    reportElement.innerHTML = `
  <p class="text-end text-light">
    <small class="font-darker-light-color">${formattedDateTime.time}</small>
  </p>
  <h2 class="border-bottom border-light text-truncate pb-2 fw-bold font-darker-light-color">
    ${report.title || 'Daily Report'}
  </h2>
  ${images.length > 0 ? `
    <div class="image-container mb-2 d-flex flex-row flex-nowrap gap-2 overflow-auto">
      ${images.map(base64Img => `
        <img src="${base64Img}" alt="Report image"
          class="clickable-report-image"
          style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 8px; cursor: pointer;">
      `).join('')}
    </div>` : ''
      }
  <div class="content-container mt-2">
    <p class="text-light fs-6 fw-normal mb-0">
      ${report.content || 'No content provided'}
    </p>
  </div>
`;




    reportsContainer.appendChild(reportElement);


    // Add click listeners to all newly added images
    const imageElements = reportElement.querySelectorAll('.clickable-report-image');
    imageElements.forEach(img => {
      img.addEventListener('click', () => {
        document.getElementById('modal-image-view').src = img.src;
        const viewImageModal = new bootstrap.Modal(document.getElementById('viewImageModal'));
        viewImageModal.show();
      });
    });

  }
}





async function loadReportImages(reportId) {
  try {
    const imageDocs = await firebaseCRUD.getAllData(`reports/${reportId}/images`);

    const images = [];
    imageDocs.forEach(doc => {
      if (doc.imageData) {
        images.push(doc.imageData); // already base64 with prefix
      }
    });

    return images;
  } catch (error) {
    console.error(`Failed to load images for report ${reportId}:`, error);
    return [];
  }
}






function setupDateNavigation(reports) {
  const dateContainer = document.querySelector('.date-container');
  dateContainer.innerHTML = '';

  const uniqueDates = [...new Set(
    reports.map(report => {
      const date = new Date(report.createdAt);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    })
  )];

  uniqueDates.forEach(dateString => {
    const date = new Date(dateString);
    const formattedDate = formatDateTime(dateString);
    const reportsForDate = reports.filter(report => {
      const reportDate = new Date(report.createdAt);
      return reportDate.getFullYear() === date.getFullYear() &&
        reportDate.getMonth() === date.getMonth() &&
        reportDate.getDate() === date.getDate();
    });

    const dateButton = document.createElement('button');
    dateButton.className = 'w-100 border-0 px-0 py-2 bg-transparent d-flex align-items-center justify-content-between border-bottom border-light rounded-0';
    dateButton.innerHTML = `
            <span class="report-date-sm mt-1 d-flex flex-column align-items-center justify-content-between d-md-none text-center w-100">
                <span id="month-name-sm" class="fw-normal text-truncate" style="font-size: 12px; width: calc(100% - 5px)">
                    ${formattedDate.monthName}
                </span>
                <span id="month-date-sm" class="fs-3 fw-bold">${formattedDate.monthDay}</span>
            </span>
            <span class="d-none d-md-block d-flex text-center w-100 fw-normal">${formattedDate.date}</span>
        `;

    dateButton.addEventListener('click', () => {
      filterReportsByDate(date, reports);
    });

    dateContainer.appendChild(dateButton);
  });
}

function filterReportsByDate(selectedDate, allReports) {
  const filteredReports = allReports.filter(report => {
    const reportDate = new Date(report.createdAt);
    return reportDate.getFullYear() === selectedDate.getFullYear() &&
      reportDate.getMonth() === selectedDate.getMonth() &&
      reportDate.getDate() === selectedDate.getDate();
  });

  displayReports(filteredReports);
}

function displayNoReportsMessage() {
  const reportsContainer = document.querySelector('.student-report-container');
  reportsContainer.innerHTML = `
        <div class="text-center text-light py-5">
            <i class="bi bi-file-earmark-text fs-1"></i>
            <p class="mt-3">No reports found for this student</p>
        </div>
    `;
}

function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-white bg-danger position-fixed bottom-0 end-0 m-3';
  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
  document.body.appendChild(toast);
  new bootstrap.Toast(toast).show();
  setTimeout(() => toast.remove(), 5000);
}
















// Add this code to your existing JavaScript file, preferably near the top with other event listeners

// // Edit button click handler
// document.querySelector('[data-bs-target="#editDataModal"]')?.addEventListener('click', async function () {
//   try {
//     const userId = getUserIdFromUrl() || localStorage.getItem('userId');
//     if (!userId) throw new Error("No user ID found");

//     const { firebaseCRUD } = await import("./firebase-crud.js");

//     // Get student data
//     const students = await firebaseCRUD.queryData("students", "userId", "==", userId);
//     if (!students || students.length === 0) throw new Error("Student not found");

//     const student = students[0];

//     // Populate form fields
//     document.getElementById('user-id').value = userId;
//     document.getElementById('student-id').value = student.studentId || '';
//     document.getElementById('phone-number').value = student.phoneNumber || '';
//     document.getElementById('first-name').value = student.firstName || '';
//     document.getElementById('middle-name').value = student.middleName || '';
//     document.getElementById('last-name').value = student.lastName || '';
//     document.getElementById('sufix').value = student.suffix || '';
//     document.getElementById('gender').value = student.gender || 'male';
//     document.getElementById('address').value = student.address || '';
//     document.getElementById('company-name').value = student.companyName || '';

//     // Set time values
//     document.getElementById('morning-time-in').value = student.morningTimeIn || '';
//     document.getElementById('morning-time-out').value = student.morningTimeOut || '';
//     document.getElementById('afternoon-time-in').value = student.afternoonTimeIn || '';
//     document.getElementById('afternoon-time-out').value = student.afternoonTimeOut || '';

//     // Set user type
//     document.getElementById('user-type').value = student.userType || 'student';

//     // Set profile image if available
//     if (student.userImg) {
//       document.getElementById('user-profile-img').src = student.userImg;
//     }

//   } catch (error) {
//     console.error("Error loading student data:", error);
//     showErrorToast("Failed to load student data: " + error.message);
//   }
// });


document.querySelector('[data-bs-target="#editDataModal"]')?.addEventListener('click', async function () {
  try {
    const userId = getUserIdFromUrl() || localStorage.getItem('userId');
    if (!userId) throw new Error("No user ID found");

    const { firebaseCRUD } = await import("./firebase-crud.js");

    // Initialize dropdowns first
    await initializeDropdowns();

    // Then load and set student data
    await loadAndSetStudentData(userId);

  } catch (error) {
    console.error("Error loading student data:", error);
    showErrorToast("Failed to load student data: " + error.message);
  }
});

async function initializeDropdowns() {
  // Initialize gender dropdown
  const genderSelect = document.getElementById('gender');
  // Clear and repopulate to ensure fresh state
  genderSelect.innerHTML = `
    <option value="male">Male</option>
    <option value="female">Female</option>
  `;

  // Initialize company dropdown
  const companySelect = document.getElementById('companyName');
  // Clear existing options except the first empty one
  companySelect.innerHTML = '<option value="">Select a company</option>';

  // Load companies from database
  try {
    const companies = await firebaseCRUD.getAllData("company");

    if (companies) {
      // Convert to array if it's an object
      const companiesArray = Array.isArray(companies) ? companies : Object.values(companies);

      if (companiesArray?.length) {
        companiesArray.forEach(company => {
          if (company?.companyName) {
            const option = document.createElement('option');
            option.value = company.companyName;
            option.textContent = company.companyName;
            companySelect.appendChild(option);
          }
        });
      }
    }
  } catch (error) {
    console.warn("Could not load company list:", error);
    // Add default companies if the fetch fails
    ['DAR', 'DOST'].forEach(company => {
      const option = document.createElement('option');
      option.value = company;
      option.textContent = company;
      companySelect.appendChild(option);
    });
  }
}





async function loadAndSetStudentData(userId) {
  // Get student data
  const students = await firebaseCRUD.queryData("students", "userId", "==", userId);
  if (!students || students.length === 0) throw new Error("Student not found");

  const student = students[0];

  // Set basic form fields
  document.getElementById('user-id').value = userId;
  document.getElementById('student-id').value = student.studentId || '';
  document.getElementById('phone-number').value = student.phoneNumber || '';
  document.getElementById('first-name').value = student.firstName || '';
  document.getElementById('middle-name').value = student.middleName || '';
  document.getElementById('last-name').value = student.lastName || '';
  document.getElementById('sufix').value = student.suffix || '';
  document.getElementById('address').value = student.address || '';

  // Set gender selection (dropdown is already populated)
  if (student.gender) {
    document.getElementById('gender').value = student.gender;
  }

  // Set company selection (dropdown is already populated)
  if (student.companyName) {
    document.getElementById('companyName').value = student.companyName;
  }

  // Set time values
  document.getElementById('morning-time-in').value = student.morningTimeIn || '';
  document.getElementById('morning-time-out').value = student.morningTimeOut || '';
  document.getElementById('afternoon-time-in').value = student.afternoonTimeIn || '';
  document.getElementById('afternoon-time-out').value = student.afternoonTimeOut || '';

  // Set user type
  document.getElementById('user-type').value = student.userType || 'student';

  // Set profile image if available
  if (student.userImg) {
    document.getElementById('user-profile-img').src = student.userImg;
  }
}







// Form submission handler
document.getElementById('edit-info-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    const userId = getUserIdFromUrl() || localStorage.getItem('userId');
    if (!userId) throw new Error("No user ID found");

    const { firebaseCRUD } = await import("./firebase-crud.js");

    // Get form data
    const formData = {
      studentId: document.getElementById('student-id').value,
      phoneNumber: document.getElementById('phone-number').value,
      firstName: document.getElementById('first-name').value,
      middleName: document.getElementById('middle-name').value,
      lastName: document.getElementById('last-name').value,
      suffix: document.getElementById('sufix').value,
      gender: document.getElementById('gender').value,
      address: document.getElementById('address').value,
      companyName: document.getElementById('companyName').value,
      morningTimeIn: document.getElementById('morning-time-in').value,
      morningTimeOut: document.getElementById('morning-time-out').value,
      afternoonTimeIn: document.getElementById('afternoon-time-in').value,
      afternoonTimeOut: document.getElementById('afternoon-time-out').value,
      userType: document.getElementById('user-type').value,
      updatedAt: new Date().toISOString()
    };

    // First query the student to get their document ID
    const students = await firebaseCRUD.queryData("students", "userId", "==", userId);
    if (!students || students.length === 0) throw new Error("Student not found");

    const studentDocId = students[0].id;

    // Update student data
    await firebaseCRUD.updateData("students", studentDocId, formData);

    // Show success message
    showErrorToast("Student information updated successfully!");

    // Close the modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editDataModal'));
    editModal.hide();

    // Refresh the displayed student info
    displayStudentInfo({ ...students[0], ...formData });

  } catch (error) {
    console.error("Error updating student:", error);
    showErrorToast("Failed to update student: " + error.message);
  }
});