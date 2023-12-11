function respondButtonEmailHandler() {
    document.querySelectorAll('.respond-button').forEach(button => {
        button.addEventListener('click', (event) => {
            // Prevent the default mailto link behavior
            event.preventDefault();

            // Get the card element
            const card = event.target.closest('.card');
            if (!card) return;

            // Extract information from the card
            const title = card.querySelector('#post-card-title').textContent;
            const bodyContent = card.querySelector('#post-card-body').textContent;
            const location = card.querySelector('#location').textContent;
            const fromDate = card.querySelector('#from-date').textContent;
            const toDate = card.querySelector('#to-date').textContent;

            // Construct the email body
            const emailBody = `I am interested in responding to your post titled "${title}".\n\nDetails: ${bodyContent}\nLocation: ${location}\nDate: ${fromDate} - ${toDate}`;

            // Construct and open the mailto link
            const mailtoLink = `mailto:communityfirst.handinhand@gmail.com?subject=Response to ${title}&body=${encodeURIComponent(emailBody)}`;
            window.open(mailtoLink, '_blank');
        });
    });
};

export {respondButtonEmailHandler}