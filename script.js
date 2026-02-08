// Wait for DOM to be ready
let syncButton, statusMessage;

document.addEventListener('DOMContentLoaded', () => {
    syncButton = document.getElementById('syncButton');
    statusMessage = document.getElementById('statusMessage');
    
    if (!syncButton || !statusMessage) {
        console.error('Required elements not found in DOM');
        return;
    }
    
    // Handle sync button click
    if (syncButton) {
        syncButton.addEventListener('click', handleAuthClick);
    } else {
        console.error('Sync button not found!');
    }
});

// Google Calendar API configuration
const CLIENT_ID = '543461783651-ntvpm6kdi1u8bpi1e83l81kc61gv5fgf.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAoaIxstf06U57VuHFKbWPjG8_artoCb9c';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let gapiInited = false;
let gisInited = false;
let tokenClient;

// Ekadashi dates for 2026
const ekadashiDates2026 = [
    { date: '2026-02-13', name: 'Jaya Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-02-27', name: 'Vijaya Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-03-15', name: 'Amalaki Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-03-29', name: 'Papmochani Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-04-13', name: 'Kamada Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-04-28', name: 'Varuthini Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-05-12', name: 'Mohini Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-05-27', name: 'Apara Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-06-11', name: 'Nirjala Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-06-26', name: 'Yogini Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-07-10', name: 'Devshayani Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-07-25', name: 'Kamika Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-08-09', name: 'Pavitropana Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-08-24', name: 'Annada Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-09-07', name: 'Parsva Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-09-22', name: 'Indira Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-10-07', name: 'Pasankusa Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-10-22', name: 'Rama Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-11-05', name: 'Prabodhini Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-11-20', name: 'Utpanna Ekadashi', type: 'Shukla Paksha' },
    { date: '2026-12-05', name: 'Mokshada Ekadashi', type: 'Krishna Paksha' },
    { date: '2026-12-20', name: 'Saphala Ekadashi', type: 'Shukla Paksha' }
];

// Load Google API - must be in global scope
function gapiLoaded() {
    console.log('Google API script loaded');
    if (typeof gapi !== 'undefined') {
        gapi.load('client', initializeGapiClient);
    } else {
        console.error('gapi object not available');
    }
}
window.gapiLoaded = gapiLoaded;

async function initializeGapiClient() {
    try {
        console.log('Initializing Google API client...');
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS,
        });
        gapiInited = true;
        console.log('Google API client initialized');
        maybeEnableButtons();
    } catch (error) {
        console.error('Error initializing Google API client:', error);
    }
}

function gisLoaded() {
    console.log('Google Identity Services script loaded');
    try {
        if (typeof google !== 'undefined' && google.accounts) {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // defined later
            });
            gisInited = true;
            console.log('Google Identity Services initialized');
            maybeEnableButtons();
        } else {
            console.error('Google Identity Services not available');
        }
    } catch (error) {
        console.error('Error initializing Google Identity Services:', error);
    }
}
window.gisLoaded = gisLoaded;

function maybeEnableButtons() {
    console.log(`API status - gapiInited: ${gapiInited}, gisInited: ${gisInited}`);
    if (gapiInited && gisInited) {
        // Make sure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (syncButton) {
                    syncButton.disabled = false;
                    console.log('Sync button enabled');
                }
            });
        } else {
            if (syncButton) {
                syncButton.disabled = false;
                console.log('Sync button enabled');
            } else {
                console.error('Sync button not found when trying to enable');
            }
        }
    } else {
        console.log('APIs not ready yet, button remains disabled');
    }
}

function handleAuthClick() {
    console.log('Sync button clicked');
    
    // Check if APIs are loaded
    if (!gapiInited || !gisInited) {
        statusMessage.className = 'status-message error';
        statusMessage.style.display = 'block';
        statusMessage.textContent = '❌ Google APIs are still loading. Please wait a moment and try again.';
        return;
    }
    
    if (!tokenClient) {
        statusMessage.className = 'status-message error';
        statusMessage.style.display = 'block';
        statusMessage.textContent = '❌ Authentication client not initialized. Please refresh the page.';
        return;
    }
    
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error('Auth error:', resp.error);
            statusMessage.className = 'status-message error';
            statusMessage.style.display = 'block';
            statusMessage.textContent = `❌ Authentication failed: ${resp.error}. Please try again.`;
            syncButton.disabled = false;
            return;
        }
        
        console.log('Authentication successful, adding events...');
        syncButton.disabled = true;
        syncButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Syncing...';
        
        try {
            await addEkadashiEvents();
        } catch (error) {
            console.error('Error adding events:', error);
            statusMessage.className = 'status-message error';
            statusMessage.style.display = 'block';
            statusMessage.textContent = '❌ Error syncing events. Please check the console for details.';
            syncButton.disabled = false;
        }
    };

    try {
        if (gapi.client.getToken() === null) {
            console.log('Requesting access token with consent...');
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            console.log('Requesting access token (already authenticated)...');
            tokenClient.requestAccessToken({prompt: ''});
        }
    } catch (error) {
        console.error('Error requesting token:', error);
        statusMessage.className = 'status-message error';
        statusMessage.style.display = 'block';
        statusMessage.textContent = '❌ Error initiating authentication. Please check browser console.';
    }
}

// Function to check if an event already exists
async function eventExists(summary, date) {
    try {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        const response = await gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            q: summary,
            maxResults: 10,
            singleEvents: true
        });
        
        // Check if any event matches the exact summary and date
        const events = response.result.items || [];
        return events.some(event => {
            const eventDate = event.start.date || event.start.dateTime;
            return event.summary === summary && eventDate.startsWith(date);
        });
    } catch (error) {
        console.error('Error checking for existing event:', error);
        // If check fails, assume event doesn't exist to avoid blocking
        return false;
    }
}

// Function to add events to Google Calendar
async function addEkadashiEvents() {
    const timezone = document.getElementById('timezone').value;
    const tradition = document.getElementById('calendar').value;
    const reminderHours = parseInt(document.getElementById('reminder').value);
    const includeParana = document.getElementById('parana').checked;
    const includeFasting = document.getElementById('fasting').checked;
    
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const ekadashi of ekadashiDates2026) {
        const eventSummary = `🕉️ ${ekadashi.name}`;
        
        // Check if event already exists
        const exists = await eventExists(eventSummary, ekadashi.date);
        if (exists) {
            skippedCount++;
            continue;
        }
        
        let description = `${ekadashi.name} (${ekadashi.type})`;
        
        if (includeFasting) {
            description += '\n\nFasting Guidelines:\n- No grains, beans, or cereals\n- Fruits, vegetables, milk, and nuts are allowed\n- Stay mindful and meditative throughout the day';
        }
        
        if (includeParana) {
            description += '\n\nParana (breaking fast) time will be updated based on your location.';
        }
        
        const event = {
            summary: eventSummary,
            description: description,
            start: {
                date: ekadashi.date,
                timeZone: timezone
            },
            end: {
                date: ekadashi.date,
                timeZone: timezone
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: reminderHours * 60 },
                    { method: 'email', minutes: reminderHours * 60 }
                ]
            },
            colorId: '9' // Blue color for spiritual events
        };
        
        try {
            await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event
            });
            successCount++;
        } catch (error) {
            console.error('Error creating event:', error);
            errorCount++;
        }
    }
    
    // Show success message
    let message = '';
    if (errorCount === 0 && skippedCount === 0) {
        message = `✓ Successfully synced! ${successCount} Ekadashi dates have been added to your Google Calendar.`;
        statusMessage.className = 'status-message success';
        syncButton.innerHTML = '✓ Synced';
    } else if (errorCount === 0) {
        message = `✓ Sync complete! ${successCount} new events added, ${skippedCount} already existed (skipped).`;
        statusMessage.className = 'status-message success';
        syncButton.innerHTML = '✓ Synced';
    } else {
        message = `⚠️ Partially synced. ${successCount} events added, ${skippedCount} skipped, ${errorCount} failed.`;
        statusMessage.className = 'status-message error';
        syncButton.innerHTML = 'Sync with Google Calendar';
        syncButton.disabled = false;
    }
    
    statusMessage.style.display = 'block';
    statusMessage.textContent = message;
    
    // Re-enable button after 3 seconds
    setTimeout(() => {
        syncButton.disabled = false;
        if (errorCount === 0) {
            syncButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg> Sync with Google Calendar';
        }
    }, 3000);
}

// Handle settings changes
document.getElementById('timezone').addEventListener('change', (e) => {
    console.log('Timezone changed to:', e.target.value);
    localStorage.setItem('ekadashi-timezone', e.target.value);
});

document.getElementById('calendar').addEventListener('change', (e) => {
    console.log('Tradition changed to:', e.target.value);
    localStorage.setItem('ekadashi-tradition', e.target.value);
});

document.getElementById('reminder').addEventListener('change', (e) => {
    console.log('Reminder hours changed to:', e.target.value);
    localStorage.setItem('ekadashi-reminder', e.target.value);
});

// Load saved settings
window.addEventListener('DOMContentLoaded', () => {
    const savedTimezone = localStorage.getItem('ekadashi-timezone');
    const savedTradition = localStorage.getItem('ekadashi-tradition');
    const savedReminder = localStorage.getItem('ekadashi-reminder');
    
    if (savedTimezone) document.getElementById('timezone').value = savedTimezone;
    if (savedTradition) document.getElementById('calendar').value = savedTradition;
    if (savedReminder) document.getElementById('reminder').value = savedReminder;
});
