"use strict";
// submit item description to backend and get follow up questions
const getQuestions = () => {
    const param = document.getElementById('itemDescription')?.value;
    fetch(`questions?param=${param}`)
        .then(res => {
        if (res.ok) {
            return res.json();
        }
        else {
            throw new Error();
        }
    }).then(data => {
        createForm(data);
    })
        .catch(e => console.log(e));
};
// prevent default form submit and call getQuestions() instead
const itemDescriptionForm = document.getElementById("itemDescriptionForm");
if (itemDescriptionForm) {
    itemDescriptionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        getQuestions();
    });
}
// create a follow up question form
const createForm = (data) => {
    let form = document.createElement('form');
    const userInput = {};
    // create follow up question labels and inputs
    data.forEach(item => {
        const label = document.createElement('label');
        label.textContent = item.question;
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', item.question);
        input.setAttribute('required', 'true');
        input.setAttribute('maxlength', '30');
        input.addEventListener('input', (e) => {
            const target = e.target;
            if (target.value !== null) {
                userInput[item.question] = target.value;
            }
        });
        const lineBreak = document.createElement('br');
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(lineBreak);
    });
    // create the submit button
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Lähetä';
    form.appendChild(submitButton);
    // put the new follow up question form into formContainer
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = '';
    formContainer.appendChild(form);
    // prevent default submit and call handleFormSubmit instead
    formContainer.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit(userInput);
    });
    return form;
};
// submit follow up question form and show returned prices
const handleFormSubmit = (formData) => {
    fetch('submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
        const html = `
                <p>Price 1: ${data[0]}</p>
                <p>Price 2: ${data[1]}</p>
                <p>Price 3: ${data[2]}</p>
            `;
        const resultContainer = document.getElementById('resultContainer');
        if (resultContainer) {
            resultContainer.innerHTML = html;
        }
    })
        .catch(e => {
        console.error('Error:', e);
    });
};
//# sourceMappingURL=script.js.map