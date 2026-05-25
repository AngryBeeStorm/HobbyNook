const API_BASE_URL = "http://localhost/hobby-nook-api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const rawText = await response.text();

  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error("Non-JSON response from API:", rawText);
    throw new Error("The server returned an invalid response. Check PHP output.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

async function formRequest(path, formData) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const rawText = await response.text();

  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error("Non-JSON response from API:", rawText);
    throw new Error("The server returned an invalid response. Check PHP output.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Auth
export function registerUser({ name, email, password }) {
  return apiRequest("/auth/register.php", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser({ email, password }) {
  return apiRequest("/auth/login.php", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logoutUser() {
  return apiRequest("/auth/logout.php", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return apiRequest("/auth/me.php");
}

// Projects
export function getProjects() {
  return apiRequest("/projects/list.php");
}

export function getProject(projectId) {
  return apiRequest(`/projects/get.php?id=${encodeURIComponent(projectId)}`);
}

export function createProject(projectData) {
  return apiRequest("/projects/create.php", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export function updateProject(projectId, updates) {
  return apiRequest("/projects/update.php", {
    method: "POST",
    body: JSON.stringify({
      id: projectId,
      ...updates,
    }),
  });
}

export function deleteProject(projectId) {
  return apiRequest("/projects/delete.php", {
    method: "POST",
    body: JSON.stringify({ id: projectId }),
  });
}

export function uploadProjectCover({ projectId, imageFile }) {
  const formData = new FormData();
  formData.append("project_id", projectId);
  formData.append("image", imageFile);

  return formRequest("/projects/upload_cover.php", formData);
}

// Progress updates
export function addProjectUpdate({
  projectId,
  title,
  date,
  hours,
  notes,
  imageFile,
}) {
  const formData = new FormData();

  formData.append("project_id", projectId);
  formData.append("title", title);
  formData.append("date", date);
  formData.append("hours", hours);
  formData.append("notes", notes);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formRequest("/projects/add_update.php", formData);
}

export function editProjectUpdate({
  updateId,
  projectId,
  title,
  date,
  hours,
  notes,
  imageFile,
  keepExistingImage = true,
}) {
  const formData = new FormData();

  formData.append("update_id", updateId);
  formData.append("project_id", projectId);
  formData.append("title", title);
  formData.append("date", date);
  formData.append("hours", hours);
  formData.append("notes", notes);
  formData.append("keep_existing_image", keepExistingImage ? "1" : "0");

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formRequest("/projects/edit_update.php", formData);
}

export function deleteProjectUpdate({ projectId, updateId }) {
  return apiRequest("/projects/delete_update.php", {
    method: "POST",
    body: JSON.stringify({
      project_id: projectId,
      update_id: updateId,
    }),
  });
}

// Inspirations
export function getInspirations() {
  return apiRequest("/inspirations/list.php");
}

export function createInspiration(cardData) {
  return apiRequest("/inspirations/create.php", {
    method: "POST",
    body: JSON.stringify(cardData),
  });
}

export function deleteInspiration(id) {
  return apiRequest("/inspirations/delete.php", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

export function linkInspirationToProject({ projectId, inspirationId }) {
  return apiRequest("/inspirations/link_to_project.php", {
    method: "POST",
    body: JSON.stringify({
      project_id: projectId,
      inspiration_id: inspirationId,
    }),
  });
}

export function unlinkInspirationFromProject({ projectId, inspirationId }) {
  return apiRequest("/inspirations/unlink_from_project.php", {
    method: "POST",
    body: JSON.stringify({
      project_id: projectId,
      inspiration_id: inspirationId,
    }),
  });
}

// Roulette
export function getRouletteItems() {
  return apiRequest("/roulette/list.php");
}

export function saveRouletteItems(items) {
  return apiRequest("/roulette/save.php", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}