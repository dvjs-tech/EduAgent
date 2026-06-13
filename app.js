let currentTab = 'explain';

function switchTab(tab, el) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('output').innerHTML = '<p>Enter a topic above and click Go!</p>';
}

async function runAction() {
    const topic = document.getElementById('topicInput').value.trim();
    if (!topic) { alert('Please enter a topic!'); return; }
    
    const out = document.getElementById('output');
    out.innerHTML = '<p>⏳ Loading...</p>';

    let prompt = '';
    if (currentTab === 'explain') {
        prompt = `Explain "${topic}" in simple easy language for a student. Give: 1) Short summary 2) Key points as bullets 3) One real example.`;
    } else if (currentTab === 'quiz') {
        prompt = `Create 5 multiple choice questions about "${topic}". For each question give options A, B, C, D and mark the correct answer.`;
    } else {
        prompt = `Create a 7-day study plan for learning "${topic}". One line per day. Keep it simple and practical.`;
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'YOUR_API_KEY_HERE',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        const text = data.content[0].text;
        out.innerHTML = '<div>' + text.replace(/\n/g, '<br>') + '</div>';

    } catch (error) {
        out.innerHTML = '<p>❌ Error! Please try again.</p>';
    }
}
