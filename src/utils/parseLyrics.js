export async function parseLrc(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Response Error!');
        }
        const lrcContent = await response.text();
        const regex = /\[(\d{2}):(\d{2}\.\d{3})\](.*)/;
        const lyrics = [];
        const lines = lrcContent.split('\n');

        lines.forEach(line => {
            const match = line.match(regex);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2]);
                const text = match[3].trim();
                const timeInSeconds = minutes * 60 + seconds;
                lyrics.push({ time: timeInSeconds, text });
            }
        });

        return lyrics;
    } catch (error) {
        console.error("Failed to fetch lyrics: ", error);
        return [];
    }
}