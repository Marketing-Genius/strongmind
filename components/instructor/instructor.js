(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("instructorMount");
    if (!mount) return;

    // ---- Mock creator + content data (replace later with real data/API) ----
    const creator = {
  id: "sarah-holmes",
  name: "Sarah Holmes",
  handle: "@mrs_holmes",
  <div class="instructor-handle">${creator.handle}</div>
  <div class="role-pill certified" style="display:inline-block; margin-top:8px;">${creator.role}</div>
  role: "Certified Teacher",
  photo: "assets/sarah-holmes.png",
  bio:
    "Certified teacher who blends warm structure with hands-on learning. Expect bite-sized lessons, clear routines, and practical activities you can do at home—built to boost confidence, consistency, and real progress.",
  // Vimeo: https://vimeo.com/1147775555/7da67761df
  introVimeoId: "1147775555",
  introVimeoHash: "7da67761df"
};

    const learnerInterests = (JSON.parse(localStorage.getItem("learnerInterests") || "[]"));
    const purchasedCourses = new Set(JSON.parse(localStorage.getItem("purchasedCourses") || "[]"));

    const courses = [
      {
        id: "algebra-1",
        title: "Algebra 1",
        thumb: "assets/course-algebra.png",
        tags: ["math", "middle-school"],
        rating: 4.8,
        students: 18234,
        forYouScore: learnerInterests.includes("math") ? 95 : 50
      },
      {
        id: "science-101",
        title: "Science 101",
        thumb: "assets/course-science.png",
        tags: ["science", "experiments"],
        rating: 4.7,
        students: 24110,
        forYouScore: learnerInterests.includes("science") ? 92 : 55
      },
      {
        id: "world-history",
        title: "World History",
        thumb: "assets/course-history.png",
        tags: ["history", "humanities"],
        rating: 4.6,
        students: 13500,
        forYouScore: learnerInterests.includes("history") ? 90 : 45
      },
      {
        id: "creative-writing",
        title: "Creative Writing 101",
        thumb: "assets/course-writing.png",
        tags: ["writing", "language-arts"],
        rating: 4.9,
        students: 9800,
        forYouScore: learnerInterests.includes("writing") ? 94 : 48
      }
    ];

    const feed = [
      {
        id: "post-1",
        title: "Weekly Experiment: DIY Volcano",
        type: "post",
        access: "open",
        body: "Try this safe at-home volcano. I’ll post a follow-up with results and variations.",
      },
      {
        id: "video-1",
        title: "Bonus Lesson: Balancing Equations (Members)",
        type: "video",
        access: "locked",
        courseGate: "science-101",
        body: "This video is available after purchasing Science 101.",
      }
    ];

    const products = [
      { id: "kit-1", title: "Beginner Science Lab Kit", price: "$39.99", note: "Great for at-home experiments." },
      { id: "kit-2", title: "Microscope Starter Set", price: "$59.99", note: "Perfect with Science 101." },
      { id: "kit-3", title: "Math Manipulatives Pack", price: "$24.99", note: "Pairs well with Algebra 1." },
      { id: "kit-4", title: "World Map + Timeline Bundle", price: "$29.99", note: "History visual learning." }
    ];

    const rating = {
      avg: 4.8,
      count: 1328,
      comments: [
        { who: "Parent • Arizona", text: "My kid actually asks to do the lessons. That never happens." },
        { who: "Learner • 9th grade", text: "Short videos, super clear. The experiments are fun." },
        { who: "Parent • Homeschool", text: "Love the structure and the friendly tone. Feels premium." }
      ]
    };

    // ---- UI state ----
    let activeTag = "all";
    let sortMode = "popular"; // popular | rated | suggested

    // ---- render helpers ----
    function getAllTags() {
      const set = new Set();
      courses.forEach(c => c.tags.forEach(t => set.add(t)));
      return ["all", ...Array.from(set).sort()];
    }

    function isUnlocked(item) {
      if (item.access === "open") return true;
      if (item.access === "locked" && item.courseGate) {
        return purchasedCourses.has(item.courseGate);
      }
      return false;
    }

    function filteredAndSortedCourses() {
      let list = courses.slice();

      if (activeTag !== "all") {
        list = list.filter(c => c.tags.includes(activeTag));
      }

      if (sortMode === "popular") {
        list.sort((a, b) => b.students - a.students);
      } else if (sortMode === "rated") {
        list.sort((a, b) => b.rating - a.rating);
      } else if (sortMode === "suggested") {
        list.sort((a, b) => b.forYouScore - a.forYouScore);
      }

      return list;
    }

    function render() {
      mount.innerHTML = `
        <div class="instructor-page">

          <!-- HERO -->
          <section class="instructor-hero">
            <img class="instructor-avatar" src="${creator.photo}" alt="${creator.name}">
            <div style="text-align:center; margin-top:10px;">
            <button class="follow-btn" id="followInstructorBtn">Follow</button>
            </div>
            <div class="instructor-meta">
              <h1>${creator.name}</h1>
              <div class="instructor-handle">${creator.handle}</div>
              <div class="instructor-bio">${creator.bio}</div>
            </div>

            <div class="video-card">
              <iframe
                src="https://player.vimeo.com/video/${creator.introVimeoId}?h=${creator.introVimeoHash}&title=0&byline=0&portrait=0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
          </section>

          <!-- COURSES -->
          <div class="instructor-divider">COURSES</div>
          <section class="courses-shell">
            <div class="course-controls">
              <div class="pill-row" id="tagPills"></div>

              <div style="display:flex; gap:10px; align-items:center;">
                <select class="select" id="sortSelect">
                  <option value="popular">Most popular</option>
                  <option value="rated">Highest rated</option>
                  <option value="suggested">Suggested for your learner(s)</option>
                </select>
                <button class="pill" id="viewAllBtn" title="Placeholder">View All Courses</button>
              </div>
            </div>

            <div class="course-grid" id="courseGrid"></div>
          </section>

          <!-- FEED -->
          <div class="instructor-divider">INSTRUCTOR FEED</div>
          <section class="feed-shell" id="feedShell"></section>

          <!-- PRODUCTS -->
          <div class="instructor-divider">SUGGESTED PRODUCTS</div>
          <section class="products-shell">
            <div class="product-grid" id="productGrid"></div>
          </section>

          <!-- RATINGS -->
          <div class="instructor-divider">RATINGS & COMMENTS</div>
          <section class="ratings-shell" id="ratingsShell"></section>

        </div>
      `;

      // tag pills
      const tagPills = document.getElementById("tagPills");
      const tags = getAllTags();
      tagPills.innerHTML = tags.map(t => `
        <button class="pill ${t === activeTag ? "active" : ""}" data-tag="${t}">
          ${t === "all" ? "All" : t}
        </button>
      `).join("");

      tagPills.querySelectorAll("[data-tag]").forEach(btn => {
        btn.addEventListener("click", () => {
          activeTag = btn.getAttribute("data-tag");
          render();
        });
      });

      // sort select
      const sortSelect = document.getElementById("sortSelect");
      sortSelect.value = sortMode;
      sortSelect.addEventListener("change", (e) => {
        sortMode = e.target.value;
        render();
      });

      // view all placeholder
      document.getElementById("viewAllBtn").addEventListener("click", () => {
        alert("Placeholder: View All Courses (future page/modal).");
      });

      // courses
      const courseGrid = document.getElementById("courseGrid");
      const list = filteredAndSortedCourses();
      courseGrid.innerHTML = list.map(c => `
        <div class="course-card" data-course="${c.id}">
          <img class="course-thumb" src="${c.thumb}" alt="${c.title}">
          <div class="course-title">${c.title}</div>
          <div class="course-meta">
            <span>⭐ ${c.rating.toFixed(1)}</span>
            <span>${c.students.toLocaleString()} learners</span>
          </div>
        </div>
      `).join("");

      courseGrid.querySelectorAll("[data-course]").forEach(card => {
        card.addEventListener("click", () => {
          const courseId = card.getAttribute("data-course");
          alert(`Placeholder: open course page for "${courseId}"`);
        });
      });

      // feed
      const feedShell = document.getElementById("feedShell");
      feedShell.innerHTML = feed.map(item => {
        const unlocked = isUnlocked(item);
        const badgeClass = unlocked ? "" : "locked";
        const badgeText = unlocked ? "Open" : "Locked";
        const body = unlocked ? item.body : "Purchase the linked course to unlock this post.";
        return `
          <div class="feed-item">
            <div class="feed-top">
              <div class="feed-title">${item.title}</div>
              <div class="feed-badge ${badgeClass}">${badgeText}</div>
            </div>
            <div style="color:#444; line-height:1.5;">${body}</div>
            ${
              (!unlocked && item.courseGate)
                ? `<div style="margin-top:10px;">
                     <button class="pill" data-buy="${item.courseGate}">Unlock via Course</button>
                   </div>`
                : ""
            }
          </div>
        `;
      }).join("");

      feedShell.querySelectorAll("[data-buy]").forEach(btn => {
        btn.addEventListener("click", () => {
          const courseGate = btn.getAttribute("data-buy");
          alert(`Placeholder: open purchase flow for course "${courseGate}"`);
        });
      });

      // products
      const productGrid = document.getElementById("productGrid");
      productGrid.innerHTML = products.map(p => `
        <div class="product-card">
          <h4>${p.title}</h4>
          <p>${p.price}</p>
          <p style="margin-top:6px; font-weight:600;">${p.note}</p>
          <div style="margin-top:10px;">
            <button class="pill" data-product="${p.id}">View</button>
          </div>
        </div>
      `).join("");

      productGrid.querySelectorAll("[data-product]").forEach(btn => {
        btn.addEventListener("click", () => {
          alert("Placeholder: product detail / affiliate link / cart later.");
        });
      });

      // ratings
      const ratingsShell = document.getElementById("ratingsShell");
      ratingsShell.innerHTML = `
        <div class="rating-summary">
          <div class="star-line">⭐ ${rating.avg.toFixed(1)} average • ${rating.count.toLocaleString()} reviews</div>
          <button class="pill" id="leaveReviewBtn">Leave a Review</button>
        </div>

        ${rating.comments.map(c => `
          <div class="comment">
            <strong>${c.who}</strong>
            <div style="color:#444; line-height:1.5;">${c.text}</div>
          </div>
        `).join("")}
      `;

      document.getElementById("leaveReviewBtn").addEventListener("click", () => {
        alert("Placeholder: review modal (future).");
      });
    }

const followBtn = document.getElementById("followInstructorBtn");
const followKey = `follow_${creator.id}`;

// Restore state
if (localStorage.getItem(followKey) === "true") {
  followBtn.classList.add("following");
  followBtn.textContent = "Following";
}

// Toggle
followBtn.addEventListener("click", () => {
  const isFollowing = followBtn.classList.toggle("following");
  followBtn.textContent = isFollowing ? "Following" : "Follow";
  localStorage.setItem(followKey, isFollowing);
});

    render();
  });
})();
