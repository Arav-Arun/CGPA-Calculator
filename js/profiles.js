/**
 * Profile Management Module
 * 
 * Handles multi-profile logic, localStorage for cgpaProfiles, 
 * and the custom dropdown UI.
 */

let currentProfiles = null;

/**
 * Initializes profiles from localStorage.
 * Handles migration from old single-state storage (cgpaCalcState).
 */
export function initProfiles() {
  const savedProfiles = localStorage.getItem("cgpaProfiles");
  
  if (!savedProfiles) {
    // Migration: Check if old cgpaCalcState exists
    const oldState = localStorage.getItem("cgpaCalcState");
    const defaultData = oldState ? JSON.parse(oldState) : { marks: {}, cgpa: {} };
    
    currentProfiles = {
      activeProfileId: "default",
      profiles: {
        "default": {
          name: "My Grades",
          data: defaultData
        }
      }
    };
    saveProfilesToDisk();
  } else {
    currentProfiles = JSON.parse(savedProfiles);
  }
}

/**
 * Persists the current profiles object to localStorage.
 */
function saveProfilesToDisk() {
  localStorage.setItem("cgpaProfiles", JSON.stringify(currentProfiles));
}

/**
 * Returns the data object for the currently active profile.
 */
export function getActiveProfileData() {
  if (!currentProfiles) return null;
  const activeId = currentProfiles.activeProfileId;
  return currentProfiles.profiles[activeId].data || { marks: {}, cgpa: {} };
}

/**
 * Updates the data block for the active profile.
 */
export function saveActiveProfileData(data) {
  if (!currentProfiles) return;
  const activeId = currentProfiles.activeProfileId;
  currentProfiles.profiles[activeId].data = data;
  saveProfilesToDisk();
}

/**
 * Logic to switch the active profile or create a new one.
 * @param {string} profileId - The ID to switch to, or "ADD_NEW"
 * @param {Function} onSwitch - Callback to execute after switching
 */
export function switchProfileLogic(profileId, onSwitch) {
  if (profileId === "ADD_NEW") {
    const name = prompt("Enter new profile name:");
    if (!name || name.trim() === "") return;
    
    const newId = "profile_" + Date.now();
    currentProfiles.profiles[newId] = {
      name: name.trim(),
      data: { marks: {}, cgpa: {} }
    };
    currentProfiles.activeProfileId = newId;
    saveProfilesToDisk();
  } else {
    currentProfiles.activeProfileId = profileId;
    saveProfilesToDisk();
  }
  
  if (onSwitch) onSwitch();
}

/**
 * Builds the custom dropdown menu items based on current profiles.
 * @param {Function} onProfileClick - Function called when a profile is selected
 * @param {Function} onAddNewClick - Function called when "Add New" is selected
 */
export function renderProfileMenu(onProfileClick, onAddNewClick) {
  const menu = document.getElementById("profileMenu");
  const activeName = document.getElementById("activeProfileName");
  if (!menu || !activeName) return;
  
  menu.innerHTML = "";
  
  Object.keys(currentProfiles.profiles).forEach(id => {
    const isAct = id === currentProfiles.activeProfileId;
    if (isAct) {
      activeName.textContent = currentProfiles.profiles[id].name;
    }
    
    const btn = document.createElement("button");
    btn.className = "profile-menu-item" + (isAct ? " active" : "");
    btn.textContent = currentProfiles.profiles[id].name;
    btn.onclick = () => onProfileClick(id);
    menu.appendChild(btn);
  });
  
  // Divider
  const div = document.createElement("div");
  div.className = "profile-menu-divider";
  menu.appendChild(div);

  // Add New Button
  const addBtn = document.createElement("button");
  addBtn.className = "profile-menu-item profile-menu-add";
  addBtn.textContent = "+ Add New Profile";
  addBtn.onclick = onAddNewClick;
  menu.appendChild(addBtn);
}
