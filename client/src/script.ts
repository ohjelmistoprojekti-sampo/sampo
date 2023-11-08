let userSelections = {
    picture: null as string | null,
    condition: null as string | null
};


const moveToPictureSelection = async () => {
    // Capture the item description input and send to server
    const itemDescriptionInput = document.getElementById("item-description") as HTMLInputElement;
    if (itemDescriptionInput) {
        const description = itemDescriptionInput.value;
        await sendItemDescriptionToServer(description);
    }

    const pictureContainer = document.getElementById("picture-container");
    const landingContainer = document.getElementById("landing-container");

    if (pictureContainer) {
        pictureContainer.style.display = "flex";
        pictureContainer.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            if (landingContainer) {
                landingContainer.style.display = "none";
            }
        }, 510);
    }
}

const sendItemDescriptionToServer = async (description: string) => {
    try {
        const res = await fetch('submit-item-description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });

        if (!res.ok) throw new Error("Failed to send item description to server");

    } catch (e) {
        console.error('Error sending item description:', e);
    }
}

// Prevent default form submit and call moveToPictureSelection() instead
const itemDescriptionForm = document.getElementById("item-description-form");

if (itemDescriptionForm) {
    itemDescriptionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        moveToPictureSelection();
        fetchPicturesFromServer();
    });
}

const fetchPicturesFromServer = async () => {
    try {
        const itemDescriptionInput = document.getElementById("item-description") as HTMLInputElement;

        if (itemDescriptionInput) {
            const description = itemDescriptionInput.value;

            const res = await fetch(`pictures/${description}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            populatePictures(data);
        }

    } catch (e) {
        console.error('Error fetching pictures:', e);
    }
}

const populatePictures = (data: Array<{ id: number, url: string }>) => {
    const picturesDiv = document.getElementById("pictures");
    if (picturesDiv) {
        console.log('div found')
        data.forEach(pic => {
            const img = document.createElement("img");
            img.src = pic.url;
            img.addEventListener("click", onPictureSelect);
            picturesDiv.appendChild(img);
        });
    }
}

const onPictureSelect = (e: Event) => {
    userSelections.picture = (e.target as HTMLImageElement).src;
    moveToConditionSelection();
}

document.getElementById("none-of-these-button")?.addEventListener("click", () => {
    userSelections.picture = null;
    moveToConditionSelection();
});

const moveToConditionSelection = () => {
    const conditionContainer = document.getElementById("condition-container");
    const pictureContainer = document.getElementById("picture-container");

    if (conditionContainer) {
        conditionContainer.style.display = "flex";
        conditionContainer.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            if (pictureContainer) {
                pictureContainer.style.display = "none";
            }
        }, 510);
    }
}

const conditionButtons = document.querySelectorAll(".condition");
conditionButtons.forEach(button => {
    button.addEventListener("click", (e: Event) => {
        userSelections.condition = (e.target as HTMLElement).getAttribute("data-value");
        sendSelectionToServer(userSelections);
        moveToPriceSection();
    });
});

const moveToPriceSection = () => {
    const resultContainer = document.getElementById('result-container');
    const conditionContainer = document.getElementById("condition-container");

    if (resultContainer) {
        resultContainer.style.display = "flex";
        resultContainer.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            if (conditionContainer) {
                conditionContainer.style.display = "none";
            }
        }, 510);
    }
}

const sendSelectionToServer = async (data: {}) => {
    try {
        const res = await fetch('submit-selection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to fetch from server");

        const prices = await res.json();

        document.getElementById("fast-sell-price")!.textContent = `${prices[0]} €`;
        document.getElementById("optimum-price")!.textContent = `${prices[1]} €`;
        document.getElementById("highest-price")!.textContent = `${prices[2]} €`;
    } catch (e) {
        console.error('Error sending selection:', e);
    }
}

const openUploadFormButton = document.getElementById('open-upload-form-button') as HTMLElement;
const closeUploadFormButton = document.getElementById('close-upload-form-button') as HTMLElement;
const popup = document.getElementById("popup") as HTMLElement;

openUploadFormButton.addEventListener("click", () => {
    popup.style.display = "block";

    // Add an event listener to the close button
    closeUploadFormButton.addEventListener("click", closePopup);

    // Add an event listener to close the popup when clicking outside
    document.addEventListener("click", closePopupOutside);
});

function closePopupOutside(event: Event) {
    if (event.target === popup) {
        closePopup();
    }
}

function closePopup() {
    popup.style.display = "none";

    // Remove the event listeners when the popup is closed
    closeUploadFormButton.removeEventListener("click", closePopup);
    document.removeEventListener("click", closePopupOutside);
}

const form = document.getElementById('upload-form') as HTMLFormElement;

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {

        const uploadButton = document.getElementById('upload-button');
        if (uploadButton)
            (uploadButton as HTMLButtonElement).style.display = 'none';

        const message = document.getElementById("upload-message");
        if (message)
            (message as HTMLSpanElement).innerText = 'Käsitellään...'

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            if (message)
                (message as HTMLSpanElement).innerText = '';

            closePopup();
            // TODO: Move to the next section in the UI.

        } else {
            if (message)
                (message as HTMLSpanElement).innerText = 'Virhe ladattaessa tiedostoa';

            if (uploadButton)
                (uploadButton as HTMLButtonElement).style.display = 'inline';
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});