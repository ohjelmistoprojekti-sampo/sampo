// Submit item description to the backend and get follow-up questions
const getQuestions = () => {
    const param: string | null = (document.getElementById('item-description') as HTMLInputElement)?.value;
    fetch(`questions?param=${param}`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error();
            }
        }).then(data => {
            createForm(data);
        })
        .catch(e => console.log(e));
}

// Prevent default form submit and call getQuestions() instead
const itemDescriptionForm = document.getElementById("item-description-form");

if (itemDescriptionForm) {
    itemDescriptionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        getQuestions();
    });
}

// Create a follow-up question form
const createForm = (data: Array<{ question: string }>) => {
    let form = document.createElement('form');
    const userInput: { [key: string]: string } = {};

    // Create follow-up question labels and inputs
    data.forEach(item => {
        const label = document.createElement('label');
        label.textContent = item.question;

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', item.question);
        input.setAttribute('required', 'true');
        input.setAttribute('maxlength', '30');

        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value !== null) {
                userInput[item.question] = target.value;
            }
        });

        const lineBreak = document.createElement('br');

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(lineBreak);
    });

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Lähetä';

    form.appendChild(submitButton);

    // Put the new follow-up question form into form-container
    const formContainer = document.getElementById('form-container') as HTMLElement;
    formContainer.innerHTML = '';
    formContainer.appendChild(form);
    formContainer.style.display = "flex"; // show the next section
    formContainer.scrollIntoView({ behavior: 'smooth' }); // scroll into it
    // wait for the scroll animation to finish then hide the first section
    setTimeout(function(){
        document.getElementById("landing-container")!.style.display = "none";
    }, 510);

    // Prevent default submit and call handleFormSubmit instead
    formContainer.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit(userInput);
    });
    return form;
}

// Submit follow-up question form and show returned prices
const handleFormSubmit = (formData: {}) => {
    fetch('submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("fast-sell-price")!.textContent = `${data[0]} €`;
            document.getElementById("optimum-price")!.textContent = `${data[1]} €`;
            document.getElementById("highest-price")!.textContent = `${data[2]} €`;

            const resultContainer = document.getElementById('result-container')
            if (resultContainer) {
                resultContainer.style.display = "flex";
                resultContainer.scrollIntoView({ behavior: "smooth" });

                setTimeout(function(){
                    document.getElementById('form-container')!.style.display = "none";
                }, 600);
            }
        })
        .catch(e => {
            console.error('Error:', e);
        });
}
