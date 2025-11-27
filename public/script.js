const input = document.getElementById('text-box');
const button = document.getElementById('saveBtn');
const quote = document.getElementById('quote');
const lastUpdated = document.getElementById('last-updated');

function updateTimestamp() {
    const now = new Date();
    lastUpdated.textContent = 'Last updated: ' + now.toLocaleString();
}

fetch('/api/quote')
    .then(res => res.json())
    .then(data => {
    quote.textContent = data.text;
    lastUpdated.textContent = 'Last updated: ' + new Date(data.updated_at).toLocaleString();
    })
    .catch(err => console.error('Error fetching quote:', err));


function saveQuote() {
    const DEFAULT_QUOTE = 'Job your love';
    const text = input.value.trim();
    if (!text) {
        quote.textContent = DEFAULT_QUOTE;
    }
    else {
        // Save new quote to backend
        fetch('/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        .then(res => res.json())
        .then(data => {
            quote.textContent = data.text;
            lastUpdated.textContent = 'Last updated: ' + new Date(data.updated_at).toLocaleString();
        })
         .catch(err => console.error('Error saving quote:', err));
    }
    input.value = '';
};

button.addEventListener('click', () => saveQuote());
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveQuote();
    }
});