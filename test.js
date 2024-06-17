const now = new Date();
const dateString = now.toLocaleDateString();
const timeString = now.toLocaleTimeString();

const current = `${dateString}, ${timeString}`
console.log(now);
const later = '10/18/2026, 1:10:05 AM'
if (later > current) {
    console.log('greater');
}
else {
    console.log('lower');
}