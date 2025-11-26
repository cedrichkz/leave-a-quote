const input = document.getElementById('text-box');
const button = document.getElementById('saveBtn');
const quote = document.getElementById('quote');
const lastUpdated = document.getElementById('last-updated');

function updateTimestamp() {
    const now = new Date();
    lastUpdated.textContent = 'Last updated: ' + now.toLocaleString();
}

fetch('http://localhost:3000/api/quote')
    .then(res => res.json())
    .then(data => {
    quote.textContent = data.text;
    lastUpdated.textContent = 'Last updated: ' + new Date(data.updated_at).toLocaleString();
    });

button.addEventListener('click', () => {
    const DEFAULT_QUOTE = 'Job your love';
    const text = input.value;
    if (!text) {
        quote.textContent = DEFAULT_QUOTE;
    }
    else {
        // Save new quote to backend
        fetch('http://localhost:3000/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        .then(res => res.json())
        .then(data => {
            quote.textContent = data.text;
            lastUpdated.textContent = 'Last updated: ' + new Date(data.updated_at).toLocaleString();
        });
    }
    input.value = '';
});