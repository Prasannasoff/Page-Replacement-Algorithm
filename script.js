document.getElementById('page-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const pages = document.getElementById('pages').value.split(',').map(Number);
    const framesCount = parseInt(document.getElementById('frames').value);
    const method = document.getElementById('method').value;

    console.log('Selected Method:', method); // Debugging statement

    // Hide all output containers
    document.querySelectorAll('.output').forEach(container => {
        container.style.display = 'none';
        container.innerHTML = ''; // Clear previous results
    });

    // Simulate the selected method
    if (method === 'LRU') {
        console.log('Simulating LRU'); // Debugging statement
        simulateLRU(pages, framesCount);
    } else if (method === 'FIFO') {
        console.log('Simulating FIFO'); // Debugging statement
        simulateFIFO(pages, framesCount);
    } else if (method === 'OPT') {
        console.log('Simulating OPT'); // Debugging statement
        simulateOPT(pages, framesCount);
    }
});

function simulateLRU(pages, framesCount) {
    let frames = [];
    let hits = 0;
    let output = '';

    pages.forEach(page => {
        if (frames.includes(page)) {
            hits++;
            output += `<p>Page ${page} - Hit</p>`;
            // Move the page to the end to mark it as recently used
            frames = frames.filter(f => f !== page);
            frames.push(page);
        } else {
            if (frames.length < framesCount) {
                frames.push(page);
            } else {
                frames.shift();
                frames.push(page);
            }
            output += `<p>Page ${page} - Miss</p>`;
        }
        output += renderFrames(frames);
    });

    output += `<p>Total Hits (LRU): ${hits}</p>`;
    output += `<p>Total Misses (LRU): ${pages.length - hits}</p>`;
    document.getElementById('output-lru').innerHTML = output;
    document.getElementById('output-lru').style.display = 'block';
}

function simulateFIFO(pages, framesCount) {
    let frames = [];
    let hits = 0;
    let output = '';

    pages.forEach(page => {
        if (frames.includes(page)) {
            hits++;
            output += `<p>Page ${page} - Hit</p>`;
        } else {
            if (frames.length < framesCount) {
                frames.push(page);
            } else {
                const removedPage = frames.shift();
                output += `<p>Page ${removedPage} - Removed</p>`;
                frames.push(page);
            }
            output += `<p>Page ${page} - Miss</p>`;
        }
        output += renderFrames(frames);
    });

    output += `<p>Total Hits (FIFO): ${hits}</p>`;
    output += `<p>Total Misses (FIFO): ${pages.length - hits}</p>`;
    document.getElementById('output-fifo').innerHTML = output;
    document.getElementById('output-fifo').style.display = 'block';
}

function simulateOPT(pages, framesCount) {
    let frames = [];
    let hits = 0;
    let output = '';

    pages.forEach((page, index) => {
        if (frames.includes(page)) {
            hits++;
            output += `<p>Page ${page} - Hit</p>`;
        } else {
            if (frames.length < framesCount) {
                frames.push(page);
            } else {
                const pageToReplace = getOptimalPage(pages.slice(index + 1), frames);
                const removedPage = frames.splice(frames.indexOf(pageToReplace), 1)[0];
                output += `<p>Page ${removedPage} - Removed</p>`;
                frames.push(page);
            }
            output += `<p>Page ${page} - Miss</p>`;
        }
        output += renderFrames(frames);
    });

    output += `<p>Total Hits (OPT): ${hits}</p>`;
    output += `<p>Total Misses (OPT): ${pages.length - hits}</p>`;
    document.getElementById('output-opt').innerHTML = output;
    document.getElementById('output-opt').style.display = 'block';
}

function getOptimalPage(futurePages, frames) {
    const futurePageSet = new Set(futurePages);
    for (let frame of frames) {
        if (!futurePageSet.has(frame)) {
            return frame;
        }
    }
    return frames[0];
}

function renderFrames(frames) {
    let frameHtml = '<div class="frame-container">';
    frames.forEach(frame => {
        frameHtml += `<div class="frame">${frame}</div>`;
    });
    frameHtml += '</div>';
    return frameHtml;
}
