// Options page JavaScript for BigOasis extension
document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('settings-form').addEventListener('submit', saveSettings);

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['geminiApiKey', 'aiModel']);
    
    if (result.geminiApiKey) {
      document.getElementById('api-key').value = result.geminiApiKey;
    }
    
    if (result.aiModel) {
      document.getElementById('ai-model').value = result.aiModel;
    }
  } catch (error) {
    showStatus('Error loading settings: ' + error.message, 'error');
  }
}

async function saveSettings(event) {
  event.preventDefault();
  
  const apiKey = document.getElementById('api-key').value.trim();
  const aiModel = document.getElementById('ai-model').value;
  
  if (!apiKey) {
    showStatus('Please enter your Gemini API key', 'error');
    return;
  }
  
  try {
    await chrome.storage.sync.set({
      geminiApiKey: apiKey,
      aiModel: aiModel
    });
    
    showStatus('Settings saved successfully! 🎉', 'success');
  } catch (error) {
    showStatus('Error saving settings: ' + error.message, 'error');
  }
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  // Hide status after 3 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}
