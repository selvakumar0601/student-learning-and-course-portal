
const courses = [
    {
        id: 1,
        title: "HTML & CSS Fundamentals",
        category: "Web Development",
        icon: "🌐",
        description: "Learn HTML and CSS to build beautiful responsive websites.",
        lessons: ["Introduction to HTML", "HTML Forms", "CSS Basics", "Flexbox", "Responsive Design"]
    },
    {
        id: 2,
        title: "JavaScript for Beginners",
        category: "Programming",
        icon: "⚡",
        description: "Learn JavaScript fundamentals and interactive web development.",
        lessons: ["Variables", "Functions", "Arrays", "Objects", "DOM Manipulation"]
    },
    {
        id: 3,
        title: "React.js Essentials",
        category: "Web Development",
        icon: "⚛️",
        description: "Build modern frontend applications using React.",
        lessons: ["Introduction to React", "Components", "Props", "State", "Hooks"]
    },
    {
        id: 4,
        title: "Python Programming",
        category: "Programming",
        icon: "🐍",
        description: "Start programming with Python and build useful projects.",
        lessons: ["Python Basics", "Variables", "Loops", "Functions", "File Handling"]
    },
    {
        id: 5,
        title: "UI/UX Design Basics",
        category: "Design",
        icon: "🎨",
        description: "Learn design principles and create user-friendly interfaces.",
        lessons: ["UI and UX", "Color Theory", "Typography", "Wireframes", "Prototyping"]
    },
    {
        id: 6,
        title: "SQL & Database Mastery",
        category: "Database",
        icon: "🗄️",
        description: "Learn SQL queries and database management.",
        lessons: ["Database Basics", "SELECT Queries", "WHERE", "Joins", "SQL Functions"]
    },
    {
        id: 7,
        title: "Node.js & Express",
        category: "Web Development",
        icon: "🟢",
        description: "Develop backend applications and REST APIs.",
        lessons: ["Node.js Basics", "Express Setup", "Routing", "Middleware", "REST APIs"]
    },
    {
        id: 8,
        title: "Git & GitHub",
        category: "Programming",
        icon: "🐙",
        description: "Learn version control and project collaboration.",
        lessons: ["Git Basics", "Commits", "Branches", "GitHub", "Pull Requests"]
    }
];

// LocalStorage data
let enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || {};
let completed = JSON.parse(localStorage.getItem("completedLessons")) || {};

function saveData() {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
    localStorage.setItem("completedLessons", JSON.stringify(completed));
}

// Course cards
function renderCourses() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;

    const filtered = courses.filter(course => {
        const matchesSearch =
            course.title.toLowerCase().includes(search) ||
            course.description.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || course.category === category;

        return matchesSearch && matchesCategory;
    });

    const grid = document.getElementById("courseGrid");

    grid.innerHTML = filtered.map(course => `
        <div class="course-card">
            <div class="course-icon">${course.icon}</div>
            <span class="category">${course.category}</span>
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <button onclick="openCourse(${course.id})">View Course</button>
        </div>
    `).join("");
}

// Course details
function openCourse(id) {
    const course = courses.find(c => c.id === id);
    const modal = document.getElementById("courseModal");
    const content = document.getElementById("modalContent");

    const isEnrolled = enrolled[id];
    const lessonsDone = completed[id] || [];

    content.innerHTML = `
        <div class="course-icon">${course.icon}</div>
        <span class="category">${course.category}</span>
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <br>
        <h3>Course Lessons</h3>

        ${course.lessons.map((lesson, index) => `
            <label class="lesson">
                <input
                    type="checkbox"
                    ${!isEnrolled ? "disabled" : ""}
                    ${lessonsDone.includes(index) ? "checked" : ""}
                    onchange="toggleLesson(${id},${index},this.checked)"
                >
                <span>${index + 1}. ${lesson}</span>
            </label>
        `).join("")}

        <br>
        <button class="btn"
            onclick="enrollCourse(${id})"
            style="background:#4f46e5;color:white;border:none;cursor:pointer">
            ${isEnrolled ? "Enrolled ✓" : "Enroll Now"}
        </button>
    `;

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("courseModal").style.display = "none";
}

// Enrollment
function enrollCourse(id) {
    if (!enrolled[id]) {
        enrolled[id] = true;
        completed[id] = [];
        saveData();
    }

    openCourse(id);
    renderDashboard();
    updateStats();
}

// Lesson progress
function toggleLesson(courseId, lessonIndex, checked) {
    if (!enrolled[courseId]) return;

    let lessons = completed[courseId] || [];

    if (checked) {
        if (!lessons.includes(lessonIndex)) {
            lessons.push(lessonIndex);
        }
    } else {
        lessons = lessons.filter(i => i !== lessonIndex);
    }

    completed[courseId] = lessons;
    saveData();

    renderDashboard();
    updateStats();
    openCourse(courseId);
}

// Dashboard
function renderDashboard() {
    const grid = document.getElementById("dashboardGrid");

    const myCourses = courses.filter(course => enrolled[course.id]);

    grid.innerHTML = myCourses.map(course => {
        const done = completed[course.id] || [];
        const percent = Math.round(
            done.length / course.lessons.length * 100
        );

        return `
            <div class="course-card">
                <div class="course-icon">${course.icon}</div>
                <h3>${course.title}</h3>
                <p>${course.category}</p>

                <div class="progress">
                    <div class="progress-bar" style="width:${percent}%"></div>
                </div>

                <p>${percent}% completed</p>

                <button onclick="openCourse(${course.id})">
                    Continue Learning
                </button>
            </div>
        `;
    }).join("");

    if (myCourses.length === 0) {
        grid.innerHTML = "<p>You have not enrolled in any courses yet.</p>";
    }
}

// Statistics
function updateStats() {
    document.getElementById("totalCourses").textContent = courses.length;

    const enrolledCount = courses.filter(c => enrolled[c.id]).length;

    document.getElementById("enrolledCourses").textContent = enrolledCount;

    const completedCount = courses.filter(course => {
        const done = completed[course.id] || [];
        return done.length === course.lessons.length && enrolled[course.id];
    }).length;

    document.getElementById("completedCourses").textContent = completedCount;
}

// Search
document.getElementById("searchInput").addEventListener("input", renderCourses);

// Category filter
document.getElementById("categoryFilter").addEventListener("change", renderCourses);

// Close modal on outside click
document.getElementById("courseModal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Initial load
renderCourses();
renderDashboard();
updateStats();
